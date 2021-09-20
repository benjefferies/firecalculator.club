import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Calculator from './views/Calculator';
import Pension from './views/Pension';
import ReactGA from 'react-ga';

ReactGA.initialize('UA-207743771-1');
ReactGA.pageview(window.location.pathname + window.location.search);

export const routePaths = {
  root: '/calculator',
  pension: '/pension',
};

export const Routes: React.FC = () => {
  return (
    <Route
      path="/"
      render={(r) => (
        <Switch>
          <Route path={routePaths.root} component={Calculator} />
          <Route path={routePaths.pension} component={Pension} />
          <Redirect path="*" to={`${r.match.url}calculator`} />
        </Switch>
      )}
    />
  );
};
