import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MainPage from './main/views';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route render={() => <h1>Oops! Page not found!</h1>} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
