import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MainPage from './main/views';
import CreateTestTemplatePage from './main/views/CreateTestTemplatePage';
import TestTemplateDetailsPage from './test-template-details/views';
import TestInstanceDetailPage from './test-instance-details/views';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/create-test-template" component={CreateTestTemplatePage} />
          <Route path="/test-template-details/:id" component={TestTemplateDetailsPage} />
          <Route exact path="/test-instance-details" component={TestInstanceDetailPage} />
          <Route render={() => <h1>Oops! Page not found!</h1>} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
