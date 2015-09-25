var fs = require('fs'),
    path = require('path');

/**
 * Registers all routes, dynamically selecting from the controllers folder.
 * @param {object} app The express application.
 */
function registerRoutes(app) {
    var controllersPath = path.join(__dirname, '../app/controllers');
 
    // select all controllers
    fs.readdirSync(controllersPath).forEach(function(file) {
        if (path.extname(file) !== '.js') {
            return;
        };
        
        // trim the file to select the route and controller
        var route = file.substr(0, file.indexOf('.')),
            controller = require('../app/controllers/' + route);
            
        // respect the index
        if (route === 'index') {
            route = '';
        };
        
        app.use('/' + route.toLowerCase(), controller);        
    });
    
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
};

module.exports = registerRoutes;