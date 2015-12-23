var config = require('./config');
var compression = require('compression');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();

// configure the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// setup the api routes
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
    case 'production':
        console.log('*** [production] environment ***');
        
        // serve the index with no-caching
        app.get('/', function(req, res) {
            res.sendFile(path.join(__dirname, '../dist/index.html'))
        });
        
        // serve the assets with caching, and register the SPA handler
        serveStatic('../dist/', config.contentMaxAge);
        app.use('/js/**/*.html', function(req, res) {
            send404(req, res, 'Unable to load Angular view separately.');
        });
        serveSpaHandler('../dist/index.html');
        break;
    default:
        console.log('*** [dev] environment ***');
        app.use(logger('dev'));
        
        // serve the assets and register the SPA handler
        serveStatic('../client/');
        serveStatic('../');
        serveSpaHandler('../client/index.html');
        break;
};

/**
 * Registers the SPA handler.
 * @param {string} relativePath The path handling the requests.
 */
function serveSpaHandler(relativePath) {
    var staticPath = path.join(__dirname, relativePath);
    app.use('/*', express.static(staticPath));
}

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

/**
 * Returns a 404 to the response object.
 * @param {Object} req The request being made.
 * @param {Object} res The response.
 * @param {String} description The reason for the 404.
 */
function send404(req, res, description) {
    var data = {
        status: 404,
        message: 'Not Found',
        description: description,
        url: req.originalUrl
    };

    res.status(404)
        .send(data)
        .end();
}

// configure error handling
app.use(function(err, req, res, next) {
    res.status(err.status || 500).render('error', {
        message: err.message,
        error: config.env === 'dev' ? err : {}
    });
});

module.exports = app;
