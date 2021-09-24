import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Calculator from './views/Calculator';
import Pension from './views/Pension';
import Articles from './views/Articles';
import CapitalGains from './views/CapitalGains';
import ReactGA from 'react-ga';
import { AppBar, Toolbar, Button, createTheme, CssBaseline, ThemeProvider, useMediaQuery } from '@material-ui/core';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  console.log('Running development');
} else {
  ReactGA.initialize('UA-207743771-1');
  ReactGA.pageview(window.location.pathname + window.location.search);
}

export const routePaths = {
  root: '/calculator',
  article: '/article',
  pension: '/article/pension',
  capitalGains: '/article/capital-gains',
};

export const Routes: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
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
  return (
    <Route
      path="/"
      render={(r) => (
        <div>
        <ThemeProvider theme={theme}>
          <CssBaseline>
        <AppBar position="static">
          <Toolbar>
            <Button href="/article" color="inherit">
              Articles
            </Button>
          </Toolbar>
        </AppBar>
          <Switch>
            <Route path={routePaths.root} component={Calculator} />
            <Route path={routePaths.pension} component={Pension} />
            <Route path={routePaths.capitalGains} component={CapitalGains} />
            <Route path={routePaths.article} component={Articles} />
            <Redirect path="*" to={`${r.match.url}calculator`} />
          </Switch>
      </CssBaseline>
    </ThemeProvider>
        </div>
      )}
    />
  );
};
