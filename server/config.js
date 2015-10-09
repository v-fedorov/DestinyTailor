require('dotenv').load();

// main configuration
var config = {
    apiKey: process.env.X_API_KEY || '',
    cache: {
        stdTTL: 0,
        useClones: false
    },
	port: process.env.PORT || 3000
};

module.exports = config;
