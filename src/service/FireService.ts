import LocaleCurrency from "locale-currency";

export const formatCurrency = (money: number) => {
  return money.toLocaleString(navigator.language, {
    style: "currency",
    currency: LocaleCurrency.getCurrency(navigator.language),
  });
};

export const AVERAGE_LIFE_EXPECTANCY = 82;

export type FireData = {
  calculationType: "retire_age" | "retire_roi_amount";
  retirementFundTotal: number;
  generalFundTotal: number;
  retirementFundAnnualInvestments: number;
  generalFundAnnualInvestments: number;
  investingRoi: number;
  drawdownRoi: number;
  currentAge: number;
  retirementFundAccessAge: number;
  targetAge?: number;
  targetAnnualRoi?: number;
};

export type FireAmount = {
  retirementFundTotal: number;
  retirementFundAtFire: number;
  generalFundAtFire: number;
  fireAge: number;
};

export function compoundInterest(
  principal: number,
  rate: number,
  time: number = 1,
  timesPerYear: number = 1
) {
  const amount =
    principal * Math.pow(1 + (rate * 0.01) / timesPerYear, timesPerYear * time);
  const interest = amount - principal;
  return interest;
}

export function drawdown(amount: number, roi: number, years: number) {
  const ar = amount * (roi * 0.01);
  const drawdown = ar / (1 - Math.pow(1 + roi * 0.01, -years));
  return drawdown;
}

export function calculateFireAmountBasedOnDesiredRoi(
  desiredAnnualRoi: number,
  data: FireData
): Fire {
  let generalInvestmentAmount = data.generalFundTotal;
  let generalInvestmentAmountDrawdownGrowth = () =>
    compoundInterest(generalInvestmentAmount, data.drawdownRoi);
  let retirementInvestmentAmount = data.retirementFundTotal;
  let retirementInvestmentAmountDrawdownGrowth = () =>
    compoundInterest(retirementInvestmentAmount, data.drawdownRoi);
  let fireAge = data.currentAge;
  while (
    (generalInvestmentAmountDrawdownGrowth() < desiredAnnualRoi &&
      data.currentAge < data.retirementFundAccessAge) ||
    (generalInvestmentAmountDrawdownGrowth() +
      retirementInvestmentAmountDrawdownGrowth() <
      desiredAnnualRoi &&
      data.currentAge > data.retirementFundAccessAge)
  ) {
    generalInvestmentAmount +=
      compoundInterest(generalInvestmentAmount, data.investingRoi) +
      data.generalFundAnnualInvestments;
    retirementInvestmentAmount +=
      compoundInterest(retirementInvestmentAmount, data.investingRoi) +
      data.retirementFundAnnualInvestments;
    fireAge++;
  }
  let retirementFundAtFire = retirementInvestmentAmount;

  for (let y = 0; y < data.retirementFundAccessAge - fireAge; y++) {
    retirementInvestmentAmount += compoundInterest(
      retirementInvestmentAmount,
      data.investingRoi
    );
  }

  return {
    generalDrawdownAmount: desiredAnnualRoi,
    pensionDrawdownAmount: desiredAnnualRoi,
    fireAmount: {
      retirementFundTotal: retirementInvestmentAmount,
      retirementFundAtFire,
      generalFundAtFire: generalInvestmentAmount,
      fireAge,
    },
  };
}

function calculateCompoundInterestWithAnnualInvestment(
  startingAmount: number,
  annualInvestmentAmount: number,
  roi: number,
  yearsToInvest: number
) {
  let growingTotal = startingAmount;
  for (let y = 0; y < yearsToInvest; y++) {
    const growth = compoundInterest(growingTotal, roi);
    growingTotal += growth + annualInvestmentAmount;
  }
  return growingTotal;
}

export function calculateFireAmountBasedOnDesiredFireAge(
  desiredAge: number,
  data: FireData
): Fire {
  let retirementAmountInvestingToDesiredFireAge =
    calculateCompoundInterestWithAnnualInvestment(
      data.retirementFundTotal,
      data.retirementFundAnnualInvestments,
      data.investingRoi,
      desiredAge - data.currentAge
    );
  let retirementAmountAtRetirementAge =
    calculateCompoundInterestWithAnnualInvestment(
      retirementAmountInvestingToDesiredFireAge,
      0,
      data.investingRoi,
      data.retirementFundAccessAge - desiredAge
    );
  let generalAmountAtFireAge = calculateCompoundInterestWithAnnualInvestment(
    data.generalFundTotal,
    data.generalFundAnnualInvestments,
    data.investingRoi,
    desiredAge - data.currentAge
  );
  const hasRetirementFund =
    data.retirementFundAnnualInvestments && data.retirementFundTotal;
  const yearsGeneralNeedsToLast = hasRetirementFund
    ? data.retirementFundAccessAge - desiredAge
    : AVERAGE_LIFE_EXPECTANCY - desiredAge;
  const generalDrawdownAmount = drawdown(
    generalAmountAtFireAge,
    data.drawdownRoi,
    yearsGeneralNeedsToLast
  );
  const pensionDrawdownAmount = drawdown(
    retirementAmountAtRetirementAge,
    data.drawdownRoi,
    AVERAGE_LIFE_EXPECTANCY -
      Math.max(data.currentAge, data.retirementFundAccessAge)
  );
  const fire: Fire = {
    generalDrawdownAmount: generalDrawdownAmount,
    pensionDrawdownAmount: hasRetirementFund ? pensionDrawdownAmount : generalDrawdownAmount,
    fireAmount: {
      retirementFundTotal: retirementAmountAtRetirementAge,
      retirementFundAtFire: retirementAmountInvestingToDesiredFireAge,
      generalFundAtFire: generalAmountAtFireAge,
      fireAge: desiredAge,
    },
  };
  console.log(fire, "calculateFireAmountBasedOnDesiredFireAge");
  return fire;
}

export type Fire = {
  generalDrawdownAmount: number;
  pensionDrawdownAmount: number;
  fireAmount: FireAmount;
};
