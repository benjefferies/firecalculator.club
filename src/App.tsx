import { useForm } from "react-hook-form";
import "./App.css";

type FireData = {
  retirementFundTotal: number;
  generalFundTotal: number;
  retirementFundAnnualInvestments: number;
  generalFundAnnualInvestments: number;
  investingRoi: number;
  drawdownRoi: number;
  currentAge: number;
  retirementFundAccessAge: number;
  desiredAge?: number;
  desiredAnnualRoi?: number;
};

type FireAmount = {
  retirementFundTotal: number;
  generalFundTotal: number;
};

function compoundInterest(
  principal: number,
  rate: number,
  time: number = 1,
  timesPerYear: number = 1
) {
  const amount =
    principal * Math.pow(1 + rate / timesPerYear, timesPerYear * time);
  const interest = amount - principal;
  return interest;
}

function drawdown(
  p: number,
  a: number,
  n: number = 1,
  t: number = 1
) {
  const ac = Math.pow(a, 1/(n*t));
  const pc = Math.pow(p, 1/(n*t));
  const r = (n * (ac - pc)) / pc
  console.log(r)
}

function calculateFireAmountRoi(desiredAnnualRoi: number, data: FireData): FireAmount {
  let principalRetirementAmount = data.retirementFundTotal;
  let principalGeneralAmount = data.generalFundTotal;
  let principalRetirementAmountDrawdownGrowth = compoundInterest(
    principalRetirementAmount,
    data.drawdownRoi * 0.01
  );
  let principalGeneralAmountDrawdownGrowth = compoundInterest(
    principalGeneralAmount,
    data.drawdownRoi * 0.01
  );
  let retirementAge = data.currentAge;
  while (
    principalRetirementAmountDrawdownGrowth + principalGeneralAmountDrawdownGrowth <
    desiredAnnualRoi
  ) {
    const principalRetirementAmountGrowth = compoundInterest(
      principalRetirementAmount,
      data.investingRoi * 0.01
    );
    const principalGeneralAmountGrowth = compoundInterest(
      principalGeneralAmount,
      data.investingRoi * 0.01
    );
    principalRetirementAmount +=
      principalRetirementAmountGrowth + data.retirementFundAnnualInvestments;
    principalGeneralAmount +=
      principalGeneralAmountGrowth + data.generalFundAnnualInvestments;
    retirementAge++;
    principalRetirementAmountDrawdownGrowth = compoundInterest(
      principalRetirementAmount,
      data.drawdownRoi * 0.01
    );
    principalGeneralAmountDrawdownGrowth = compoundInterest(
      principalGeneralAmount,
      data.drawdownRoi * 0.01
    );
  }
  console.log(
    {
      principalRetirementAmount: principalRetirementAmount.toFixed(2),
      principalGeneralAmount: principalGeneralAmount.toFixed(2),
      principalRetirementAmountDrawdownGrowth: principalRetirementAmountDrawdownGrowth.toFixed(2),
      principalGeneralAmountDrawdownGrowth: principalGeneralAmountDrawdownGrowth.toFixed(2),
      retirementAge,
    },
    "Retirement"
  );
  return {
    retirementFundTotal: principalRetirementAmount,
    generalFundTotal: principalGeneralAmount
  };
}

function calculateFireAmountAge(
  desiredAge: number,
  data: FireData
): FireAmount {
  const years = desiredAge - data.currentAge;
  let principalRetirementAmount = data.retirementFundTotal;
  let principalGeneralAmount = data.generalFundTotal;
  for (let y = 0; y < years; y++) {
    const principalRetirementAmountGrowth = compoundInterest(
      principalRetirementAmount,
      data.investingRoi * 0.01
    );
    const principalGeneralAmountGrowth = compoundInterest(
      principalGeneralAmount,
      data.investingRoi * 0.01
    );
    principalRetirementAmount +=
      principalRetirementAmountGrowth + data.retirementFundAnnualInvestments;
    principalGeneralAmount +=
      principalGeneralAmountGrowth + data.generalFundAnnualInvestments;
  }
  let principalRetirementAmountDrawdownGrowth = compoundInterest(
    principalRetirementAmount,
    data.drawdownRoi * 0.01
  );
  let principalGeneralAmountDrawdownGrowth = compoundInterest(
    principalGeneralAmount,
    data.drawdownRoi * 0.01
  );
  console.log(
    {
      principalRetirementAmount: principalRetirementAmount.toFixed(2),
      principalGeneralAmount: principalGeneralAmount.toFixed(2),
      principalRetirementAmountDrawdownGrowth: principalRetirementAmountDrawdownGrowth.toFixed(2),
      principalGeneralAmountDrawdownGrowth: principalGeneralAmountDrawdownGrowth.toFixed(2),
    },
    "Retirement"
  );
  return {
    retirementFundTotal: principalRetirementAmount,
    generalFundTotal: principalGeneralAmount
  };
}

