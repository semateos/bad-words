// This is the server version to be run standalone

// Dependencies
var Hapi = require('hapi');

// Server Config
var config = require('./server/config');

// Create a server with a host, port, and options
var server = Hapi.createServer(config.host, config.port, config.hapi.options);

var plugins = require('./server/config/plugins');

plugins = plugins.concat([
	{
        plugin: require("good"),
        options: {
            subscribers: {
                console: ['ops', 'request', 'log', 'error']
				//'./tmp/logs/': ['ops', 'request', 'log', 'error']
            }
        }
    },
    {
        plugin: require('hapi-socket'),
        options: {
            connectHandler: function (socket) {

                var db = server.plugins['dogwater'];

                db.cats.findOne({connected:false})
                .then(function(cat) {
                
                    cat.socket = socket.id;
                    cat.connected = true;
                    cat.save();

                    console.log('player connected as', cat);

                    db.cats.find({connected:true})
                    .then(function(cats){

                        console.log('players', cats);
                        socket.broadcast.emit('message', {event: 'players', players: cats});
                        socket.emit('message', {event: 'players', players: cats});
                    });

                });

                //console.log('connection test', socket.id);
            },

            disconnectHandler: function (socket) {

                return function () {
                    
                    var db = server.plugins['dogwater'];

                    db.cats.findOne({socket: socket.id})
                    .then(function(cat) {
                    
                        cat.socket = '';
                        cat.connected = false;
                        cat.save();

                        console.log('player disconnected', cat);

                        db.cats.find({connected:true})
                        .then(function(cats){

                            console.log('players', cats);
                            socket.broadcast.emit('message', {event: 'players', players: cats});
                            socket.emit('message', {event: 'players', players: cats});
                        });
                    });

                };

                //console.log('connection test', socket.id);
            },

            messageHandler: function (socket) {

                return function (message) {

                    var db = server.plugins['dogwater'];
                    
                    if(message.event){

                        switch(message.event){

                            case 'playerScoreUpdate':

                                db.cats.findOne({socket: socket.id})
                                .then(function(cat) {
                                
                                    cat.score = message.body.score;
                                    cat.save();

                                    console.log('cat score', cat);
                                });

                                console.log('score update', message);
                                break;

                        }

                    }

                    console.log("Message sent!", message);
                    socket.broadcast.emit('message', message);
                };
            },
            logLevel: 3
        }
    },
	{ 
		plugin: require("./index")
	}
]);

server.pack.register(plugins, function(err) {
	
	if (err) throw err;
	server.start(function() {
	    console.log("Hapi server started @ " + server.info.uri.replace('0.0.0.0', 'localhost'));
	});
    }
    
);
