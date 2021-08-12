import React, { useEffect } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LandingPage from './LandingPage';
import Login from './main/views/Login';
import CreateTestTemplatePage from './main/views/CreateTestTemplatePage';
import TestTemplateDetailsPage from './test-template-details/views';
import TestInstanceDetailsPage from './test-instance-details/views';
import getClient from './model/client';
import store from './store';
import { RECEIVE_DASH_META } from './reducer';
import { UserContext } from './hooks/UserContext';
import useUserActions from './hooks/userActions';
import PrivateRoute from './main/views/PrivateRoute';

function App() {
  const userActions = useUserActions();

  useEffect(() => {
    getClient().get('dashboard-metadata').then(({ data: meta }) => {
      store.dispatch({
        type: RECEIVE_DASH_META,
        data: {
          meta,
        },
      });
    });
  });

  return (
    <UserContext.Provider value={userActions}>
      <BrowserRouter>
        <Switch>
          <Route path="/auth/login" component={Login} />
          <PrivateRoute path="/">
            <LandingPage />
          </PrivateRoute>
          <PrivateRoute exact path="/create-test-template">
            <CreateTestTemplatePage />
          </PrivateRoute>
          <PrivateRoute path="/test-template-details/:id">
            <TestTemplateDetailsPage />
          </PrivateRoute>
          <PrivateRoute exact path="/test-instance-details/:id">
            <TestInstanceDetailsPage />
          </PrivateRoute>
          {/* <Route exact path="/tests" component={MainPage} /> */}
        </Switch>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
