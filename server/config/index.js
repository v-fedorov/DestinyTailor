var nconf = require('nconf'),
    path = require('path');

// add the configuration files
nconf.add('local', {
    type: 'file',
    file: path.join(__dirname, '../../local.json')
}).add('config', {
    type: 'file',
    file: path.join(__dirname, (process.env.NODE_ENV || 'dev') + '.json')
});

module.exports = nconf.get();
