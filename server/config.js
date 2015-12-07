var dotenv = require('dotenv');

// load the environment variables
var env = dotenv.config({
    silent: true
});

// export the configuration settings
module.exports = {
    apiKey: process.env.API_KEY || '',
    cache: {
        stdTTL: 0,
        useClones: false
    },
    contentMaxAge: '28d',
    env: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 3000
};
