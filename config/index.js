require('dotenv').load();

// main configuration
var config = {
	port: process.env.PORT || 3000,
	xApiKey: process.env.X_API_KEY || ''
};

module.exports = config;
