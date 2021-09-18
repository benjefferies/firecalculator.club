import { ENGINE_METHOD_PKEY_ASN1_METHS } from 'constants';
import { AVERAGE_LIFE_EXPECTANCY, Fire, FireData, Graph, InvestmentGrowth } from '../types/types';

export function compoundInterest(principal: number, rate: number, time: number = 1, timesPerYear: number = 1) {
  const amount = principal * Math.pow(1 + (rate * 0.01) / timesPerYear, timesPerYear * time);
  const interest = amount - principal;
  return interest;
}

export function drawdown(amount: number, roi: number, years: number) {
  const ar = amount * (roi * 0.01);
  const drawdown = ar / (1 - Math.pow(1 + roi * 0.01, -years));
  return drawdown;
}

export function calculateFireAmountBasedOnDesiredRoi(desiredAnnualRoi: number, data: FireData): Fire {
  let generalInvestmentAmount = data.generalFundTotal;
  let generalInvestmentAmountDrawdownGrowth = () => compoundInterest(generalInvestmentAmount, data.drawdownRoi);
  let retirementInvestmentAmount = data.retirementFundTotal;
  let retirementInvestmentAmountDrawdownGrowth = () => compoundInterest(retirementInvestmentAmount, data.drawdownRoi);
  let fireAge = data.currentAge;
  while (
    (generalInvestmentAmountDrawdownGrowth() < desiredAnnualRoi && data.currentAge < data.retirementFundAccessAge) ||
    (generalInvestmentAmountDrawdownGrowth() + retirementInvestmentAmountDrawdownGrowth() < desiredAnnualRoi &&
      data.currentAge > data.retirementFundAccessAge)
  ) {
    generalInvestmentAmount +=
      compoundInterest(generalInvestmentAmount, data.investingRoi) + data.generalFundAnnualInvestments;
    retirementInvestmentAmount +=
      compoundInterest(retirementInvestmentAmount, data.investingRoi) + data.retirementFundAnnualInvestments;
    fireAge++;
  }
  let retirementFundAtFire = retirementInvestmentAmount;

  for (let y = 0; y < data.retirementFundAccessAge - fireAge; y++) {
    retirementInvestmentAmount += compoundInterest(retirementInvestmentAmount, data.investingRoi);
  }

  return {
    drawdown: {
      generalDrawdownAmount: desiredAnnualRoi,
      generalDrawdownGraph: calculateDrawdownGraph(
        fireAge,
        generalInvestmentAmount,
        desiredAnnualRoi,
        data.drawdownRoi
      ),
      retirementDrawdownAmount: desiredAnnualRoi,
      retirementDrawdownGraph: calculateDrawdownGraph(
        Math.max(data.currentAge, data.retirementFundAccessAge),
        retirementInvestmentAmount,
        desiredAnnualRoi,
        data.drawdownRoi
      ),
    },
    growth: {
      retirementFundTotal: retirementInvestmentAmount,
      retirementFundAtFire,
      generalFundAtFire: generalInvestmentAmount,
      retirementGrowthGraph: {},
      generalGrowthGraph: {},
    },
    fireAge,
  };
}

function calculateCompoundInterestWithAnnualInvestment(
  startingAmount: number,
  annualInvestmentAmount: number,
  roi: number,
  startInvesting: number,
  endInvesting: number
): InvestmentGrowth {
  const investmentGrowth: InvestmentGrowth = {
    total: 0,
    graph: {},
  };
  let growingTotal = startingAmount;
  for (let y = startInvesting; y < endInvesting; y++) {
    const growth = compoundInterest(growingTotal, roi);
    growingTotal += growth + annualInvestmentAmount;
    investmentGrowth.graph[y] = growingTotal;
  }
  investmentGrowth.total = growingTotal;
  return investmentGrowth;
}

export function calculateFireAmountBasedOnDesiredFireAge(targetFireAge: number, data: FireData): Fire {
  const isRetired = data.currentAge >= data.retirementFundAccessAge
  const hasRetirementFund = data.retirementFundTotal || data.retirementFundAnnualInvestments;
  const hasInvestmentFund = data.generalFundAnnualInvestments || data.generalFundTotal;
  if (hasRetirementFund && !hasInvestmentFund && targetFireAge < data.retirementFundAccessAge) {
    throw new Error('Cannot FIRE before accessing pension without investment fund');
  }
  let retirementAmountInvestingToDesiredFireAge = calculateCompoundInterestWithAnnualInvestment(
    data.retirementFundTotal,
    data.retirementFundAnnualInvestments,
    data.investingRoi,
    data.currentAge,
    targetFireAge
  );
  let retirementAmountAfterFireAge = calculateCompoundInterestWithAnnualInvestment(
    retirementAmountInvestingToDesiredFireAge.total,
    0,
    data.investingRoi,
    targetFireAge,
    data.retirementFundAccessAge
  );
  let generalAmountAtFireAge = calculateCompoundInterestWithAnnualInvestment(
    data.generalFundTotal,
    data.generalFundAnnualInvestments,
    data.investingRoi,
    data.currentAge,
    targetFireAge
  );
  const yearsGeneralNeedsToLast = (hasRetirementFund && !isRetired ? data.retirementFundAccessAge : AVERAGE_LIFE_EXPECTANCY) - targetFireAge;
  const yearsPensionNeedsToLast = AVERAGE_LIFE_EXPECTANCY - Math.max(targetFireAge, data.retirementFundAccessAge)
  const generalDrawdownAmount = drawdown(generalAmountAtFireAge.total, data.drawdownRoi, yearsGeneralNeedsToLast);
  const retirementDrawdownAmount = drawdown(
    retirementAmountAfterFireAge.total,
    data.drawdownRoi,
    yearsPensionNeedsToLast
  );
  const generalDrawdownGraph = calculateDrawdownGraph(
    targetFireAge,
    generalAmountAtFireAge.total,
    generalDrawdownAmount,
    data.drawdownRoi
  );
  const retirementDrawdownGraph = calculateDrawdownGraph(
    Math.max(targetFireAge, data.retirementFundAccessAge),
    retirementAmountAfterFireAge.total,
    retirementDrawdownAmount,
    data.drawdownRoi
  );
  const retirementGrowthGraph = {
    ...retirementAmountInvestingToDesiredFireAge.graph,
    ...retirementAmountAfterFireAge.graph,
  };
  const fire: Fire = {
    drawdown: {
      generalDrawdownAmount: generalDrawdownAmount,
      generalDrawdownGraph: generalDrawdownGraph,
      retirementDrawdownAmount: retirementDrawdownAmount,
      retirementDrawdownGraph,
    },
    fireAge: targetFireAge,
    growth: {
      retirementFundTotal: retirementAmountAfterFireAge.total,
      retirementFundAtFire: retirementAmountInvestingToDesiredFireAge.total,
      generalFundAtFire: generalAmountAtFireAge.total,
      generalGrowthGraph: generalAmountAtFireAge.graph,
      retirementGrowthGraph: retirementGrowthGraph,
    },
  };
  console.log(fire, 'calculateFireAmountBasedOnDesiredFireAge');
  return fire;
}

function calculateDrawdownGraph(age: number, total: number, drawdown: number, roi: number): Graph {
  const graph: Graph = {};
  while (total >= 0 && age <= AVERAGE_LIFE_EXPECTANCY) {
    total = total - drawdown + compoundInterest(total, roi, 1);
    graph[age] = Math.max(total, 0);
    age++;
  }
  return graph;
}
