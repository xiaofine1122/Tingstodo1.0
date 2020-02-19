import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Container from './screen/Container';
import Login from './screen/Login';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" component={Container} />
        </Switch>
      </Router>  
    );
  }
}

export default App;
