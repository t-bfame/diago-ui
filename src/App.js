import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LandingPage from './LandingPage';
import CreateTestTemplatePage from './main/views/CreateTestTemplatePage';
import TestTemplateDetailsPage from './test-template-details/views';
import TestInstanceDetailsPage from './test-instance-details/views';
import { Login } from "./auth/containers/Login"
import { Register } from "./auth/containers/Register"
import { Recover } from "./auth/containers/Recover"
import { Callback } from "./auth/containers/Callback"
import { Dashboard } from "./auth/containers/Dashboard"
import { SessionProvider } from "./auth/services/session"
import { Settings } from "./auth/containers/Settings"
import { Verify } from "./auth/containers/Verify"
import config from "./auth/config/kratos"
import getClient from './model/client';
import store from './store';
import { RECEIVE_DASH_META } from './reducer';

class App extends Component {
  componentDidMount() {
    getClient().get('dashboard-metadata').then(({ data: meta }) => {
      store.dispatch({
        type: RECEIVE_DASH_META,
        data: {
          meta,
        },
      });
    });
  }

  render() {
    return (
      <BrowserRouter>
        <SessionProvider>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            {/* <Route exact path="/tests" component={MainPage} /> */}
            {/* Auth Routes */}
            <Route path="/callback" element={ <Callback /> } />
            <Route path={ config.routes.login.path } element={ <Login /> } />
            <Route path={ config.routes.settings.path } element={ <Settings /> } />
            <Route path={ config.routes.verification.path } element={ <Verify /> } />
            <Route path={ config.routes.recovery.path } element={ <Recover /> } />
            <Route path={ config.routes.registration.path } element={ <Register /> } />
            {/* Other Routes */}
            <Route exact path="/create-test-template" component={CreateTestTemplatePage} />
            <Route path="/test-template-details/:id" component={TestTemplateDetailsPage} />
            <Route exact path="/test-instance-details/:id" component={TestInstanceDetailsPage} />
            <Route render={() => <h1>Oops! Page not found!</h1>} />
          </Switch>
        </SessionProvider>
      </BrowserRouter>
    );
  }
}

export default App;
