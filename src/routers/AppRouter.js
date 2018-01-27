import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import LoginPage from '../components/LoginPage';
import DashboardPage from '../components/DashboardPage';
import GroupPage from '../components/GroupPage';
import ProfilePage from '../components/ProfilePage';
import NotFoundPage from '../components/NotFoundPage';
import BugPage from '../components/BugPage';
import UpdatePage from '../components/UpdatePage';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export const history = createHistory();

const AppRouter = () => (
      <Router history={history}>
        <div>
            <Switch>
                <PublicRoute path="/" component={LoginPage} exact={true} />
                <PrivateRoute path="/dashboard" component={DashboardPage} />
                <PrivateRoute path="/groups/:id" component={GroupPage} />
                <PrivateRoute path="/profile" component={ProfilePage} />
                <PrivateRoute path="/bug-report" component={BugPage} />
                <PrivateRoute path="/updates" component={UpdatePage} />
                <Route component={NotFoundPage} />
            </Switch>
        </div>
    </Router>
);

export default AppRouter;