function calculateFire(data: FireData) {
  let fire: FireAmount;
  if (data.desiredAge) {
    fire = calculateFireAmountAge(data.desiredAge, data);
  } else if (data.desiredAnnualRoi) {
    fire = calculateFireAmountRoi(data.desiredAnnualRoi, data);
    let generalFundTotal = fire.generalFundTotal
    let age = data.currentAge;
    while (generalFundTotal >= 0 && age <= data.retirementFundAccessAge) {
      generalFundTotal = generalFundTotal - data.desiredAnnualRoi + compoundInterest(generalFundTotal, data.drawdownRoi * 0.01)
      age++;
    }
    console.log({age, generalFundTotal}, "FIRE ROI")
    if (age < data.retirementFundAccessAge) {
      console.log("Ran out of funds before retirement")
    }
    let retirementFundTotal = fire.retirementFundTotal + generalFundTotal
    let retirementAge = data.retirementFundAccessAge;
    while (retirementFundTotal >= 0 && retirementAge <= 100) {
      retirementFundTotal = retirementFundTotal - data.desiredAnnualRoi + compoundInterest(retirementFundTotal, data.drawdownRoi * 0.01)
      age++;
    }
    console.log({age, retirementAge}, "FIRE ROI")
  } else {
    throw new Error("No data")
  }
}

function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FireData>();
  const onSubmit = (data: FireData) => calculateFire(data);

  console.log(watch("retirementFundAnnualInvestments")); // watch input type="number"  value by passing the name of it

  return (
    /* "handleSubmit" will validate your input type="number" s before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      <div id="investing">
        <label>Retirement Fund</label>
        <input
          type="number"
          defaultValue={0}
          {...register("retirementFundTotal", {
            required: true,
            valueAsNumber: true,
          })}
        />
        {/* errors will return when field validation fails  */}
        {errors.retirementFundTotal && <span>This field is required</span>}
        <label>Investment Fund</label>
        <input
          type="number"
          defaultValue={0}
          {...register("generalFundTotal", {
            required: true,
            valueAsNumber: true,
          })}
        />
        {/* errors will return when field validation fails  */}
        {errors.generalFundTotal && <span>This field is required</span>}
        <label>Retirement Fund Annual Contribution</label>
        <input
          type="number"
          defaultValue={20000}
          {...register("retirementFundAnnualInvestments", {
            required: true,
            valueAsNumber: true,
          })}
        />
        {/* errors will return when field validation fails  */}
        {errors.retirementFundAnnualInvestments && (
          <span>This field is required</span>
        )}
        <label>Investment Fund Annual Contribution</label>
        <input
          type="number"
          defaultValue={40000}
          {...register("generalFundAnnualInvestments", {
            required: true,
            valueAsNumber: true,
          })}
        />
        {/* errors will return when field validation fails  */}
        {errors.generalFundAnnualInvestments && (
          <span>This field is required</span>
        )}
      </div>
      <div id="return-on-investment">
        <label>Investing ROI</label>
        <input
          type="number"
          defaultValue={6}
          {...register("investingRoi", { required: true, valueAsNumber: true })}
        />
        {/* errors will return when field validation fails  */}
        {errors.investingRoi && <span>This field is required</span>}
        <label>Drawdown ROI</label>
        <input
          type="number"
          defaultValue={6}
          {...register("drawdownRoi", { required: true, valueAsNumber: true })}
        />
        {/* errors will return when field validation fails  */}
        {errors.drawdownRoi && <span>This field is required</span>}
      </div>
      <div id="fire">
        <label>Age</label>
        <input
          type="number"
          defaultValue={28}
          {...register("currentAge", { required: true, valueAsNumber: true })}
        />
        {/* errors will return when field validation fails  */}
        {errors.currentAge && <span>This field is required</span>}
        <label>Age Retirement Fund Accessible</label>
        <input
          type="number"
          defaultValue={57}
          {...register("retirementFundAccessAge", {
            required: true,
            valueAsNumber: true,
          })}
        />
        {/* errors will return when field validation fails  */}
        {errors.retirementFundAccessAge && <span>This field is required</span>}
        <label>Desired FIRE Age</label>
        <input
          type="number"
          {...register("desiredAge", { valueAsNumber: true })}
        />
        {/* errors will return when field validation fails  */}
        {errors.desiredAge && <span>This field is required</span>}
        <label>Desired RIO</label>
        <input
          type="number"
          {...register("desiredAnnualRoi", { valueAsNumber: true })}
        />
        {/* errors will return when field validation fails  */}
        {errors.desiredAnnualRoi && <span>This field is required</span>}
      </div>
      <input type="submit" />
    </form>
  );
}

export default App;
