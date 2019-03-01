import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import Book from './Book';
import Header from './Header';
import Footer from './Footer';
import NotFound from './NotFound';

const App = () => 
  <Fragment>
    <Header />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/books/:id" component={Book} />
      <Route path="/" component={NotFound} />
    </Switch>
    <Footer />
  </Fragment>

export default App;