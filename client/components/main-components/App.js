import React, { useEffect, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faChartLine, faBalanceScale, faThumbsUp, faEyeSlash, faSpinner, faHouseDamage, faFolder } from '@fortawesome/free-solid-svg-icons';

import Home from './Home';
import Book from './Book';
import Header from './Header';
import Footer from './Footer';
import NotFound from './NotFound';

library.add(fab, faChartLine, faBalanceScale, faThumbsUp, faEyeSlash, faSpinner, faHouseDamage, faFolder );

const App = ({ socket }) => {
  
  useEffect(() => {
    return () => {
      socket.close();
    };
  }, []);

  return (
    <Fragment>
      <Header />
      <Switch>
        <Route exact path="/" render={props => <Home {...props} socket={socket} />} />
        <Route path="/books/:id" render={props => <Book {...props} socket={socket} />} />
        <Route path="/" component={NotFound} />
      </Switch>
      <Footer />
    </Fragment>
  );
}
  
export default App;