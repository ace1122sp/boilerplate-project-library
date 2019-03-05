import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './components/main-components/App';
import io from 'socket.io-client';

const root = document.getElementById('root');
const socket = io();

render(
  <BrowserRouter>
    <App socket={socket} />
  </BrowserRouter>,
  root
);