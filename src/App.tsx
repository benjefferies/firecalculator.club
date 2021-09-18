import { Adsense } from '@ctrl/react-adsense';
import {
  Box,
  Button,
  createTheme,
  FormControlLabel,
  Grid,
  makeStyles,
  NoSsr,
  Radio,
  RadioGroup,
  TextField,
  Theme,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import LocaleCurrency from 'locale-currency';
import { useState } from 'react';
import Chart from 'react-apexcharts';
import ReactGA from 'react-ga';
import { Controller, useForm } from 'react-hook-form';
import './App.scss';
import { calculateFireAmountBasedOnDesiredFireAge, calculateFireAmountBasedOnDesiredRoi } from './service/FireService';
import { Fire, FireData } from './types/types';
ReactGA.initialize('UA-207743771-1');
ReactGA.pageview(window.location.pathname + window.location.search);

const theme = createTheme({
  spacing: 8,
  palette: {
    primary: {
      main: '#ef5a00',
    },
  },
});

const useStyles = makeStyles((theme: Theme) => ({
  root: { minHeight: '100vh' },
  inner: { minHeight: '100vh' },
  dividerFullWidth: {
    margin: `5px 0 0 ${theme.spacing(2)}px`,
    textAlign: 'center',
    padding: '5px',
  },
  textInputText: {
    color: '#FFF',
  },
}));

const formatCurrency = (money: number) => {
  return money.toLocaleString(navigator.language, {
    style: 'currency',
    currency: LocaleCurrency.getCurrency(navigator.language),
  });
};

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
    ReactGA.event({ category: 'fire', action: 'calculate' });
    const fire = calculateFire(data);
    setFire(fire);
  };
  const [calculationType, currentAge] = watch(['calculationType', 'currentAge']);

  return (
    <div className={classes.root}>
      <Box mx={{ xs: 1, sm: 4, md: 16, lg: 32 }} className={classes.inner}>
        <Adsense
          client="ca-pub-1383291322337575"
          slot="7259870550"
          style={{ display: 'block' }}
          layout="in-article"
          format="fluid"
        />
        <NoSsr>
          <ThemeProvider theme={theme}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="firecalc__title-container">
                <h1 className="firecalc__title">
                  How <span className="firecalc__highlighted">much</span> can you spend when you hit
                  <span className="firecalc__highlighted"> Fire?</span>
                </h1>
              </div>
              <Grid className="firecalc__radio-container" container spacing={2}>
                <Controller
                  rules={{ required: true }}
                  name="calculationType"
                  render={({ field }) => (
                    <RadioGroup className="firecalc__radio-group" row {...register('calculationType')} {...field}>
                      <FormControlLabel
                        className="firecalc__label"
                        value={'retire_age'}
                        control={<Radio />}
                        label="How much can I drawdown when I FIRE?"
                      />
                      <FormControlLabel
                        className="firecalc__label"
                        value={'retire_roi_amount'}
                        control={<Radio />}
                        label="Age will I be when I reach target FIRE age?"
                      />
                    </RadioGroup>
                  )}
                  control={control}
                />
              </Grid>

              <div>
                <Typography
                  className={classes.dividerFullWidth}
                  color="textSecondary"
                  display="block"
                  variant="caption"
                >
                  <div className="firecalc__section-title">Retirement Investments</div>
                </Typography>
              </div>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    inputProps={{ className: classes.textInputText }}
                    color="secondary"
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
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    inputProps={{ className: classes.textInputText }}
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
              </Grid>

              <div>
                <Typography
                  className={classes.dividerFullWidth}
                  color="textSecondary"
                  display="block"
                  variant="caption"
                >
                  <div className="firecalc__section-title">General Investments</div>
                </Typography>
              </div>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    inputProps={{ className: classes.textInputText }}
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
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    inputProps={{ className: classes.textInputText }}
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
              </Grid>

              <div>
                <Typography
                  className={classes.dividerFullWidth}
                  color="textSecondary"
                  display="block"
                  variant="caption"
                >
                  <div className="firecalc__section-title">Investment returns</div>
                </Typography>
              </div>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    inputProps={{ className: classes.textInputText }}
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
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    inputProps={{ className: classes.textInputText }}
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
              </Grid>

              <div>
                <Typography
                  className={classes.dividerFullWidth}
                  color="textSecondary"
                  display="block"
                  variant="caption"
                >
                  <div className="firecalc__section-title">Age</div>
                </Typography>
              </div>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    inputProps={{ className: classes.textInputText }}
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
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    inputProps={{ className: classes.textInputText }}
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
                </Grid>
                <Grid item xs={6}>
                  {calculationType === 'retire_age' ? (
                    <TextField
                      inputProps={{ className: classes.textInputText }}
                      variant="outlined"
                      label="Target FIRE Age"
                      type="number"
                      error={errors.targetAge !== undefined}
                      helperText={errorHelperText(errors.targetAge, 'Age must be the same or more than current age')}
                      {...register('targetAge', {
                        valueAsNumber: true,
                        required: calculationType === 'retire_age',
                        validate: (targetAge) => (targetAge || 0) >= currentAge,
                      })}
                    />
                  ) : (
                    <TextField
                      inputProps={{ className: classes.textInputText }}
                      variant="outlined"
                      label="Target Drawdown"
                      type="number"
                      error={errors.targetAnnualRoi !== undefined}
                      helperText={errorHelperText(errors.targetAnnualRoi, 'This field is required')}
                      {...register('targetAnnualRoi', {
                        valueAsNumber: true,
                        required: calculationType === 'retire_roi_amount',
                      })}
                    />
                  )}
                </Grid>
              </Grid>
              <Grid className="firecalc__button-container">
                <Button className="firecalc__button" variant="contained" type="submit">
                  Calculate
                </Button>
              </Grid>

              <Grid container direction="column">
                {fire && (
                  <>
                    {fire.fireAge < getValues('retirementFundAccessAge') ? (
                      <div className="firecalc__chart-text">
                        If you <span className="firecalc__highlighted">FIRE</span> at <strong>{fire.fireAge}</strong> you will have{' '}
                        <strong>{formatCurrency(fire.growth.generalFundAtFire)}</strong> in your general investments.
                        When you reach the retirement age of{' '}
                        <strong>{Math.max(getValues('retirementFundAccessAge'), fire.fireAge)}</strong> you will have{' '}
                        <strong>{formatCurrency(fire.growth.retirementFundTotal)}</strong> in your retirement
                        investments. From your general investments can drawdown{' '}
                        <strong>{formatCurrency(fire.drawdown.generalDrawdownAmount)}</strong> from{' '}
                        <strong>
                          {getValues('calculationType') === 'retire_roi_amount' ? fire.fireAge : getValues('targetAge')}
                        </strong>{' '}
                        until <strong>{getValues('retirementFundAccessAge')}</strong> then you can drawdown from your
                        retirement investments{' '}
                        <strong>{`${formatCurrency(fire.drawdown.retirementDrawdownAmount)}`}</strong>
                      </div>
                    ) : (
                      <div className="firecalc__chart-text">
                        If you <span className="firecalc__highlighted">FIRE</span> at <strong>{fire.fireAge}</strong> you will have{' '}
                        <strong>{formatCurrency(fire.growth.generalFundAtFire)}</strong> in your general investments and{' '}
                        <strong>{formatCurrency(fire.growth.retirementFundTotal)}</strong> in your retirement
                        investments. From your general investments can drawdown{' '}
                        <strong>{formatCurrency(fire.drawdown.generalDrawdownAmount)}</strong> and from your retirement
                        investments <strong>{`${formatCurrency(fire.drawdown.retirementDrawdownAmount)}`}</strong>
                      </div>
                    )}
                    <Chart
                      options={{
                        stroke: {
                          curve: 'straight',
                        },
                        markers: {
                          size: 2,
                        },
                        legend: {
                          labels: {
                            colors: '#FFF',
                          },
                        },
                        tooltip: {
                          fillSeriesColor: true,
                        },
                        yaxis: {
                          labels: {
                            formatter: (value: number) => {
                              return formatCurrency(value);
                            },
                            style: {
                              colors: '#FFF',
                            },
                          },
                        },
                        xaxis: {
                          type: 'numeric',
                          labels: {
                            style: {
                              colors: '#FFF',
                            },
                          },
                          tickAmount:
                            window.innerWidth < 800
                              ? 10
                              : Object.keys({
                                  ...fire.growth?.generalGrowthGraph,
                                  ...fire.drawdown.generalDrawdownGraph,
                                }).length,
                        },
                      }}
                      series={[
                        {
                          data: Object.keys({
                            ...fire.growth?.generalGrowthGraph,
                            ...fire.drawdown.generalDrawdownGraph,
                          }).map((k) => {
                            const merged = {
                              ...fire.growth?.generalGrowthGraph,
                              ...fire.drawdown.generalDrawdownGraph,
                            };
                            const kNum = Number.parseInt(k);
                            const formattedAmount = merged[kNum].toFixed(2);
                            return [kNum, formattedAmount];
                          }),
                          name: 'General Investments',
                        },
                        {
                          data: Object.keys({
                            ...fire.growth?.retirementGrowthGraph,
                            ...fire.drawdown.retirementDrawdownGraph,
                          }).map((k) => {
                            const merged = {
                              ...fire.growth?.retirementGrowthGraph,
                              ...fire.drawdown.retirementDrawdownGraph,
                            };
                            const kNum = Number.parseInt(k);
                            return [kNum, merged[kNum]];
                          }),
                          name: 'Retirement Investments',
                        },
                      ]}
                      type="line"
                      width="100%"
                    />
                  </>
                )}
              </Grid>
            </form>
          </ThemeProvider>
        </NoSsr>
      </Box>
    </div>
  );
}

export default App;
