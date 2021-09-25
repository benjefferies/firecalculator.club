import { Adsense } from '@ctrl/react-adsense';
import {
  Box,
  Button,
  createTheme, FormControlLabel,
  Grid,
  InputAdornment,
  makeStyles,
  NoSsr,
  Radio,
  RadioGroup,
  TextField,
  TextFieldProps,
  Theme, Typography,
  useMediaQuery
} from '@material-ui/core';
import { useMemo, useState } from 'react';
import Chart from 'react-apexcharts';
import ReactGA from 'react-ga';
import { Controller, useForm } from 'react-hook-form';
import { formatCurrency, getCurrency } from '../service/CurrencyService';
import { calculateFireAmountBasedOnDesiredFireAge, calculateFireAmountBasedOnDesiredRoi } from '../service/FireService';
import { Fire, FireData } from '../types/types';
import './Calculator.scss';

const useStyles = makeStyles((theme: Theme) => ({
  root: { minHeight: '100vh' },
  inner: { minHeight: '100vh' },
  dividerFullWidth: {
    margin: `5px 0 0 ${theme.spacing(2)}px`,
    textAlign: 'center',
    padding: '5px',
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

function Calculator() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createTheme({
        spacing: 8,
        palette: {
          primary: {
            main: '#ef5a00',
          },
          type: prefersDarkMode ? 'dark' : 'light',
          background: {
            default: prefersDarkMode ? '#000' : '#FFF',
          },
        },
      }),
    [prefersDarkMode]
  );
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
  const [calculationType, currentAge, generalFundAnnualInvestments, generalFundTotal, retirementFundAccessAge] = watch([
    'calculationType',
    'currentAge',
    'generalFundAnnualInvestments',
    'generalFundTotal',
    'retirementFundAccessAge',
  ]);

  const commonProps = {
    variant: 'outlined',
    type: 'number',
  } as TextFieldProps;

  const currencyTextFieldProps = {
    ...commonProps,
    InputProps: {
      startAdornment: <InputAdornment position="start">{getCurrency()}</InputAdornment>,
    },
  } as TextFieldProps;

  const ageTextFieldProps = {
    ...commonProps,
  } as TextFieldProps;

  const percentageTextFieldProps = {
    ...commonProps,
    InputProps: {
      startAdornment: <InputAdornment position="start">%</InputAdornment>,
    },
  } as TextFieldProps;

  return (
    <div className={classes.root}>
      <Box mx={{ xs: 1, sm: 4, md: 16, lg: 32 }}>
        {/* <Adsense
          client="ca-pub-1383291322337575"
          slot="7259870550"
          style={{ display: 'block' }}
          layout="in-article"
          format="fluid"
        /> */}
        <NoSsr>
          <form className="firecalc__form-container" onSubmit={handleSubmit(onSubmit)}>
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
                      aria-label="How much can I drawdown when I FIRE?"
                    />
                    <FormControlLabel
                      className="firecalc__label"
                      value={'retire_roi_amount'}
                      control={<Radio />}
                      label="Age will I be when I reach target FIRE age?"
                      aria-label="Age will I be when I reach target FIRE age?"
                    />
                  </RadioGroup>
                )}
                control={control}
              />
            </Grid>

            <div>
              <Typography className={classes.dividerFullWidth} color="textSecondary" display="block" variant="caption">
                <div className="firecalc__section-title">Retirement Investments</div>
              </Typography>
            </div>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  aria-label="Retirement Fund"
                  {...currencyTextFieldProps}
                  label="Retirement Fund"
                  error={errors.retirementFundTotal !== undefined}
                  helperText={errors.retirementFundTotal?.message}
                  {...register('retirementFundTotal', {
                    required: 'This field is required',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Can't be less than 0",
                    },
                  })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  aria-label="Retirement Fund Annual Contribution"
                  {...currencyTextFieldProps}
                  label="Annual Contribution"
                  error={errors.retirementFundAnnualInvestments !== undefined}
                  helperText={errors.retirementFundAnnualInvestments?.message}
                  {...register('retirementFundAnnualInvestments', {
                    required: 'This field is required',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Can't be less than 0",
                    },
                  })}
                />
              </Grid>
            </Grid>

            <div>
              <Typography className={classes.dividerFullWidth} color="textSecondary" display="block" variant="caption">
                <div className="firecalc__section-title">General Investments</div>
              </Typography>
            </div>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  aria-label="Investment Fund"
                  {...currencyTextFieldProps}
                  label="Investment Fund"
                  error={errors.generalFundTotal !== undefined}
                  helperText={errors.generalFundTotal?.message}
                  {...register('generalFundTotal', {
                    required: 'This field is required',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Can't be less than 0",
                    },
                  })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  aria-label="Annual Contribution"
                  {...currencyTextFieldProps}
                  label="Annual Contribution"
                  error={errors.generalFundAnnualInvestments !== undefined}
                  helperText={errors.generalFundAnnualInvestments?.message}
                  {...register('generalFundAnnualInvestments', {
                    required: 'This field is required',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Can't be less than 0",
                    },
                  })}
                />
              </Grid>
            </Grid>

            <div>
              <Typography className={classes.dividerFullWidth} color="textSecondary" display="block" variant="caption">
                <div className="firecalc__section-title">Investment returns</div>
              </Typography>
            </div>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  aria-label="Investing Return %"
                  {...percentageTextFieldProps}
                  label="Investing Return %"
                  error={errors.investingRoi !== undefined}
                  helperText={errors.investingRoi?.message}
                  {...register('investingRoi', {
                    required: 'This field is required',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Can't be less than 0",
                    },
                  })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  aria-label="Drawdown Return %"
                  {...percentageTextFieldProps}
                  label="Drawdown Return %"
                  error={errors.drawdownRoi !== undefined}
                  helperText={errors.drawdownRoi?.message}
                  {...register('drawdownRoi', {
                    required: 'This field is required',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Can't be less than 0",
                    },
                  })}
                />
              </Grid>
            </Grid>

            <div>
              <Typography className={classes.dividerFullWidth} color="textSecondary" display="block" variant="caption">
                <div className="firecalc__section-title">Age</div>
              </Typography>
            </div>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  aria-label="Age"
                  {...ageTextFieldProps}
                  label="Age"
                  error={errors.currentAge !== undefined}
                  helperText={errors.currentAge?.message}
                  {...register('currentAge', {
                    required: 'This field is required',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Can't be less than 0",
                    },
                  })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  aria-label="Retirement Fund Age"
                  {...ageTextFieldProps}
                  label="Retirement Fund Age"
                  error={errors.retirementFundAccessAge !== undefined}
                  helperText={errors.retirementFundAccessAge?.message}
                  {...register('retirementFundAccessAge', {
                    required: 'This field is required',
                    valueAsNumber: true,
                    value: 57,
                    min: {
                      value: 0,
                      message: "Can't be less than 0",
                    },
                  })}
                />
              </Grid>
              <Grid item xs={6}>
                {calculationType === 'retire_age' ? (
                  <TextField
                    aria-label="Target FIRE Age"
                    {...ageTextFieldProps}
                    label="Target FIRE Age"
                    error={errors.targetAge !== undefined}
                    helperText={errors.targetAge?.message}
                    {...register('targetAge', {
                      valueAsNumber: true,
                      required: calculationType === 'retire_age' ? 'This field is required' : false,
                      validate: (targetAge) => {
                        if ((targetAge || 0) <= currentAge) {
                          return 'Must be the same or more than current age';
                        }
                        if (
                          generalFundAnnualInvestments === 0 &&
                          generalFundTotal === 0 &&
                          currentAge < retirementFundAccessAge
                        ) {
                          return `Must have investment fund to retire before ${retirementFundAccessAge}`;
                        }
                        return true;
                      },
                      min: {
                        value: 0,
                        message: "Can't be less than 0",
                      },
                    })}
                  />
                ) : (
                  <TextField
                    aria-label="Target Drawdown"
                    {...currencyTextFieldProps}
                    label="Target Drawdown"
                    error={errors.targetAnnualRoi !== undefined}
                    helperText={errors.targetAnnualRoi?.message}
                    {...register('targetAnnualRoi', {
                      valueAsNumber: true,
                      required: calculationType === 'retire_roi_amount',
                      min: {
                        value: 0,
                        message: "Can't be less than 0",
                      },
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
                      If you <span className="firecalc__highlighted">FIRE</span> at <strong>{fire.fireAge}</strong> you
                      will have <strong>{formatCurrency(fire.growth.generalFundAtFire)}</strong> in your general
                      investments.
                      <br />
                      When you reach the retirement age of{' '}
                      <strong>{Math.max(getValues('retirementFundAccessAge'), fire.fireAge)}</strong> you will have{' '}
                      <strong>{formatCurrency(fire.growth.retirementFundTotal)}</strong> in your retirement investments.
                      <br /> From your general investments can drawdown{' '}
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
                      If you <span className="firecalc__highlighted">FIRE</span> at <strong>{fire.fireAge}</strong> you
                      will have <strong>{formatCurrency(fire.growth.generalFundAtFire)}</strong> in your general
                      investments and <strong>{formatCurrency(fire.growth.retirementFundTotal)}</strong> in your
                      retirement investments.
                      <br />
                      From your general investments can drawdown{' '}
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
                          colors: theme.palette.type === 'dark' ? '#FFF' : '#000',
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
                            colors: theme.palette.type === 'dark' ? '#FFF' : '#000',
                          },
                        },
                      },
                      xaxis: {
                        type: 'numeric',
                        labels: {
                          style: {
                            colors: theme.palette.type === 'dark' ? '#FFF' : '#000',
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
        </NoSsr>
      </Box>
    </div>
  );
}

export default Calculator;
