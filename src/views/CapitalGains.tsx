import { Adsense } from '@ctrl/react-adsense';
import {
  Box, createTheme, makeStyles,
  NoSsr,
  Theme, Typography,
  useMediaQuery
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

function CapitalGains() {
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
    <div className={classes.root}>
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
            <Typography variant="h1">What can I do after pension and ISA?</Typography>
            <Typography variant="body1">
              Capital gains tax-allowance means you can make another £12300 profit per year tax efficiently.
            </Typography>
            <Typography variant="body1">
              Pensions and ISA's are the most tax-efficient way of investing, but there is a limit to how much you can
              contribute; they are £40000 and £20000 respectively. After leveraging them, the next place tax efficiency
              you can look at leveraging is capital gains tax. The current capital gains tax-free allowance is £12,300.
              It's possible to make £12,300 in profit before you need to pay capital gains tax. Capital gains tax is an
              annual threshold, and you can leverage it year on year.
            </Typography>
          </div>
          <div>
            <Typography variant="h2">How does it work?</Typography>
            <Typography variant="body1">
              Let's say Alice has leveraged her £40000 pension allowance and contributed £20000 to her ISA. She has an
              annual bonus of £20000 that she wants to invest in, so she puts it into a general stocks investment fund.
              Her investment fund is excelling, and Alice is making a good return of 10%. She doesn't have to pay any
              tax whilst she holds these stocks.
            </Typography>
            <Typography variant="body1">
              After five years, Alice has invested £100000. The growth of the investment means it's worth £124600. Alice
              has still not paid any tax on this investment, and she doesn't until she sells and makes capital on her
              investment. The amount the investment had grown was £24600. If she were to sell all the stocks, Alice
              would be able to leverage the £12300 capital gains tax-free allowance and then she'd have to pay capital
              gains tax at £2460 on the other £12300.
            </Typography>
            <img style={{ width: '1200px' }} src="/images/capital-gains.png" alt="Capital Gains" />
            <Typography variant="body1">
              For ease of calculation, the investment doesn't grow over the next few years. Alice could split selling
              the investment over two tax years instead of selling the investment over one tax year so she wouldn't have
              to pay the £2460 capital gains tax.
            </Typography>
          </div>
          <div>
            <Typography variant="h2">Other investments</Typography>
            <Typography variant="body1">
              Property is another investment popular investment. You can profit from property in the rental income as
              well as the growth of the asset. It's necessary to consider the additional costs when investing in
              property, such as maintenance, letting fees and time when the property isn't let out. On top of this,
              selling property is very binary; you can only sell the whole house. It makes it hard to be tax-efficient
              when trying to get the capital back out. You can't split the profit over multiple tax years, and you'll
              have to pay tax on any growth over £12300. It doesn't rule out investing in property. A varied investment
              portfolio can reduce risk.
            </Typography>
          </div>
        </NoSsr>
      </Box>
    </div>
  );
}

export default CapitalGains;
