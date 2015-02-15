




// BASE SETUP ==================
// =============================

var express    = require('express')
  , app        = express()
  , bodyParser = require('body-parser')
  , morgan     = require('morgan')
  , mongoose   = require('mongoose')
  , config     = require('./config')
  , path       = require('path')
  , acl        = require('acl')
  ;





// APP CONFIGURATION -----------

// use body parser to grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// configure app to handle CORS
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \ Authorization');

    next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to our database
mongoose.connect(config.database);

// set static files location
app.use(express.static(__dirname + '/public'));





// ROUTES FOR API ==============
// =============================

// API Routes ------------------
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// CATCHALL --------------------
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});





// START THE SERVER ============
// =============================

app.listen(config.port);
console.log('Server is live on port ' + config.port);