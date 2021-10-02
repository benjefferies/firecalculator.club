import { AppBar, createTheme, CssBaseline, ThemeProvider, Toolbar, useMediaQuery } from '@material-ui/core';
import * as React from 'react';
import ReactGA from 'react-ga';
import { Link, Route, Switch } from 'react-router-dom';
import Calculator from './views/Calculator';
import { Blog } from './views/Blog';
import './Routes.scss'

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  console.log('Running development');
} else {
  ReactGA.initialize('UA-207743771-1');
  ReactGA.pageview(window.location.pathname + window.location.search);
}

export const routePaths = {
  root: '/',
  blog: '/blog'
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
                <Toolbar className="toolbar">
                  <div className="logo">FireCalculator.club</div>
                  <div className="link__container">
                  <Link className="animated" to="/">Home</Link>
                  <Link className="animated" to="/blog">Blog</Link>
                  </div>
                </Toolbar>
              </AppBar>
              <Switch>
                <Route path="/">
                  <Calculator />
                </Route>
                <Route path="/blog">
                  <Blog />
                </Route>
              </Switch>
            </CssBaseline>
          </ThemeProvider>
        </div>
      )}
    />
  );
};
