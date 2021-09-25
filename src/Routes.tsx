import { AppBar, Button, createTheme, CssBaseline, ThemeProvider, Toolbar, useMediaQuery } from '@material-ui/core';
import * as React from 'react';
import ReactGA from 'react-ga';
import { Redirect, Route, Switch } from 'react-router-dom';
import Calculator from './views/Calculator';

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
            <Button href="https://blog.firecalculator.club" color="inherit" style={{marginLeft: "auto"}} >
              blog
            </Button>
          </Toolbar>
        </AppBar>
          <Switch>
            <Route path={routePaths.root} component={Calculator} />
            <Redirect path="*" to={`${r.match.url}calculator`} />
          </Switch>
      </CssBaseline>
    </ThemeProvider>
        </div>
      )}
    />
  );
};
