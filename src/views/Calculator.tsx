import {
  Box,
  Button,
  Checkbox,
  createTheme,
  FormControlLabel,
  Grid,
  InputAdornment,
  makeStyles,
  NoSsr,
  Popover,
  Radio,
  RadioGroup,
  TextField,
  TextFieldProps,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import queryString from 'query-string';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  const queries = queryString.parse(window.location.hash);
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
      retirementFundAccessAge: 57,
      endAge: 82,
      ...queries,
      useGeneralUntilEnd: queries?.useGeneralUntilEnd === 'true',
    },
  });

  const scrollRef = useRef<null | HTMLDivElement>(null);

  const onSubmit = (data: FireData) => {
    ReactGA.event({ category: 'fire', action: 'calculate' });
    const fire = calculateFire(data);
    setFire(fire);
    window.location.hash = queryString.stringify(data);
  };

  useEffect(() => {
    // Timeout as chart doesn't render immediately so it scrolls to empty div
    setTimeout(() => scrollRef?.current?.scrollIntoView({ block: 'end', behavior: 'smooth' }), 500);
  }, [fire]);
  const [calculationType, currentAge, generalFundAnnualInvestments, generalFundTotal, retirementFundAccessAge, endAge] =
    watch([
      'calculationType',
      'currentAge',
      'generalFundAnnualInvestments',
      'generalFundTotal',
      'retirementFundAccessAge',
      'endAge',
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

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <main className={classes.root}>
      <Box mx={{ xs: 1, sm: 4, md: 16, lg: 32 }}>
        <NoSsr>
          <section>
            <header className="firecalc__title-container">
              <h1 className="firecalc__title">
                How <span className="firecalc__highlighted">much</span> can you spend when you hit
                <span className="firecalc__highlighted"> Fire?</span>
              </h1>
            </header>
          </section>
          <section>
            <form className="firecalc__form-container" onSubmit={handleSubmit(onSubmit)}>
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
                  <Tooltip enterTouchDelay={30} title="The amount you have in your retirement fund." arrow>
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
                  </Tooltip>
                </Grid>
                <Grid item xs={6}>
                  <Tooltip
                    enterTouchDelay={30}
                    title="The amount you will contribute to your retirement fund until you hit FIRE age."
                    arrow
                  >
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
                  </Tooltip>
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
                  <Tooltip enterTouchDelay={30} title="The amount you have in your general investment fund." arrow>
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
                  </Tooltip>
                </Grid>
                <Grid item xs={6}>
                  <Tooltip
                    enterTouchDelay={30}
                    title="The amount you will contribute to your general investment fund until you hit FIRE age."
                    arrow
                  >
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
                  </Tooltip>
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
                  <Tooltip
                    enterTouchDelay={30}
                    title="The percentage you expect your investments to return whilst investing before FIRE age."
                    arrow
                  >
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
                  </Tooltip>
                </Grid>
                <Grid item xs={6}>
                  <Tooltip
                    title="The amount you expect your investments to return after FIRE age. Are you considering de-risking your investments?"
                    enterTouchDelay={30}
                    arrow
                  >
                    <TextField
                      aria-label="Withdraw Return %"
                      {...percentageTextFieldProps}
                      label="Withdraw Return %"
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
                  </Tooltip>
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
                  <Tooltip enterTouchDelay={30} title="The age you would like you money to last until." arrow>
                    <TextField
                      aria-label="Last Until Age"
                      {...ageTextFieldProps}
                      label="Last Until"
                      error={errors.endAge !== undefined}
                      helperText={errors.endAge?.message}
                      {...register('endAge', {
                        required: 'This field is required',
                        valueAsNumber: true,
                        min: {
                          value: currentAge,
                          message: `Can't be less than ${currentAge}`,
                        },
                      })}
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={6}>
                  <Tooltip enterTouchDelay={30} title="The age you can start to access your retirement fund." arrow>
                    <TextField
                      aria-label="Retirement Fund Age"
                      {...ageTextFieldProps}
                      label="Retirement Fund Age"
                      error={errors.retirementFundAccessAge !== undefined}
                      helperText={errors.retirementFundAccessAge?.message}
                      {...register('retirementFundAccessAge', {
                        required: 'This field is required',
                        valueAsNumber: true,
                        min: {
                          value: 0,
                          message: "Can't be less than 0",
                        },
                      })}
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={6}>
                  {calculationType === 'retire_age' ? (
                    <Tooltip enterTouchDelay={30} title="The age you aim to FIRE." arrow>
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
                            if ((targetAge || 0) < currentAge) {
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
                    </Tooltip>
                  ) : (
                    <Tooltip
                      enterTouchDelay={30}
                      title="The amount you want to be able to sustainable withdraw during FIRE."
                      arrow
                    >
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
                    </Tooltip>
                  )}
                </Grid>
                {calculationType === 'retire_age' && (
                  <Grid item xs={6}>
                    <Tooltip
                      enterTouchDelay={30}
                      title="Spread general investments drawdown until you want your money to last until instead of drawing before retirement."
                      arrow
                    >
                      <Controller
                        name="useGeneralUntilEnd"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                }}
                                defaultChecked={field.value}
                              />
                            }
                            label={`Take General Investment Until ${endAge}`}
                          />
                        )}
                      />
                    </Tooltip>
                  </Grid>
                )}
              </Grid>
              <Grid className="firecalc__button-container">
                <Button className="firecalc__button" variant="contained" type="submit">
                  Calculate
                </Button>
                <Button
                  className="firecalc__button"
                  variant="contained"
                  onClick={(event) => {
                    handleClick(event);
                    navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  Share
                </Button>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <p className="firecalc__popover">Copied Link</p>
                </Popover>
              </Grid>
            </form>
          </section>

          {fire && (
            <section className="firecalc__results-container">
              <Grid container direction="column">
                <header className="firecalc__results-header">
                  <h2>
                    Your <span className="firecalc__highlighted">FIRE</span> results
                  </h2>
                </header>
                <>
                  {fire.fireAge < retirementFundAccessAge ? (
                    <div className="firecalc__chart-text">
                      If you <span className="firecalc__highlighted">FIRE</span> at <strong>{fire.fireAge}</strong> you
                      will have <strong>{formatCurrency(fire.growth.generalFundAtFire)}</strong> in your general
                      investments.
                      <br />
                      When you reach the retirement age of{' '}
                      <strong>{Math.max(retirementFundAccessAge, fire.fireAge)}</strong> you will have{' '}
                      <strong>{formatCurrency(fire.growth.retirementFundTotal)}</strong> in your retirement investments.
                      <br /> From your general investments can drawdown{' '}
                      <strong>{formatCurrency(fire.drawdown.generalDrawdownAmount)}</strong> from{' '}
                      <strong>
                        {getValues('calculationType') === 'retire_roi_amount' ? fire.fireAge : getValues('targetAge')}
                      </strong>{' '}
                      until <strong>{retirementFundAccessAge}</strong> then you can drawdown from your retirement
                      investments <strong>{`${formatCurrency(fire.drawdown.retirementDrawdownAmount)}`}</strong> until{' '}
                      <strong>{endAge}</strong>
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
                  <div ref={scrollRef}>
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
                          decimalsInFloat: 0,
                          tickAmount:
                            window.innerWidth < 800
                              ? 10
                              : Math.min(
                                  Object.keys({
                                    ...fire.growth?.generalGrowthGraph,
                                    ...fire.drawdown.generalDrawdownGraph,
                                  }).length,
                                  30
                                ),
                        },
                      }}
                      series={[
                        {
                          data: Object.keys({
                            ...fire.growth?.generalGrowthGraph,
                            ...fire.drawdown.generalDrawdownGraph,
                          }).map((k) => {
                            const merged = {
                              ...fire?.growth?.generalGrowthGraph,
                              ...fire?.drawdown.generalDrawdownGraph,
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
                              ...fire?.growth?.retirementGrowthGraph,
                              ...fire?.drawdown.retirementDrawdownGraph,
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
                  </div>
                </>
              </Grid>
            </section>
          )}
        </NoSsr>
      </Box>
    </main>
  );
}

export default Calculator;
