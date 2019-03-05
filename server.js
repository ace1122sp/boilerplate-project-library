'use strict';
require('dotenv').config();
const config = require('./config');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
const dbConnect = require('./db');
const errorHandler = config.app.env === 'PRODUCTION' ? require('./libs/prodErrorHandler') : require('./libs/devErrorHandler');

const app = express();    

const http = require('http').Server(app);
const io = require('socket.io')(http);

// keep count of opened sockets
let sockets = {};
let socketsNumber = 0;

io.on('connection', socket => {

  if (!sockets[socket.id]) socketsNumber++;
  sockets[socket.id] = socket.id;

  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
    delete sockets[socket.id];
    socketsNumber--;
  });

  socket.on('new book', book => {
    io.emit('new book', book);
  });

  // this needs to be cleaned of with use of nsp or rooms
  socket.on('delete book', id => {
    socket.broadcast.emit('delete book', id);
  });

  socket.on('delete all books', () => {
    socket.broadcast.emit('delete all books');
  });

  // this needs to be cleaned up with use of nsp or rooms
  socket.on('new comment', comment => {
    socket.broadcast.emit('new comment', comment);
  });

  socket.on('typing comment', bookId => {
    socket.broadcast.emit('typing comment', bookId);
  });

  socket.on('typing comment end', bookId => {
    socket.broadcast.emit('typing comment end', bookId);
  });
});

dbConnect();

app.use(cors({origin: '*'})); //USED FOR FCC TESTING PURPOSES ONLY!
app.use(helmet());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use((req, res, next) => {
  res.set({
    'Content-Security-Policy': "default-src 'self' 'unsafe-eval' 'unsafe-inline'; img-src 'self'; base-uri 'none'"
  });
  
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev')); // configure according to env

app.use('/public', express.static(process.cwd() + '/public'));

// add gzip config
// app.get('*.js', (req, res, next) => {
//   req.url = req.url + '.gz';
//   res.set({
//     'Content-Encoding': 'gzip',
//     'Content-Type': 'text/javascript'
//   });

//   next();
// });

//Routing for API 
apiRoutes(app);  

//Index page (static HTML)
app.route('/*')
  .get((req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);
    
// add error handling
app.use(errorHandler.logErrors);
app.use(errorHandler.clientResponse);

//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
http.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + config.app.port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
  
  setInterval(() => {
    console.log('connected sockets at: ' + Date() + ': ' + socketsNumber);
  }, 5000);
});

module.exports = app; //for unit/functional testing
