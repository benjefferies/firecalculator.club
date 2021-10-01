export type Graph = {
  [age: number]: number;
}

export type InvestmentGrowth = {
  graph: Graph;
  total: number;
}

export type Drawdown = {
  generalDrawdownAmount: number;
  generalDrawdownGraph: Graph;
  retirementDrawdownAmount: number;  
  retirementDrawdownGraph: Graph;
}

export type Growth = {
  retirementFundTotal: number;
  retirementFundAtFire: number;
  generalFundAtFire: number;
  generalGrowthGraph: Graph;
  retirementGrowthGraph: Graph;
}

export type Fire = {
  drawdown: Drawdown;
  growth: Growth;
  fireAge: number;
};

export type Coords = {
  x: number|null;
  y: number|null;
};

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
  endAge: number;
};