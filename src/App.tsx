import {
  Button,
  createTheme,
  Divider,
  FormControlLabel,
  Grid,
  makeStyles,
  NoSsr,
  Radio,
  RadioGroup,
  TextField,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import './App.css';
import {
  calculateFireAmountBasedOnDesiredFireAge,
  calculateFireAmountBasedOnDesiredRoi,
  Fire,
  FireData,
  formatCurrency,
} from './service/FireService';

const theme = createTheme();
const useStyles = makeStyles((theme) => ({
  root: { minHeight: '100vh', height: '100vh', backgroundColor: '#ced4da' },
  inner: { minHeight: '100vh', height: '100vh', backgroundColor: '#f8f9fa' },
  dividerFullWidth: {
    margin: `5px 0 0 ${theme.spacing(2)}px`,
  },
}));

function calculateFire(data: FireData): Fire {
  if (data.calculationType === 'retire_age' && data.targetAge) {
    return calculateFireAmountBasedOnDesiredFireAge(data.targetAge, data);
  } else if (data.calculationType === 'retire_roi_amount' && data.targetAnnualRoi) {
    return calculateFireAmountBasedOnDesiredRoi(data.targetAnnualRoi, data);
  } else {
    throw new Error('No data');
  }
}

function errorHelperText(errorField: any, text: string) {
  return errorField !== undefined ? text : '';
}

function App() {
  const classes = useStyles();
  const [fire, setFire] = useState<Fire>();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    control,
  } = useForm<FireData>({
    defaultValues: {
      calculationType: 'retire_age',
    },
  });
  const onSubmit = (data: FireData) => {
    setFire(calculateFire(data));
  };
  const [calculationType] = watch(['calculationType']);

  return (
    <div className={classes.root}>
      <NoSsr>
        <ThemeProvider theme={theme}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container item justifyContent="center" lg={12}>
              <Grid container item lg={6} direction="column" spacing={2} className={classes.inner}>
                <Typography align="center" variant="h1">
                  FIRE Calculator
                </Typography>
                <Grid item container justifyContent="space-evenly">
                  <Controller
                    rules={{ required: true }}
                    name="calculationType"
                    render={({ field }) => (
                      <RadioGroup row {...register('calculationType')} {...field}>
                        <FormControlLabel value={'retire_age'} control={<Radio />} label="How much can I drawdown when I FIRE?" />
                        <FormControlLabel
                          value={'retire_roi_amount'}
                          control={<Radio />}
                          label="What age will I be when I reach my target FIRE age"
                        />
                      </RadioGroup>
                    )}
                    control={control}
                  />
                </Grid>

                <Divider component="div" />
                <div>
                  <Typography className={classes.dividerFullWidth} color="textSecondary" display="block" variant="caption">
                    Retirement Investments
                  </Typography>
                </div>
                <Grid item container justifyContent="space-evenly">
                  <TextField
                    variant="outlined"
                    label="Retirement Fund"
                    type="number"
                    error={errors.retirementFundTotal !== undefined}
                    helperText={errorHelperText(errors.retirementFundTotal, 'This field is required')}
                    {...register('retirementFundTotal', {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                  <TextField
                    variant="outlined"
                    label="Annual Contribution"
                    type="number"
                    error={errors.retirementFundAnnualInvestments !== undefined}
                    helperText={errorHelperText(errors.retirementFundAnnualInvestments, 'This field is required')}
                    {...register('retirementFundAnnualInvestments', {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                </Grid>

                <Divider component="div" />
                <div>
                  <Typography className={classes.dividerFullWidth} color="textSecondary" display="block" variant="caption">
                    General Investments
                  </Typography>
                </div>
                <Grid item container justifyContent="space-evenly">
                  <TextField
                    variant="outlined"
                    label="Investment Fund"
                    type="number"
                    error={errors.generalFundTotal !== undefined}
                    helperText={errorHelperText(errors.generalFundTotal, 'This field is required')}
                    {...register('generalFundTotal', {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                  <TextField
                    variant="outlined"
                    label="Annual Contribution"
                    type="number"
                    error={errors.generalFundAnnualInvestments !== undefined}
                    helperText={errorHelperText(errors.generalFundAnnualInvestments, 'This field is required')}
                    {...register('generalFundAnnualInvestments', {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                </Grid>

                <Divider component="div" />
                <div>
                  <Typography className={classes.dividerFullWidth} color="textSecondary" display="block" variant="caption">
                    Investment returns
                  </Typography>
                </div>
                <Grid item container justifyContent="space-evenly">
                  <TextField
                    variant="outlined"
                    label="Investing Return %"
                    type="number"
                    error={errors.investingRoi !== undefined}
                    helperText={errorHelperText(errors.investingRoi, 'This field is required')}
                    {...register('investingRoi', {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                  <TextField
                    variant="outlined"
                    label="Drawdown Return %"
                    type="number"
                    error={errors.drawdownRoi !== undefined}
                    helperText={errorHelperText(errors.drawdownRoi, 'This field is required')}
                    {...register('drawdownRoi', {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                </Grid>

                <Divider />
                <Grid item container justifyContent="space-evenly">
                  <TextField
                    variant="outlined"
                    label="Age"
                    type="number"
                    error={errors.currentAge !== undefined}
                    helperText={errorHelperText(errors.currentAge, 'This field is required')}
                    {...register('currentAge', {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                  <TextField
                    variant="outlined"
                    label="Retirement Fund Age"
                    type="number"
                    error={errors.retirementFundAccessAge !== undefined}
                    helperText={errorHelperText(errors.retirementFundAccessAge, 'This field is required')}
                    {...register('retirementFundAccessAge', {
                      required: true,
                      valueAsNumber: true,
                    })}
                  />
                  {calculationType === 'retire_age' && (
                    <>
                      <TextField
                        variant="outlined"
                        label="Target FIRE Age"
                        type="number"
                        error={errors.targetAge !== undefined}
                        helperText={errorHelperText(errors.targetAge, 'This field is required')}
                        {...register('targetAge', { valueAsNumber: true, required: calculationType === 'retire_age' })}
                      />
                    </>
                  )}
                  {calculationType === 'retire_roi_amount' && (
                    <>
                      <TextField
                        variant="outlined"
                        label="Target Drawdown"
                        type="number"
                        error={errors.targetAnnualRoi !== undefined}
                        helperText={errorHelperText(errors.targetAnnualRoi, 'This field is required')}
                        {...register('targetAnnualRoi', { valueAsNumber: true, required: calculationType === 'retire_roi_amount' })}
                      />
                    </>
                  )}
                </Grid>
                <Grid item container justifyContent="center">
                  <Button variant="contained" color="primary" type="submit">
                    Calculate
                  </Button>
                </Grid>
                <Grid item container >
                  {fire && (
                    <Typography variant="body1">
                      If you FIRE at{' '}
                      <strong>{getValues('calculationType') === 'retire_age' ? getValues('targetAge') : fire.fireAmount.fireAge}</strong>{' '}
                      you will have <strong>{formatCurrency(fire.fireAmount.generalFundAtFire)}</strong> in your general investments. When
                      you reach the retirement age of <strong>{getValues('retirementFundAccessAge')}</strong> you will have{' '}
                      <strong>{formatCurrency(fire.fireAmount.retirementFundTotal)}</strong> in your pension. From your general investments
                      can drawdown <strong>{formatCurrency(fire.generalDrawdownAmount)}</strong> from{' '}
                      <strong>{getValues('calculationType') === 'retire_roi_amount' ? fire.fireAmount.fireAge : getValues('targetAge')}</strong> until{' '}
                      <strong>{getValues('retirementFundAccessAge')}</strong> and then continue to drawdown from both your investments{' '}
                      <strong>{`${formatCurrency(fire.pensionDrawdownAmount)}`}</strong>.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </form>
        </ThemeProvider>
      </NoSsr>
    </div>
  );
}

export default App;
