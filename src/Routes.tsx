import { AppBar, Button, createTheme, CssBaseline, ThemeOptions, ThemeProvider, Toolbar, useMediaQuery } from '@material-ui/core';
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
  root: '/',
};

export const lightTheme: ThemeOptions = {
  palette: {
    type: 'light',
    primary: {
      main: '#ff3d00',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    h1: {
      fontFamily: 'Yantramanav',
      fontSize: '8.2rem',
      fontWeight: 900,
    },
    h2: {
      fontFamily: 'Yantramanav',
      fontWeight: 900,
    },
    h3: {
      fontFamily: 'Yantramanav',
      fontWeight: 900,
    },
    h4: {
      fontFamily: 'Yantramanav',
      fontWeight: 900,
    },
    h5: {
      fontFamily: 'Yantramanav',
      fontWeight: 900,
    },
    h6: {
      letterSpacing: '0.05em',
      fontWeight: 900,
    },
    body1: {
      fontWeight: 600,
    },
    body2: {
      fontWeight: 600,
    },
  },
};

const darkTheme: ThemeOptions = {
  palette: {
    type: 'dark',
    primary: {
      main: '#FF3D00',
    },
    secondary: {
      main: '#F50057',
    },
    background: {
      default: '#202020',
      paper: '#303030',
    },
  },
  typography: {
    h1: {
      fontFamily: 'Yantramanav',
      fontSize: '8.2rem',
      fontWeight: 900,
    },
    h2: {
      fontFamily: 'Yantramanav',
      fontWeight: 900,
    },
    h3: {
      fontFamily: 'Yantramanav',
      fontWeight: 900,
    },
    h4: {
      fontFamily: 'Yantramanav',
      fontWeight: 900,
    },
    h5: {
      fontFamily: 'Yantramanav',
      fontWeight: 900,
    },
    h6: {
      letterSpacing: '0.05em',
      fontWeight: 900,
    },
    body1: {
      fontWeight: 600,
    },
    body2: {
      fontWeight: 600,
    },
  },
};
export const Routes: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () =>
      createTheme({
        ...(prefersDarkMode ? darkTheme : lightTheme),
        spacing: 8,
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
                  <Button href="https://blog.firecalculator.club" color="inherit" style={{ marginLeft: 'auto' }}>
                    blog
                  </Button>
                </Toolbar>
              </AppBar>
              <Switch>
                <Route path={routePaths.root} component={Calculator} />
                <Redirect path="*" to={`${r.match.url}`} />
              </Switch>
            </CssBaseline>
          </ThemeProvider>
        </div>
      )}
    />
  );
};
