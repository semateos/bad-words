
var socket = io();

var words = [
    {word:"word1", action:"bomb"},
    {word:"word2", action:"bomb"},
    {word:"word3", action:"bomb"},
    {word:"word4", action:"bomb"},
    {word:"word5", action:"bomb"},
    {word:"word6", action:"bomb"},
    {word:"word7", action:"bomb"},
    {word:"word8", action:"bomb"},
    {word:"word9", action:"bomb"},
    {word:"word10", action:"+3"},
    {word:"word11", action:"+2"}
];

var gifBombs = [
    {name:"cat", src:"img/cat.gif"},
    {name:"cat", src:"img/cat.gif"},
    {name:"cat", src:"img/cat.gif"},
    {name:"cat", src:"img/cat.gif"},
    {name:"cat", src:"img/cat.gif"},
    {name:"cat", src:"img/cat.gif"},
    {name:"cat", src:"img/cat.gif"},
    {name:"cat", src:"img/cat.gif"},
    {name:"cat", src:"img/cat.gif"},
    {name:"cat", src:"img/cat.gif"},
    {name:"cat", src:"img/cat.gif"},
    {name:"cat", src:"img/cat.gif"}
];

var players = [
    {name:"doofus", avatar:"img/doofus.png"},
    {name:"doggy", avatar:"img/doggy.png"},
    {name:"cat", avatar:"img/cat.png"}
];

var collectedGifBombs = [];

var currentPlayerTarget = players[0];

var me;

init();

function init() {
    
    // voice recognition
    var commandWord = "whatever";
    annyang.addCommands({commandWord: function(){alert("whatever!");}});
    
    var greeting = function(term) {
        console.log('say:', term);
        // $console.text(term);
        socketSend({event: 'chat', body: term});
    }
    
    //$console.text(term);
    
    //socketSend({event: 'chat', body: term});
    
    //annyang.start({ autoRestart: false, continuous: false });
    var commands = {
      // By defining a part of the following command as optional, annyang will respond to both:
      // "say hello to my little friend" as well as "say hello friend"
      'say *term': greeting
    };

    // Add our commands to annyang
    annyang.addCommands(commands);
    annyang.debug();
    // Start listening. You can call this here, or attach this call to an event, button, etc.
    annyang.start({ autoRestart: true });
    annyang.addCommands({"hello": function(){alert("hi!");}});
    annyang.addCommands({"monkey": function(){alert("goodbye!");}});
}


// multiplayer socket.io shit

function socketSend(message){
    socket.emit('message', message);
}

socket.on('message', function(message){
    alert("message received:" + message.body);
  console.log(message);
    switch(message.event) {
    case "chat":
        console.log("word received thru socket: " + message.body);
    break;
    case "setPlayer":
        me = getPlayerByName(message.body).name;
    break;
    case "removeCommand":
        removeCommand(message.body); // would be a commandName
    break;
    case "gifBomb":
        if(message.body.target == "all") {
            receiveGifBomb(message.body); // would be a gifName
        } else {
            if (me == getPlayerByName(message.body.target)){
                receiveGifBomb(message.body); // would be a gifName
            }
        }
    break;
    }
});


// game functions

function registerPlayers() {
    // numPlayers gets set from reading how many in the socket
    var numPlayers = 3;
    for(var i=0; i<numPlayers; i++) {
        
    }
}

function addGifBombToArsenal(gifName) {
    var gifBomb = getGifBombByName(gifName);
    collectedGifBombs.push(gifBomb);
    addCommand(gifBomb.name, function(){
        sendGifBomb(gifBomb.name, currentPlayerTarget);
    });
}

function sendGifBomb(gifName, target) {
    var gifBomb = getGifBombByName(gifName);

    // socket code
    if(target == "all") {

    }
}

function receiveGifBomb(gifName) {
    for(var i=0; i<gifBombs.length; i++) {
        if(gifName == gifBombs[i].name) {
            // ui display Gif fullscreen
        }
    }
}

////////////////////////////
// util functions
function getGifBombByName(gifName) {
    for(var i=0; i<gifBombs.length; i++) {
        if(gifName == gifs[i].name) {
            return gifBombs[i];
        }
    }
}

function getPlayerByName(playerName) {
    for(var i=0; i<players.length; i++) {
        if(players[i].name == playerName){
            return players[i];
        }
    }
}

function removeCommand(commandWord) {
    annyang.removeCommands(commandWord);
}

function addCommand(commandWord, action) {
    annyang.addCommands({commandWord: action});
}
