
var socket = io();

var words = [
    {word:"supercalifragilisticexpialidocious", action:"gifBomb"},
    {word:"penis", action:{type:"gifBomb", gifName:"cat"}},
    {word:"nipple", action:{type:"gifBomb", gifName:"cat"}},
    {word:"shocker", action:{type:"gifBomb", gifName:"cat"}},
    {word:"dildo", action:{type:"gifBomb", gifName:"cat"}},
    {word:"socket", action:{type:"gifBomb", gifName:"cat"}},
    {word:"pickle", action:{type:"gifBomb", gifName:"cat"}},
    {word:"stank", action:{type:"gifBomb", gifName:"cat"}},
    {word:"twat", action:{type:"gifBomb", gifName:"cat"}},
    {word:"snatch", action:{type:"gifBomb", gifName:"cat"}},
    {word:"thong", action:{type:"addPoints", numPoints: 3}},
    {word:"silly", action:{type:"addPoints", numPoints: 5}},
    {word:"spank", action:{type:"addPoints", numPoints: 2}}
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

var crosshairsTarget = "";
var collectedGifBombs = [];
var currentPlayerTarget = null;
var numPoints = 0;
var me;

start_voice();

function start_voice() {

    // voice recognition
    annyang.start({ autoRestart: true });
    
    //show speach debug
    annyang.debug();
    
    var word_matched = function(term) {
        console.log('said:', term);
        var word = getWord(term);
        if(targetInCrosshairs == term) {
            performWordAction(word);
        }
        ////////////////////////////
        /////// for testing ////////
        performWordAction(word);
        ////////////////////////////
        socketSend({event: 'said', body: term});
    }
    
    var commands = {};
    
    for(var i=0; i<words.length; i++) {

        var word = words[i].word;

        commands[word] = word_matched;
    }
    
    // Add word commands to annyang
    annyang.addCommands(commands);
}

function getWord(term) {
    for(var i=0; i<words.length; i++) {
        if(term == words[i].word){
            return words[i];
        }
    }
}

function performWordAction(word) {
    switch(word.action.type) {
    case "gifBomb":
        sendGifBomb(word.action.gifName);
    break;
    case "addPoints":
        addPoints(word.action.numPoints);
    break;
    }
}

// multiplayer socket.io shit

function socketSend(message){
    socket.emit('message', message);
}

socket.on('message', function(message){
    switch(message.event) {
    case "said":
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
    /*var numPlayers = 3;
    for(var i=0; i<numPlayers; i++) {
        
    }*/
}

function targetInCrosshairs(target) {
    crosshairsTarget = target;
}

function nothingInCrosshairs() {
    crosshairsTarget = "";
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

function addPoints(numPts) {
    numPoints += numPts;
    alert("add " + numPoints + " points!");
    // update ui
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
