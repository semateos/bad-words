
var socket = io();

var words = [
    {word:"supercalifragilisticexpialidocious", action:"bomb"},
    {word:"silly", action:"bomb"},
    {word:"penis", action:"bomb"},
    {word:"nipple", action:"bomb"},
    {word:"shocker", action:"bomb"},
    {word:"dildo", action:"bomb"},
    {word:"socket", action:"bomb"},
    {word:"pickle", action:"bomb"},
    {word:"stank", action:"bomb"},
    {word:"twat", action:"bomb"},
    {word:"snatch", action:"bomb"},
    {word:"thong", action:"+3"},
    {word:"spank", action:"+2"}
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

var colors = [
    {name:"red", hex:""},
    {name:"pink", hex:""},
    {name:"green", hex:""},
    {name:"blue", hex:""},
    {name:"purple", hex:""},
    {name:"yellow", hex:""},
];

var wordInCrosshairs = "";
var collectedGifBombs = [];
var currentPlayerTarget = null;
var me;

init();

function init() {
    // voice recognition
    annyang.start({ autoRestart: true });
    
    for(var i=0; i<words.length; i++) {
        var word = words[i].word
        /*annyang.addCommands({[word]: function(){
            // idk how to bind the current words[i] variable to this function
            
            setTimeout(function(w) {
                alert("the word: "+w);
            }, 1, word);
            
            var handleWord = function(w){
                var myWord = w;
                alert("word matched! " + w);
            };
            
            var boundHandleWord = handleWord.bind(this, words[i]);
            boundHandleWord();
            
        }});*/
        
        annyang.addCommands({[word]: function(){alert("hi!")}, arguments:word[i]});
    }
    
    var greeting = function(term) {
        console.log('say:', term);
        // $console.text(term);
        socketSend({event: 'chat', body: term});
    }
    
    var commands = {
      // By defining a part of the following command as optional, annyang will respond to both:
      // "say hello to my little friend" as well as "say hello friend"
      'say *term': greeting
    };
    
    // Add our commands to annyang
    
    annyang.debug();
    
    // Start listening. You can call this here, or attach this call to an event, button, etc.
    annyang.addCommands(commands);
    //annyang.start({ autoRestart: false, continuous: false });
}


// multiplayer socket.io shit

function socketSend(message){
    socket.emit('message', message);
}

socket.on('message', function(message){
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
            receiveGifBomb(message.body.gifName, message.body.fromPlayer); // would be a gifName
        } else {
            if (me == getPlayerByName(message.body.target)){
                receiveGifBomb(message.body.gifName, message.body.fromPlayer); // would be a gifName
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

function targetInCrosshairs(target) {
    if(target.type == "player"){
        
    } else if(target.type == "word"){
        wordInCrosshairs = word;
    }
}

function nothingInCrosshairs() {
    wordInCrosshairs = "";
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
    socketSend({event: 'gifBomb', body: {target: target, gifName: gifName}});
}

function receiveGifBomb(gifName, fromPlayer) {
    for(var i=0; i<gifBombs.length; i++) {
        if(gifName == gifBombs[i].name) {
            // ui display Gif fullscreen
            // also display who sent it
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
