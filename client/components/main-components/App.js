import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import Book from './Book';
import Header from './Header';
import Footer from './Footer';

const App = () => 
  <Fragment>
    <Header />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/book/" component={Book} />
    </Switch>
    <Footer />
  </Fragment>

export default App;