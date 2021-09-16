import { compoundInterest, drawdown, calculateFireAmountBasedOnDesiredFireAge } from '../../service/FireService';
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
    test('Retire same age', () => {
      global.navigator = {
        language: 'en-GB',
      } as Navigator;
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
      } as FireData);
      expect(fire).to.containSubset({
        drawdown: {
          generalDrawdownAmount: 50.863718478149664,
          pensionDrawdownAmount: 70.19791767318077,
        },
        fireAge: 35,
        growth: {
          generalFundAtFire: 1000,
          retirementFundTotal: 1545.9796707758805,
          retirementFundAtFire: 1000
        },
      } as Fire);
      expect(fire.drawdown.generalDrawdownGraph[57]).to.be.equal(0);
      expect(fire.drawdown.pensionDrawdownGraph[82]).to.be.equal(0);
    });

    test('Retire 1 year away', () => {
      global.navigator = {
        language: 'en-GB',
      } as Navigator;
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
      });
      expect(fire).to.containSubset({
        drawdown: {
          generalDrawdownAmount: 52.38963003249415,
          pensionDrawdownAmount: 72.3038552033762,
        },
        fireAge: 35,
        growth: {
          generalFundAtFire: 1030,
          retirementFundTotal: 1592.3590608991572,
          retirementFundAtFire: 1030
        },
      });
      expect(fire.drawdown.generalDrawdownGraph[57]).to.be.equal(0);
      expect(fire.drawdown.pensionDrawdownGraph[82]).to.be.equal(0);
      expect(fire.growth.generalGrowthGraph[34]).to.be.equal(1030);
      expect(fire.growth.retirementGrowthGraph[56]).to.be.equal(1592.3590608991572);
    });

    test('Retire 2 year away', () => {
      global.navigator = {
        language: 'en-GB',
      } as Navigator;
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
      });
      expect(fire).to.containSubset({
        drawdown: {
          generalDrawdownAmount: 53.94605981792553,
          pensionDrawdownAmount: 74.45191148417548,
        },
        fireAge: 35,
        growth: {
          generalFundAtFire: 1060.6,
          retirementFundTotal: 1639.6660388248984,
          retirementFundAtFire: 1060.6
        },
      } as Fire);
      expect(fire.drawdown.generalDrawdownGraph[57]).to.be.equal(0);
      expect(fire.drawdown.pensionDrawdownGraph[82]).to.be.equal(0);
      expect(fire.growth.generalGrowthGraph[34]).to.be.equal(1060.6);
      expect(fire.growth.retirementGrowthGraph[56]).to.be.equal(1639.6660388248984);
    });
    test('Retire 3 year away', () => {
      global.navigator = {
        language: 'en-GB',
      } as Navigator;
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
      });
      expect(fire).to.containSubset({
        drawdown: {
          generalDrawdownAmount: 55.533618199065536,
          pensionDrawdownAmount: 76.64292889059085,
        },
        fireAge: 35,
        growth: {
          generalFundAtFire: 1091.812,
          retirementFundTotal: 1687.9191563091558,
          retirementFundAtFire: 1091.812,
        },
      } as Fire);
      expect(fire.drawdown.generalDrawdownGraph[57]).to.be.equal(0);
      expect(fire.drawdown.pensionDrawdownGraph[82]).to.be.equal(0);
      expect(fire.growth.generalGrowthGraph[34]).to.be.equal(1091.812);
      expect(fire.growth.retirementGrowthGraph[56]).to.be.equal(1687.9191563091558);
    });
  });

  // describe("fire amount desired roi", () => {
  //   test("Retire at 10 roi", () => {
  //     global.navigator = {
  //       language: "en-GB",
  //     } as Navigator;
  //     expect(
  //       calculateFireAmountBasedOnDesiredRoi(35, {
  //         currentAge: 35,
  //         retirementFundTotal: 1000,
  //         generalFundTotal: 1000,
  //         investingRoi: 2,
  //         drawdownRoi: 1,
  //         retirementFundAnnualInvestments: 10,
  //         generalFundAnnualInvestments: 10,
  //         retirementFundAccessAge: 57,
  //       } as FireData)
  //     ).to.containSubset({
  //       generalDrawdownAmount: 50.863718478149664,
  //       leftAtLifeExpectancy: 0,
  //       pensionDrawdownAmount: 70.19791767318077,
  //       runOutAgeGeneral: 82,
  //       runOutAgePension: 82,
  //       runOutBeforeRetirement: false,
  //       fireAmount: {
  //         fireAge: 35,
  //         generalFundAtFire: 1000,
  //         retirementFundTotal: 1545.9796707758805,
  //       } as FireAmount,
  //     } as Fire);
  //   });

  //   test("Retire 1 year away", () => {
  //     global.navigator = {
  //       language: "en-GB",
  //     } as Navigator;
  //     expect(
  //       calculateFireAmountBasedOnDesiredRoi(35, {
  //         currentAge: 34,
  //         retirementFundTotal: 1000,
  //         generalFundTotal: 1000,
  //         investingRoi: 2,
  //         drawdownRoi: 1,
  //         retirementFundAnnualInvestments: 10,
  //         generalFundAnnualInvestments: 10,
  //         retirementFundAccessAge: 57,
  //       } as FireData)
  //     ).to.containSubset({
  //       generalDrawdownAmount: 52.38963003249415,
  //       leftAtLifeExpectancy: 0,
  //       pensionDrawdownAmount: 72.3038552033762,
  //       runOutAgeGeneral: 82,
  //       runOutAgePension: 82,
  //       runOutBeforeRetirement: false,
  //       fireAmount: {
  //         fireAge: 35,
  //         generalFundAtFire: 1030,
  //         retirementFundTotal: 1592.3590608991572,
  //       } as FireAmount,
  //     } as Fire);
  //   });

  //   test("Retire 2 year away", () => {
  //     global.navigator = {
  //       language: "en-GB",
  //     } as Navigator;
  //     expect(
  //       calculateFireAmountBasedOnDesiredRoi(35, {
  //         currentAge: 33,
  //         retirementFundTotal: 1000,
  //         generalFundTotal: 1000,
  //         investingRoi: 2,
  //         drawdownRoi: 1,
  //         retirementFundAnnualInvestments: 10,
  //         generalFundAnnualInvestments: 10,
  //         retirementFundAccessAge: 57,
  //       } as FireData)
  //     ).to.containSubset({
  //       generalDrawdownAmount: 53.94605981792553,
  //       leftAtLifeExpectancy: 0,
  //       pensionDrawdownAmount: 74.45191148417548,
  //       runOutAgeGeneral: 82,
  //       runOutAgePension: 82,
  //       runOutBeforeRetirement: false,
  //       fireAmount: {
  //         fireAge: 35,
  //         generalFundAtFire: 1060.6,
  //         retirementFundTotal: 1639.6660388248984,
  //       } as FireAmount,
  //     } as Fire);
  //   });
  //   test("Retire 3 year away", () => {
  //     global.navigator = {
  //       language: "en-GB",
  //     } as Navigator;
  //     expect(
  //       calculateFireAmountBasedOnDesiredRoi(35, {
  //         currentAge: 32,
  //         retirementFundTotal: 1000,
  //         generalFundTotal: 1000,
  //         investingRoi: 2,
  //         drawdownRoi: 1,
  //         retirementFundAnnualInvestments: 10,
  //         generalFundAnnualInvestments: 10,
  //         retirementFundAccessAge: 57,
  //       } as FireData)
  //     ).to.containSubset({
  //       generalDrawdownAmount: 55.533618199065536,
  //       leftAtLifeExpectancy: 0,
  //       pensionDrawdownAmount: 76.64292889059085,
  //       runOutAgeGeneral: 82,
  //       runOutAgePension: 82,
  //       runOutBeforeRetirement: false,
  //       fireAmount: {
  //         fireAge: 35,
  //         generalFundAtFire: 1091.812,
  //         retirementFundTotal: 1687.9191563091558,
  //       } as FireAmount,
  //     } as Fire);
  //   });
  // });
});
