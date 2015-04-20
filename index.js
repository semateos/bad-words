// This is the hapi plugin version to be included in other projects

// Dependencies
var Hapi = require('hapi');
var Hoek = require('hoek');

// Server Config
var config = require('./server/config');

exports.register = function(plugin, options, next) {

	//make config available to templates
	plugin.ext('onPostHandler', function (request, reply) {

        // Get the response object
        var response = request.response;

        if (request.response.variety === 'view') { 
	        request.response.source.context = Hoek.applyToDefaults(config, request.response.source.context);
	    }

	    reply();
    });
    
    // Make sure DB is available
    plugin.dependency('dogwater');
    
    plugin.route(require('./server/routes'));
    
    plugin.views(config.hapi.options.views);
    
    next();
};

exports.register.attributes = {
    pkg: require("./package.json")
}