/* eslint-disable jest/valid-expect */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  compoundInterest,
  drawdown,
  calculateFireAmountBasedOnDesiredFireAge,
  calculateFireAmountBasedOnDesiredRoi,
} from '../../service/FireService';
import { FireData, Fire } from '../../types/types';
import { expect, use } from 'chai';
import chaiSubset from 'chai-subset';
use(chaiSubset);
describe('FireService', () => {
  test('compound interest', () => {
    expect(compoundInterest(10000, 5, 1)).to.equal(500);
  });

  test('drawdown', () => {
    expect(drawdown(10000, 4, 10)).to.be.closeTo(1232.9, 1);
  });

  describe('fire amount desired age', () => {
    test('Age 35 with the desire to FIRE at 35 with a retirement age of 57', () => {
      const fire = calculateFireAmountBasedOnDesiredFireAge(35, {
        currentAge: 35,
        retirementFundTotal: 1000,
        generalFundTotal: 1000,
        investingRoi: 2,
        drawdownRoi: 1,
        retirementFundAnnualInvestments: 10,
        generalFundAnnualInvestments: 10,
        retirementFundAccessAge: 57,
        calculationType: 'retire_age',
        endAge: 82,
      } as FireData);
      expect(fire).to.containSubset({
        drawdown: {
          generalDrawdownAmount: 50.863718478149664,
          retirementDrawdownAmount: 70.19791767318077,
        },
        fireAge: 35,
        growth: {
          generalFundAtFire: 1000,
          retirementFundTotal: 1545.9796707758805,
          retirementFundAtFire: 1000,
        },
      } as Fire);
      expect(fire.drawdown.generalDrawdownGraph[57]).to.be.closeTo(0, 50.863718478149664);
      expect(fire.drawdown.retirementDrawdownGraph[82]).to.be.closeTo(0, 70.19791767318077);
    });
    test('Age 35 with the desire to FIRE at 35 with a retirement age of 57 no retirement fund', () => {
      const fire = calculateFireAmountBasedOnDesiredFireAge(35, {
        currentAge: 35,
        retirementFundTotal: 0,
        generalFundTotal: 1000,
        investingRoi: 2,
        drawdownRoi: 1,
        retirementFundAnnualInvestments: 0,
        generalFundAnnualInvestments: 10,
        retirementFundAccessAge: 57,
        calculationType: 'retire_age',
        endAge: 82,
      } as FireData);
      expect(fire).to.containSubset({
        drawdown: {
          generalDrawdownAmount: 26.77111034259366,
          retirementDrawdownAmount: 0,
        },
        fireAge: 35,
        growth: {
          generalFundAtFire: 1000,
          retirementFundTotal: 0,
          retirementFundAtFire: 0,
        },
      } as Fire);
      expect(fire.drawdown.generalDrawdownGraph[82]).to.be.closeTo(0, 26.77111034259366);
      expect(fire.drawdown.retirementDrawdownGraph[82]).to.be.equal(0);
    });
    test('Age 35 with the desire to FIRE at 35 with a retirement age of 57 no investment fund', () => {
      expect(() =>
        calculateFireAmountBasedOnDesiredFireAge(35, {
          currentAge: 35,
          retirementFundTotal: 1000,
          generalFundTotal: 0,
          investingRoi: 2,
          drawdownRoi: 1,
          retirementFundAnnualInvestments: 10,
          generalFundAnnualInvestments: 0,
          retirementFundAccessAge: 57,
          calculationType: 'retire_age',
          endAge: 82,
        } as FireData)
      ).to.throw(Error);
    });

    test('Age 34 with the desire to FIRE at 35 with a retirement age of 57', () => {
      const fire = calculateFireAmountBasedOnDesiredFireAge(35, {
        currentAge: 34,
        retirementFundTotal: 1000,
        generalFundTotal: 1000,
        investingRoi: 2,
        drawdownRoi: 1,
        retirementFundAnnualInvestments: 10,
        generalFundAnnualInvestments: 10,
        retirementFundAccessAge: 57,
        calculationType: 'retire_age',
        endAge: 82,
        useGeneralUntilEnd: false,
      });
      expect(fire).to.containSubset({
        drawdown: {
          generalDrawdownAmount: 52.38963003249415,
          retirementDrawdownAmount: 72.3038552033762,
        },
        fireAge: 35,
        growth: {
          generalFundAtFire: 1030,
          retirementFundTotal: 1592.3590608991572,
          retirementFundAtFire: 1030,
        },
      });
      expect(fire.drawdown.generalDrawdownGraph[57]).to.be.closeTo(0, 52.38963003249415);
      expect(fire.drawdown.retirementDrawdownGraph[82]).to.be.closeTo(0, 72.3038552033762);
      expect(fire.growth.generalGrowthGraph[34]).to.be.equal(1030);
      expect(fire.growth.retirementGrowthGraph[56]).to.be.equal(1592.3590608991572);
    });

    test('Age 33 with the desire to FIRE at 35 with a retirement age of 57', () => {
      const fire = calculateFireAmountBasedOnDesiredFireAge(35, {
        currentAge: 33,
        retirementFundTotal: 1000,
        generalFundTotal: 1000,
        investingRoi: 2,
        drawdownRoi: 1,
        retirementFundAnnualInvestments: 10,
        generalFundAnnualInvestments: 10,
        retirementFundAccessAge: 57,
        calculationType: 'retire_age',
        endAge: 82,
        useGeneralUntilEnd: false,
      });
      expect(fire).to.containSubset({
        drawdown: {
          generalDrawdownAmount: 53.94605981792553,
          retirementDrawdownAmount: 74.45191148417548,
        },
        fireAge: 35,
        growth: {
          generalFundAtFire: 1060.6,
          retirementFundTotal: 1639.6660388248984,
          retirementFundAtFire: 1060.6,
        },
      } as Fire);
      expect(fire.drawdown.generalDrawdownGraph[57]).to.be.closeTo(0, 53.94605981792553);
      expect(fire.drawdown.retirementDrawdownGraph[82]).to.be.closeTo(0, 74.45191148417548);
      expect(fire.growth.generalGrowthGraph[34]).to.be.equal(1060.6);
      expect(fire.growth.retirementGrowthGraph[56]).to.be.equal(1639.6660388248984);
    });

    test('Age 32 with the desire to FIRE at 35 with a retirement age of 57', () => {
      const fire = calculateFireAmountBasedOnDesiredFireAge(35, {
        currentAge: 32,
        retirementFundTotal: 1000,
        generalFundTotal: 1000,
        investingRoi: 2,
        drawdownRoi: 1,
        retirementFundAnnualInvestments: 10,
        generalFundAnnualInvestments: 10,
        retirementFundAccessAge: 57,
        calculationType: 'retire_age',
        endAge: 82,
        useGeneralUntilEnd: false,
      });
      expect(fire).to.containSubset({
        drawdown: {
          generalDrawdownAmount: 55.533618199065536,
          retirementDrawdownAmount: 76.64292889059085,
        },
        fireAge: 35,
        growth: {
          generalFundAtFire: 1091.812,
          retirementFundTotal: 1687.9191563091558,
          retirementFundAtFire: 1091.812,
        },
      } as Fire);
      expect(fire.drawdown.generalDrawdownGraph[57]).to.be.closeTo(0, 55.533618199065536);
      expect(fire.drawdown.retirementDrawdownGraph[82]).to.be.closeTo(0, 76.64292889059085);
      expect(fire.growth.generalGrowthGraph[34]).to.be.equal(1091.812);
      expect(fire.growth.retirementGrowthGraph[56]).to.be.equal(1687.9191563091558);
    });

    test('Age 57 with the desire to FIRE at 57 with a retirement age of 57', () => {
      const fire = calculateFireAmountBasedOnDesiredFireAge(57, {
        currentAge: 57,
        retirementFundTotal: 1000,
        generalFundTotal: 1000,
        investingRoi: 2,
        drawdownRoi: 1,
        retirementFundAnnualInvestments: 10,
        generalFundAnnualInvestments: 10,
        retirementFundAccessAge: 57,
        calculationType: 'retire_age',
        endAge: 82,
        useGeneralUntilEnd: false,
      });
      expect(fire).to.containSubset({
        drawdown: {
          generalDrawdownAmount: 45.406753400547984,
          retirementDrawdownAmount: 45.406753400547984,
        },
        fireAge: 57,
        growth: {
          generalFundAtFire: 1000,
          retirementFundTotal: 1000,
          retirementFundAtFire: 1000,
        },
      } as Fire);
      expect(fire.drawdown.generalDrawdownGraph[57]).to.be.closeTo(1000, 45.406753400547984);
      expect(fire.drawdown.generalDrawdownGraph[82]).to.be.closeTo(0, 45.406753400547984);
      expect(fire.drawdown.retirementDrawdownGraph[57]).to.be.closeTo(1000, 45.406753400547984);
      expect(fire.drawdown.retirementDrawdownGraph[82]).to.be.closeTo(0, 45.406753400547984);
      expect(fire.growth.generalGrowthGraph).to.be.empty;
      expect(fire.growth.retirementGrowthGraph).to.be.empty;
    });

    test('Age 57 with the desire to FIRE at 65 with a retirement age of 57', () => {
      const fire = calculateFireAmountBasedOnDesiredFireAge(65, {
        currentAge: 57,
        retirementFundTotal: 1000,
        generalFundTotal: 1000,
        investingRoi: 2,
        drawdownRoi: 1,
        retirementFundAnnualInvestments: 10,
        generalFundAnnualInvestments: 10,
        retirementFundAccessAge: 57,
        calculationType: 'retire_age',
        endAge: 82,
        useGeneralUntilEnd: false,
      });
      expect(fire).to.containSubset({
        drawdown: {
          generalDrawdownAmount: 80.80380209475548,
          retirementDrawdownAmount: 80.80380209475548,
        },
        fireAge: 65,
        growth: {
          generalFundAtFire: 1257.4890715033985,
          retirementFundTotal: 1257.4890715033985,
          retirementFundAtFire: 1257.4890715033985,
        },
      } as Fire);
      expect(fire.drawdown.generalDrawdownGraph[82]).to.be.equal(0);
      expect(fire.drawdown.retirementDrawdownGraph[82]).to.be.equal(0);
      expect(fire.growth.generalGrowthGraph[64]).to.be.equal(1257.4890715033985);
      expect(fire.growth.retirementGrowthGraph[64]).to.be.equal(1257.4890715033985);
    });

    test('Age 65 with the desire to FIRE at 65 with a retirement age of 57', () => {
      const fire = calculateFireAmountBasedOnDesiredFireAge(65, {
        currentAge: 65,
        retirementFundTotal: 1000,
        generalFundTotal: 1000,
        investingRoi: 2,
        drawdownRoi: 1,
        retirementFundAnnualInvestments: 10,
        generalFundAnnualInvestments: 10,
        retirementFundAccessAge: 57,
        calculationType: 'retire_age',
        endAge: 82,
        useGeneralUntilEnd: false,
      });
      expect(fire).to.containSubset({
        drawdown: {
          generalDrawdownAmount: 64.25805514011347,
          retirementDrawdownAmount: 64.25805514011347,
        },
        fireAge: 65,
        growth: {
          generalFundAtFire: 1000,
          retirementFundTotal: 1000,
          retirementFundAtFire: 1000,
        },
      } as Fire);
      expect(fire.drawdown.generalDrawdownGraph[57]).to.be.undefined;
      expect(fire.drawdown.retirementDrawdownGraph[82]).to.be.equal(0);
      expect(fire.growth.generalGrowthGraph).to.be.empty;
      expect(fire.growth.retirementGrowthGraph).to.be.empty;
    });

    test('Age 33 with the desire to FIRE at 57 with a retirement age of 57', () => {
      const fire = calculateFireAmountBasedOnDesiredFireAge(57, {
        calculationType: 'retire_age',
        retirementFundTotal: 100,
        retirementFundAnnualInvestments: 10,
        generalFundTotal: 20,
        generalFundAnnualInvestments: 30,
        investingRoi: 7,
        drawdownRoi: 4,
        currentAge: 33,
        endAge: 82,
        retirementFundAccessAge: 57,
        targetAge: 57,
        useGeneralUntilEnd: false,
      });
      expect(fire).to.containSubset({
        drawdown: {
          generalDrawdownAmount: 118.21392981015524,
          retirementDrawdownAmount: 69.70924530492715,
        },
        fireAge: 57,
        growth: {
          generalFundAtFire: 1846.7474619473817,
          retirementFundTotal: 1089.003402965143,
          retirementFundAtFire: 1089.003402965143,
        },
      } as Fire);
      expect(fire.drawdown.generalDrawdownGraph[57]).to.be.equal(1802.4034306151218);
      expect(fire.drawdown.retirementDrawdownGraph[82]).to.be.equal(0);
      expect(fire.growth.generalGrowthGraph[56]).to.be.equal(1846.7474619473817);
      expect(fire.growth.retirementGrowthGraph[56]).to.be.equal(1089.003402965143);
    });

    test('Age 55 with the desire to FIRE at 66 with a retirement age of 57', () => {
      const fire = calculateFireAmountBasedOnDesiredFireAge(66, {
        calculationType: 'retire_age',
        retirementFundTotal: 10000,
        retirementFundAnnualInvestments: 5000,
        generalFundTotal: 33232,
        generalFundAnnualInvestments: 4000,
        investingRoi: 7,
        drawdownRoi: 4,
        currentAge: 55,
        endAge: 82,
        retirementFundAccessAge: 57,
        targetAge: 66,
        useGeneralUntilEnd: false,
      });
      expect(fire).to.containSubset({
        drawdown: {
          generalDrawdownAmount: 11421.168998098792,
          retirementDrawdownAmount: 8579.126335283112,
        },
        fireAge: 66,
        growth: {
          generalFundAtFire: 133082.8373531045,
          retirementFundTotal: 99966.51611584374,
          retirementFundAtFire: 99966.51611584374,
        },
      } as Fire);
      expect(fire.drawdown.generalDrawdownGraph[66]).to.be.equal(126984.9818491299);
      expect(fire.drawdown.generalDrawdownGraph[82]).to.be.equal(0);
      expect(fire.drawdown.retirementDrawdownGraph[66]).to.be.equal(95386.05042519438);
      expect(fire.drawdown.retirementDrawdownGraph[82]).to.be.equal(0);
      expect(fire.growth.generalGrowthGraph[65]).to.be.equal(133082.8373531045);
      expect(fire.growth.retirementGrowthGraph[65]).to.be.equal(99966.51611584374);
    });
  });

  describe('fire amount desired roi', () => {
    test('Age 35 with the desire to FIRE at £3000 before retirement age at 57', () => {
      const fire = calculateFireAmountBasedOnDesiredRoi(3000, {
        currentAge: 35,
        retirementFundAccessAge: 57,
        retirementFundTotal: 20000,
        generalFundTotal: 10000,
        investingRoi: 6,
        drawdownRoi: 4,
        retirementFundAnnualInvestments: 1000,
        generalFundAnnualInvestments: 1000,
        calculationType: 'retire_roi_amount',
        endAge: 82,
        useGeneralUntilEnd: false,
      });
      expect(fire).to.containSubset({
        drawdown: {
          generalDrawdownAmount: 3000,
          retirementDrawdownAmount: 3000,
        },
        fireAge: 57,
        growth: {
          generalFundAtFire: 79427.66444208944,
          retirementFundTotal: 122390.8209243454,
          retirementFundAtFire: 115463.03860787302,
        },
      } as Fire);
      expect(fire.drawdown.generalDrawdownGraph[57]).to.be.closeTo(79427.66444208944, 3000);
      expect(fire.drawdown.generalDrawdownGraph[82]).to.be.greaterThan(79427.66444208944);
      expect(fire.drawdown.retirementDrawdownGraph[57]).to.be.closeTo(122390.8209243454, 3000);
      expect(fire.drawdown.retirementDrawdownGraph[82]).to.be.greaterThan(115463.03860787302);
      expect(fire.growth.generalGrowthGraph[35]).to.be.equal(10000);
      expect(fire.growth.retirementGrowthGraph[57]).to.be.closeTo(122390.8209243454, 3000);
    });

    test('Age 60 with the desire to FIRE at £3000 after retirement age at 57', () => {
      const fire = calculateFireAmountBasedOnDesiredRoi(3000, {
        currentAge: 60,
        retirementFundAccessAge: 57,
        retirementFundTotal: 20000,
        generalFundTotal: 10000,
        investingRoi: 6,
        drawdownRoi: 4,
        retirementFundAnnualInvestments: 2000,
        generalFundAnnualInvestments: 2000,
        calculationType: 'retire_roi_amount',
        endAge: 82,
        useGeneralUntilEnd: false,
      });
      expect(fire).to.containSubset({
        drawdown: {
          generalDrawdownAmount: 1272.9591155850248,
          retirementDrawdownAmount: 1874.411219181573,
        },
        fireAge: 67,
        growth: {
          generalFundAtFire: 31823.977889625607,
          retirementFundTotal: 46860.280479539215,
          retirementFundAtFire: 46860.280479539215,
        },
      } as Fire);
      expect(fire.drawdown.generalDrawdownGraph[67]).to.be.closeTo(31823.977889625607, 1272.9591155850248);
      expect(fire.drawdown.generalDrawdownGraph[82]).to.be.closeTo(31823.977889625607, 1272.9591155850248);
      expect(fire.drawdown.retirementDrawdownGraph[67]).to.be.closeTo(46860.280479539215, 1874.411219181573);
      expect(fire.drawdown.retirementDrawdownGraph[82]).to.be.closeTo(46860.280479539215, 1874.411219181573);
      expect(fire.growth.generalGrowthGraph[60]).to.be.equal(10000);
      expect(fire.growth.retirementGrowthGraph[60]).to.be.equal(20000);
    });
  });
});
