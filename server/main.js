var apiController = require('./controllers/api'),
    config = require('./config'),
    express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

var app = express();

// configure the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// setup the environment
switch (config.env) {
    case 'build':
    default:
        console.log('*** [dev] environment ***');
        app.use(express.static(path.join(__dirname, '../client/')));
        app.use(express.static(path.join(__dirname, '../')));
        app.use('/*', express.static(path.join(__dirname, '../client/index.html')));
};

// configure the routes, including error handling
app.use('/api', apiController);
app.use(function(err, req, res, next) {
    res.status(err.status || 500).render('error', {
        message: err.message,
        error: config.env === 'dev' ? err : {}
    });
});

module.exports = app;
