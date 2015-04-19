
var socket = io();

var words = [
    {word:"supercalifragilisticexpialidocious", action:{type:"gifBomb", gifName:"doubleRainbow"}},
    {word:"penis", action:{type:"gifBomb", gifName:"bananaMan"}},
    {word:"nipple", action:{type:"gifBomb", gifName:"stimpyButton"}},
    {word:"shocker", action:{type:"gifBomb", gifName:"omgCat"}},
    {word:"dildo", action:{type:"gifBomb", gifName:"rickRoll"}},
    {word:"socket", action:{type:"gifBomb", gifName:"goodDay"}},
    {word:"pickle", action:{type:"gifBomb", gifName:"sloMoFace"}},
    {word:"stank", action:{type:"gifBomb", gifName:"recursiveSmiley"}},
    {word:"twat", action:{type:"gifBomb", gifName:"freeFoodDog"}},
    {word:"pussy", action:{type:"gifBomb", gifName:"keyboardCat"}},
    {word:"snatch", action:{type:"gifBomb", gifName:"ronaldSmack"}},
    {word:"skank", action:{type:"gifBomb", gifName:"trippyMan"}},
    {word:"thong", action:{type:"addPoints", numPoints: 3}},
    {word:"silly", action:{type:"addPoints", numPoints: 5}},
    {word:"spank", action:{type:"addPoints", numPoints: 2}}
];

var gifBombs = [
    {name:"bananaMan", src:"images/banana-man.gif"},
    {name:"doubleRainbow", src:"images/double-rainbow.jpg"},
    {name:"freeFoodDog", src:"images/free-food-dog.gif"},
    {name:"goodDay", src:"images/good-day.gif"},
    {name:"keyboardCat", src:"images/keyboard-cat.gif"},
    {name:"omgCat", src:"images/omg-cat.gif"},
    {name:"recursiveSmiley", src:"images/recursive-smiley.gif"},
    {name:"rickRoll", src:"images/rick-roll.gif"},
    {name:"ronaldSmack", src:"images/ronald-smack.gif"},
    {name:"sloMoFace", src:"images/slo-mo-face.gif"},
    {name:"stimpyButton", src:"images/stimpy-button.gif"},
    {name:"trippyMan", src:"images/trippy-man.gif"}
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

init();

function init() {
    start_voice();
}

function start_voice() {
    // voice recognition
    annyang.start({ autoRestart: true });
    
    // show speech debug
    // annyang.debug();
    
    var word_matched = function(term) {
        
        console.log('I said:', term);
        
        var word = getWord(term);
        
        if(word && word.particle.intersected) {
            performWordAction(word);
        }
        
        ////////////////////////////
        /////// For testing ////////
        // performWordAction(word);
        ////////////////////////
        socketSend({event: 'said', body: term});
    }
    
    var commands = {
        ':term' : word_matched
    };
    
    /*for(var i=0; i<words.length; i++) {

        var word = words[i].word;

        commands[word] = word_matched;
    }*/
    
    //commands[':term'] = word_matched;

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

    if(word){

        switch(word.action.type) {

            case "gifBomb":
                sendGifBomb(word.action.gifName, "all");
                break;

            case "addPoints":
                addPoints(word.action.numPoints);
                break;
        }
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
}

function sendGifBomb(gifName, target) {
    var gifBomb = getGifBombByName(gifName);
    
    /////////////////////////////
    ////// For testing //////////
    socketSend({event: 'gifBomb', body: {target: target, gifName: gifName}});
    console.log("sent Gif Bomb: " + gifName + " to " + target + "!!!");
    return;
    /////////////////////////////
    
    for(var i=0; i<collectedGifBombs.length; i++) {
        if(gifName == collectedGifBombs[i].name) {
            collectedGifBombs.splice(i, 1);
            socketSend({event: 'gifBomb', body: {target: target, gifName: gifName}});
            console.log("sent Gif Bomb: " + gifName + " to " + target + "!!!");
            return;
        }
    }
    console.log("you don't have the gifBomb '" + gifName + "'!");
}

function addPoints(numPts) {
    numPoints += numPts;
    alert("add " + numPts + " points!");
    // update ui
}

function receiveGifBomb(gifName, fromPlayer) {
    var gifBomb = getGifBombByName(gifName);
    document.getElementById("gifBomb").style.display = "block";
    document.getElementById("gifBomb").setAttribute("src", gifBomb.src);
    setTimeout(function(){
        document.getElementById("gifBomb").setAttribute("src", "");
        document.getElementById("gifBomb").style.display = "none";
    }, 9000);
    // ui display Gif fullscreen
    // also display who sent it
}

////////////////////////////
// util functions
function getGifBombByName(gifName) {
    for(var i=0; i<gifBombs.length; i++) {
        if(gifName == gifBombs[i].name) {
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
