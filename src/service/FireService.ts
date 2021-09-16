import LocaleCurrency from 'locale-currency';
import { FireData, Fire, AVERAGE_LIFE_EXPECTANCY, Graph, InvestmentGrowth } from '../types/types';

export const formatCurrency = (money: number) => {
  return money.toLocaleString(navigator.language, {
    style: 'currency',
    currency: LocaleCurrency.getCurrency(navigator.language),
  });
};

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
    generalInvestmentAmount += compoundInterest(generalInvestmentAmount, data.investingRoi) + data.generalFundAnnualInvestments;
    retirementInvestmentAmount += compoundInterest(retirementInvestmentAmount, data.investingRoi) + data.retirementFundAnnualInvestments;
    fireAge++;
  }
  let retirementFundAtFire = retirementInvestmentAmount;

  for (let y = 0; y < data.retirementFundAccessAge - fireAge; y++) {
    retirementInvestmentAmount += compoundInterest(retirementInvestmentAmount, data.investingRoi);
  }

  return {
    drawdown: {
      generalDrawdownAmount: desiredAnnualRoi,
      generalDrawdownGraph: calculateDrawdownGraph(fireAge, generalInvestmentAmount, desiredAnnualRoi, data.drawdownRoi),
      pensionDrawdownAmount: desiredAnnualRoi,
      pensionDrawdownGraph: calculateDrawdownGraph(
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

export function calculateFireAmountBasedOnDesiredFireAge(desiredAge: number, data: FireData): Fire {
  let retirementAmountInvestingToDesiredFireAge = calculateCompoundInterestWithAnnualInvestment(
    data.retirementFundTotal,
    data.retirementFundAnnualInvestments,
    data.investingRoi,
    data.currentAge,
    desiredAge
  );
  let retirementAmountAtRetirementAge = calculateCompoundInterestWithAnnualInvestment(
    retirementAmountInvestingToDesiredFireAge.total,
    0,
    data.investingRoi,
    desiredAge,
    data.retirementFundAccessAge
  );
  let generalAmountAtFireAge = calculateCompoundInterestWithAnnualInvestment(
    data.generalFundTotal,
    data.generalFundAnnualInvestments,
    data.investingRoi,
    data.currentAge,
    desiredAge
  );
  const hasRetirementFund = data.retirementFundAnnualInvestments && data.retirementFundTotal;
  const yearsGeneralNeedsToLast = hasRetirementFund ? data.retirementFundAccessAge - desiredAge : AVERAGE_LIFE_EXPECTANCY - desiredAge;
  const generalDrawdownAmount = drawdown(generalAmountAtFireAge.total, data.drawdownRoi, yearsGeneralNeedsToLast);
  const pensionDrawdownAmount = drawdown(
    retirementAmountAtRetirementAge.total,
    data.drawdownRoi,
    AVERAGE_LIFE_EXPECTANCY - Math.max(data.currentAge, data.retirementFundAccessAge)
  );
  const fire: Fire = {
    drawdown: {
      generalDrawdownAmount: generalDrawdownAmount,
      generalDrawdownGraph: calculateDrawdownGraph(desiredAge, generalAmountAtFireAge.total, generalDrawdownAmount, data.drawdownRoi),
      pensionDrawdownAmount: hasRetirementFund ? pensionDrawdownAmount : generalDrawdownAmount,
      pensionDrawdownGraph: calculateDrawdownGraph(
        data.retirementFundAccessAge,
        retirementAmountAtRetirementAge.total,
        hasRetirementFund ? pensionDrawdownAmount : generalDrawdownAmount,
        data.drawdownRoi
      ),
    },
    fireAge: desiredAge,
    growth: {
      retirementFundTotal: retirementAmountAtRetirementAge.total,
      retirementFundAtFire: retirementAmountInvestingToDesiredFireAge.total,
      generalFundAtFire: generalAmountAtFireAge.total,
      generalGrowthGraph: generalAmountAtFireAge.graph,
      retirementGrowthGraph: { ...retirementAmountInvestingToDesiredFireAge.graph, ...retirementAmountAtRetirementAge.graph },
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
