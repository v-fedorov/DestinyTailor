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

// setup the static files and home page
var indexPath;
if (config.env === 'dev') {
    indexPath = path.join(__dirname, '../src/index.html');
    app.use('/dist', express.static(path.join(__dirname, '../src')));
} else {
    indexPath = path.join(__dirname, '../public/dist/index.html');
};

app.use(express.static(path.join(__dirname, '../public')));

// configure the routes, including error handling
app.get('/', function(req, res) {
    res.sendFile(indexPath);
});
app.use('/api', apiController);
app.use(function(err, req, res, next) {
    res.status(err.status || 500).render('error', {
        message: err.message,
        error: app.get('env') === 'development' ? err : {}
    });
});

module.exports = app;
