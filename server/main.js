var apiController = require('./controllers/api'),
    config = require('./config'),
    compression = require('compression'),
    express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    request = require('request');

var app = express();

// configure the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// setup the api routes
app.use('/api', apiController);
app.use('/Platform/Destiny/*?', function(req, res) {
    var options = {
        url: 'http://www.bungie.net' + req.originalUrl,
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': config.apiKey
        }
    };

    req.pipe(request(options)).pipe(res);
});

// setup the app route
switch (config.env) {
    case 'dist':
        console.log('*** [dist] environment ***');
        serveStatic('../dist/', config.contentMaxAge);
        app.use('/*', express.static(path.join(__dirname, '../dist/index.html')));
        break;
    default:
        console.log('*** [dev] environment ***');
        serveStatic('../client/');
        serveStatic('../');
        app.use('/*', express.static(path.join(__dirname, '../client/index.html')));
        break;
};

/**
 * Registers the static content with a expiration header.
 * @param {String} relativeRoot The relative path to the static folder.
 * @param {String|Number} maxAge The max age of the content
 */
function serveStatic(relativeRoot, maxAge) {
    var root = path.join(__dirname, relativeRoot);

    app.use(express.static(root, {
        maxAge: maxAge || 0
    }));
}

// configure error handling
app.use(function(err, req, res, next) {
    res.status(err.status || 500).render('error', {
        message: err.message,
        error: config.env === 'dev' ? err : {}
    });
});

module.exports = app;
