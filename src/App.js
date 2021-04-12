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
    getClient().get('/dashboard-metadata').then(({ data: meta }) => {
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
        <Switch>
          <Route exact path="/" component={LandingPage} />
          {/* <Route exact path="/tests" component={MainPage} /> */}
          <Route exact path="/create-test-template" component={CreateTestTemplatePage} />
          <Route path="/test-template-details/:id" component={TestTemplateDetailsPage} />
          <Route exact path="/test-instance-details/:id" component={TestInstanceDetailsPage} />
          <Route render={() => <h1>Oops! Page not found!</h1>} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
