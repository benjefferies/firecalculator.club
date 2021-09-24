import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Calculator from './views/Calculator';
import Pension from './views/Pension';
import Articles from './views/Articles';
import CapitalGains from './views/CapitalGains';
import ReactGA from 'react-ga';

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
  return (
    <Route
      path="/"
      render={(r) => (
        <Switch>
          <Route path={routePaths.root} component={Calculator} />
          <Route path={routePaths.pension} component={Pension} />
          <Route path={routePaths.capitalGains} component={CapitalGains} />
          <Route path={routePaths.article} component={Articles} />
          <Redirect path="*" to={`${r.match.url}calculator`} />
        </Switch>
      )}
    />
  );
};
