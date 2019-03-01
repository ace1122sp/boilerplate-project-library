import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faChartLine, faBalanceScale, faThumbsUp, faEyeSlash, faSpinner, faHouseDamage, faFolder } from '@fortawesome/free-solid-svg-icons';

import Home from './Home';
import Book from './Book';
import Header from './Header';
import Footer from './Footer';
import NotFound from './NotFound';

library.add(fab, faChartLine, faBalanceScale, faThumbsUp, faEyeSlash, faSpinner, faHouseDamage, faFolder );

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