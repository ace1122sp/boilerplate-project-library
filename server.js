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
const dbConnect = require('./libs/db');
const { notFound, sendIndexHTML, redirectToCompressedStaticJS } = require('./controllers/general');
const errorHandler = config.app.env === 'PRODUCTION' ? require('./libs/prodErrorHandler') : require('./libs/devErrorHandler');
const ServerSocket = require('./libs/serverSocket');

const app = express();    

const http = require('http').Server(app);

// start socket
const serverSocket = new ServerSocket(http);
serverSocket.startListening();

// connect to db
dbConnect();

app.use(cors({origin: '*'})); //USED FOR FCC TESTING PURPOSES ONLY!
app.use(helmet());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
app.use((req, res, next) => {
  res.set({
    'Content-Security-Policy': "default-src 'self' 'unsafe-eval' 'unsafe-inline'; img-src 'self'; base-uri 'none'"
  });
  
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev')); // configure according to env

// add gzip config
app.get('*.js', redirectToCompressedStaticJS);

app.use('/public', express.static(process.cwd() + '/public'));

//Routing for API 
apiRoutes(app);  

//Index page (static HTML)
app.route('/*')
  .get(sendIndexHTML);

//For FCC testing purposes
fccTestingRoutes(app);
    
// add error handling
app.use(errorHandler.logErrors);
app.use(errorHandler.clientResponse);

//404 Not Found Middleware
app.use(notFound);

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
});

module.exports = app; //for unit/functional testing
