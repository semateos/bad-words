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

                db.players.findOne({connected:false})
                .then(function(player) {
                
                    player.socket = socket.id;
                    player.connected = true;
                    player.save();
                    
                    console.log('player connected as', player);
                    socket.emit('message', {event: 'newPlayer', player: player});
                    
                    db.players
                        .find({connected:true})
                    .then(function(players){
                        console.log('players', players);
                        socket.broadcast.emit('message', {event: 'players', players: players});
                        socket.emit('message', {event: 'players', players: players});
                    });

                });

                //console.log('connection test', socket.id);
            },

            disconnectHandler: function (socket) {

                return function () {
                    
                    var db = server.plugins['dogwater'];

                    db.players.findOne({socket: socket.id})
                    .then(function(player) {
                    
                        player.socket = '';
                        player.connected = false;
                        player.save();
                        
                        console.log('player disconnected', player);

                        db.players.find({connected:true})
                        .then(function(players){

                            console.log('players', players);
                            socket.broadcast.emit('message', {event: 'players', players: players});
                            socket.emit('message', {event: 'players', players: players});
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

                                db.players.findOne({socket: socket.id})
                                .then(function(player) {
                                
                                    player.score = message.body.score;
                                    player.save();

                                    console.log('player score', player);
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
