import React from 'react';
import { render } from 'react-dom';

const root = document.getElementById('root');

const App = () => 
  <div>
    <h1>hello World</h1>
    <p>Welcome to California!</p>
  </div>

render(<App />, root);