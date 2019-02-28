import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

const root = document.getElementById('root');

const App = () => 
  <div>
    <nav>
      <Link to="/">First Page</Link>
      <Link to="/home">Home</Link>
    </nav>    
    <Switch>
      <Route exact path="/" component={First} />
      <Route path="/home" component={Home} />
    </Switch>
  </div>

const First = () => 
  <main>
    <h1>Hello World</h1>
  </main>

const Home = () => 
  <main>
    <h1>Hi Ace!</h1>
    <p>Welcome to Palo Alto, California!!</p>
  </main>

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  root
);