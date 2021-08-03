import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LandingPage from './LandingPage';
import CreateTestTemplatePage from './main/views/CreateTestTemplatePage';
import TestTemplateDetailsPage from './test-template-details/views';
import TestInstanceDetailsPage from './test-instance-details/views';
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
      <UserContext.Provider value={{ user, setUser, isLoading, setLoading, token, setToken }}>
      <BrowserRouter>
        <Switch>
          <PrivateRoute exact path="/" component={LandingPage} />
          {/* <Route exact path="/tests" component={MainPage} /> */}
          <PrivateRoute exact path="/create-test-template" component={CreateTestTemplatePage} />
          <PrivateRoute path="/test-template-details/:id" component={TestTemplateDetailsPage} />
          <PrivateRoute exact path="/test-instance-details/:id" component={TestInstanceDetailsPage} />
          <PrivateRoute render={() => <h1>Oops! Page not found!</h1>} />
        </Switch>
      </BrowserRouter>
      </UserContext.Provider>
    );
  }
}

export default App;
