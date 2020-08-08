import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import Dashboard from '../pages/Dashboard'
import ForgotPaswword from '../pages/ForgotPaswword'
import ResetPassword from '../pages/ResetPassword'

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" component={SignIn} exact />
      <Route path="/signup" component={SignUp} />
      <Route path="/dashboard" component={Dashboard} isPrivate />
      <Route path="/forgot-password" component={ForgotPaswword} />
      <Route path="/reset-password" component={ResetPassword} />
    </Switch>
  );
}

export default Routes;