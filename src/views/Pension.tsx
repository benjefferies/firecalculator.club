import { Adsense } from '@ctrl/react-adsense';
import {
  AppBar,
  Box,
  Button,
  createTheme,
  CssBaseline,
  makeStyles,
  NoSsr,
  Theme,
  ThemeProvider,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { useMemo } from 'react';
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

function Pension() {
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <Button href="/article" color="inherit">
                Articles
              </Button>
            </Toolbar>
          </AppBar>
          <Box mx={{ xs: 1, sm: 4, md: 16, lg: 32 }}>
            <Adsense
              client="ca-pub-1383291322337575"
              slot="7259870550"
              style={{ display: 'block' }}
              layout="in-article"
              format="fluid"
            />
            <NoSsr>
              <div>
                <Typography variant="h1">Pensions</Typography>
                <Typography variant="body1">
                  Pensions are a great tool in the FIRE toolbox, even when the goal is to FIRE before you reach pension
                  age.{' '}
                </Typography>
              </div>
              <div>
                <Typography variant="h2">Tax Advantages</Typography>
                <Typography variant="body1">
                  They have tax advantages that lead to more compound growth. If one were to invest £500 a month into an
                  EFT returning 6% for 15 years, the final figure would be £145,409.36 with an annual return of
                  £7,428.72 at a 6% return on investment. Investing the same amount leveraging pension tax relief would
                  be £600 a month with a final figure of £174,491.23 and an annual return of £8,914.46 at a 6% return on
                  investment. This is even greater when in the higher tax bracket; A final figure of £203,573.10 and
                  £10,400.21 return on investment. That said, pensions aren't ultimately tax-free as they are subject to
                  taxation at the point of drawdown; this can be managed with the 25% tax allowance and not drawing more
                  than one needs. The pro's of investing tax-free outweigh the future taxation as it means you'll have a
                  higher projected annual return on investment.
                </Typography>
                <img style={{ width: '1200px' }} src="/images/pension.png" alt="Pension" />
              </div>
              <div>
                <Typography variant="h2">FIRE before retirement age</Typography>
                <Typography variant="body1">
                  One can still invest and get the benefits of a pension and still achieve their FIRE goals. It doesn't
                  have to be either-or. One can invest in an ISA and a pension. ISA's are great investments as they are
                  not subject to tax on their growth, although they have an annual limit of £20000. Pre-retirement
                  investment can be seen as a vehicle to get to retirement and a pension to last the rest of one's life.
                  Remember, pension investments will continue to grow whilst until retirement age! Using the fire
                  calculator demonstrates this scenario. At 30 years old with no savings and a FIRE goal of 45, if one
                  were to invest £15000 into both an ISA and pension annually with a 6% return on investment, they'd
                  have £349,139.55 in the ISA. Given the ISA needs to last until the pension fund is accessible at 57,
                  the annual drawdown would be around £37000 with a more modest, less risk-averse 4% return on
                  investment once FIRE'd to leave the ISA empty. At that point, the pension investment would be worth
                  £702,537.37, with the same risk-averse 4% return on investment, one could draw down £40000 per year
                  until 82 years old.
                </Typography>
              </div>
              <div>
                <Typography variant="h2">Limits and company contribution</Typography>
                <Typography variant="body1">
                  At £40000, pensions have a higher annual limit than ISA. Higher tax bracket earners should try to
                  leverage as much of that limit to get an extra 40% in investments. Employers often incentivise with
                  pension contributions. It's not uncommon to see an annual contribution of 10% of a salary. It's
                  possible to invest 50% more than investing in an ISA alone when including the tax advantages. What
                  about limited company directors? Limited companies can reduce their capital gains tax by using
                  employee contributions to employees pensions; this can be up to £40000. Doing this will reduce your
                  corporation tax bill by 20% and avoid dividend tax.
                </Typography>
              </div>
            </NoSsr>
          </Box>
        </div>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default Pension;
