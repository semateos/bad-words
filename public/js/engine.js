
var socket = io();

var words = [
    

    
    // teleport
    
    {word:"teleport"}, // gets caught in word_matched
    
    // bombs
    
    {word:"awesome", action:{type:"gifBomb", gifName:"awesome"}},
    {word:"balloon", action:{type:"gifBomb", gifName:"balloon"}},
    {word:"banana", action:{type:"gifBomb", gifName:"banana"}},
    {word:"butter", action:{type:"gifBomb", gifName:"butter"}},
    {word:"button", action:{type:"gifBomb", gifName:"button"}},
    {word:"cookies", action:{type:"gifBomb", gifName:"cookies"}},
    {word:"keyboard", action:{type:"gifBomb", gifName:"keyboard"}},
    {word:"llama", action:{type:"gifBomb", gifName:"llama"}},
    {word:"sneeze", action:{type:"gifBomb", gifName:"sneeze"}},
    {word:"umbrella", action:{type:"gifBomb", gifName:"umbrella"}},
    
    // point words
    //{word:"supercalifragilisticexpialidocious", action:{type:"addPoints", numPoints: 34}},
    {word:"caboodle", action:{type:"addPoints", numPoints: 8}},
    {word:"banana", action:{type:"addPoints", numPoints: 6}},
    {word:"epiglottis", action:{type:"addPoints", numPoints: 10}},
    {word:"bumfuzzle", action:{type:"addPoints", numPoints: 9}},
    {word:"collywobbles", action:{type:"addPoints", numPoints: 12}},
    {word:"Goomba", action:{type:"addPoints", numPoints: 6}},
    {word:"Bumbershoot", action:{type:"addPoints", numPoints: 11}},
    {word:"monkey", action:{type:"addPoints", numPoints: 6}},
    {word:"nincompoop", action:{type:"addPoints", numPoints: 10}},
    {word:"stinkpot", action:{type:"addPoints", numPoints: 8}},
    {word:"kazoo", action:{type:"addPoints", numPoints: 5}},
    {word:"squabble", action:{type:"addPoints", numPoints: 8}},
    {word:"crusty", action:{type:"addPoints", numPoints: 6}},
    {word:"toejam", action:{type:"addPoints", numPoints: 6}},
    {word:"lollygag", action:{type:"addPoints", numPoints: 8}},
    {word:"slurpee", action:{type:"addPoints", numPoints: 7}},
    {word:"bloated", action:{type:"addPoints", numPoints: 7}},
    {word:"dongle", action:{type:"addPoints", numPoints: 6}},
    {word:"giblets", action:{type:"addPoints", numPoints: 7}},
    {word:"orangutan", action:{type:"addPoints", numPoints: 9}},
    {word:"nugget", action:{type:"addPoints", numPoints: 6}},
    {word:"persnickety", action:{type:"addPoints", numPoints: 11}},
    {word:"pipsqueak", action:{type:"addPoints", numPoints: 9}},
    {word:"shenanigans", action:{type:"addPoints", numPoints: 11}},
    {word:"supercilious", action:{type:"addPoints", numPoints: 12}},
    {word:"Zamboni", action:{type:"addPoints", numPoints: 7}},
    {word:"guacamole", action:{type:"addPoints", numPoints: 9}},
    {word:"dangler", action:{type:"addPoints", numPoints: 7}},
    {word:"snickerdoodle", action:{type:"addPoints", numPoints: 13}},
    {word:"fart", action:{type:"addPoints", numPoints: 4}},
    {word:"cheese", action:{type:"addPoints", numPoints: 6}},
    {word:"stinkbomb", action:{type:"addPoints", numPoints: 9}},
    {word:"bunion", action:{type:"addPoints", numPoints: 6}},
    {word:"bladder", action:{type:"addPoints", numPoints: 7}},
    {word:"ukulele", action:{type:"addPoints", numPoints: 7}},
    {word:"greasy", action:{type:"addPoints", numPoints: 6}},
    {word:"stanky", action:{type:"addPoints", numPoints: 6}},
    {word:"Narwhal", action:{type:"addPoints", numPoints: 7}},
    {word:"slimy", action:{type:"addPoints", numPoints: 5}},
    {word:"sourpuss", action:{type:"addPoints", numPoints: 8}}
];

var gifBombs = [
    {name:"awesome", src:"images/awesome.gif"},
    {name:"balloon", src:"images/balloon.gif"},
    {name:"banana", src:"images/banana.gif"},
    {name:"butter", src:"images/butter.gif"},
    {name:"button", src:"images/button.gif"},
    {name:"cookies", src:"images/cookies.gif"},
    {name:"keyboard", src:"images/keyboard.gif"},
    {name:"llama", src:"images/llama.gif"},
    {name:"sneeze", src:"images/sneeze.gif"},
    {name:"umbrella", src:"images/umbrella.gif"}
];

var colors = [
    {name:"pink", hex:""},
    {name:"green", hex:""},
    {name:"blue", hex:""},
    {name:"purple", hex:""},
    {name:"yellow", hex:""}
];

var crosshairsTarget = "";
var collectedGifBombs = [];
var isNewPlayer = true;
var currentPlayersDbList = [];
var me;

start_voice();

function start_voice() {
    // voice recognition
    annyang.start({ autoRestart: true });
    
    // show speech debug
    // annyang.debug();
    
    var word_matched = function(term) {
        
        console.log('I said:', term);
        
        var word = getWord(term);
        
        if(word && word == "teleport") {

            teleport();
        }
        
        if(word && word.particle.box.intersected) {

            word.particle.explode = 300;

            socketSend({event: 'explode', body: term});

            performWordAction(word);
        }
        
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

function showTitleScreen() {
    
}

function showTitleScreenVR() {
    
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
                updateScore(me.name, parseInt(me.score + word.action.numPoints));
            break;
        }
    }
}

function teleport() {
    me.positionX = Math.random() * 200 - 100;
    me.positionY = Math.random() * 200 - 100;
    me.positionZ = Math.random() * 200 - 100;
    socketSend({event: "playerPositionUpdate", player: me});
}

// multiplayer socket.io shit

function socketSend(message){
    socket.emit('message', message);
}

socket.on('message', function(message){
    switch(message.event) {
    case 'welcomeMessage':
        console.log('welcome '+ message.player.name + '!', message.player);
        addMyself(message.player);
    break;
    case 'players':
        currentPlayersDbList = message.players;
        console.log('player list update', message.players);
        updatePlayers(currentPlayersDbList);
    break;
    case 'playerPositionUpdate':
        console.log('player position update', message.player);
        updatePlayerPosition(message.player);
    break;
    case "said":
        console.log("word received thru socket: " + message.body);
    break;
    case "playerScoreUpdate":
        updateScore(message.body.playerName, message.body.score);
    break;
    case "removeCommand":
        removeCommand(message.command); // would be a commandName
    break;
    case "gifBomb":
        if(message.body.target == "all") {
            receiveGifBomb(message.body.gifName, message.body.fromPlayer); // would be a gifName
        } else {
            if (me.name == message.body.target){
                receiveGifBomb(message.body.gifName, message.body.fromPlayer); // would be a gifName
            }
        }
    break;
    }
});

// ui functions

function addMyself(myPlayer) {
    me = myPlayer;
    addPlayerToGame(me);
    teleport();
    var $meInScoreboard = getPlayerInScoreboardByName(me.name);
    $meInScoreboard.css({
        backgroundColor: "rgba(0, 255, 0, .4)"
    });
    updateScoreboardRankings();
}

function updatePlayerPosition(player) {
    console.log("player position update: " + player);
    if(player.name != me.name) {
        camera.position.set(player.positionX, player.positionY, player.positionZ);
    } else {
        updatePlayerAvatarPosition(player);
    }
}

function updatePlayers(playersDbList) {
    for(var i=0; i<playersDbList.length; i++) {
        if(!getPlayerInScoreboardByName(playersDbList[i].name)) {
            addPlayerToGame(playersDbList[i]);
        }
    }
    
    var numScoreboardChildren = $("#scoreboard").children().length;
    if(numScoreboardChildren > playersDbList.length) {
        for(var i=0; i<numScoreboardChildren; i++) {
            var $scoreboardElement = $("#scoreboard").children().eq(i);
            var scoreboardName = $scoreboardElement.find(".scoreboardPlayerName").html();
            var nameInDb = false;
            for(var j=0; j<playersDbList.length; j++) {
                if(playersDbList[j].name == scoreboardName){
                    nameInDb = true;
                }
            }
            if(!nameInDb) {
                removePlayerFromGame(scoreboardName, $scoreboardElement);
            }
        }
    }
    
    updateScoreboardRankings();
}

function addPlayerToGame(player) {
    $("#scoreboard").append("<div data-rank='"+ player.rank +"' class='scoreboardPlayer'>"
                            +"<img class='scoreboardPlayerAvatar' src='"+ player.avatar +"'/>"
                            +"<div class='scoreboardPlayerName'>"+ player.name +"</div>"
                            +"<div class='scoreboardPlayerScore'>"+ player.score +"</div>"
                            +"</div>"
                           )
    if(player.name != me.name) {
        addPlayerAvatarToCanvas(player);
    }
}

function removePlayerFromGame(playerName, $scoreboardElement) {
    $scoreboardElement.remove();
    removePlayerAvatarFromCanvas(playerName);
}

function updateScoreboardRankings() {
    var flagAnimateUpdateScoreboard = false;
    var playersInScoreboard = [];
    var numPlayersInScoreboard = $("#scoreboard").children().length;
    
    for(var i=0; i<numPlayersInScoreboard; i++) {
        var elem = $("#scoreboard").children().eq(i);
        playersInScoreboard.push({
            element: elem,
            score: $("#scoreboard").children().eq(i).find(".scoreboardPlayerScore").html(),
            rank: elem.attr("data-rank")
        });
    }
    
    playersInScoreboard.sort(function(player1, player2) {
        // Ascending: first score less than the previous
        return player2.score - player1.score;
    });
    
    for(var i=0; i<playersInScoreboard.length; i++) {
        playersInScoreboard[i].element.attr("data-rank", (i+1));
    }
    
    for(var i=0; i<playersInScoreboard.length; i++) {
        var singlePlayerHeight = $("#scoreboard").children().eq(0).height() + 10; // +10 for padding
        playersInScoreboard[i].element.animate({
            top: (singlePlayerHeight * i - 1)
        }, 500);
    }
}

// game functions

function updateScore(playerName, newScore) {
    if(playerName == me.name) {
        me.score = newScore;
        socketSend({event: "playerScoreUpdate", body: {playerName: me.name, score: newScore}});
    }
    var $playerScoreElem = getPlayerScoreElementInScoreboardByName(playerName);
    $playerScoreElem.html(newScore);
    updateScoreboardRankings();
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
    
    socketSend({event: 'gifBomb', body: {target: target, gifName: gifName}});
    console.log("sent Gif Bomb: " + gifName + " to " + target + "!!!");
    updateScore("add", me.name, me.score+3);
    return;
    
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

// util functions

function getPlayerInDbListByName(playerName) {
    for(var i=0; i<currentPlayersDbList.length; i++) {
        if(playerName == currentPlayersDbList[i].name) {
            return currentPlayersDbList[i];
        }
    }
    return 0;
}

function getGifBombByName(gifName) {
    for(var i=0; i<gifBombs.length; i++) {
        if(gifName == gifBombs[i].name) {
            return gifBombs[i];
        }
    }
}

function getPlayerScoreElementInScoreboardByName(playerName) {
    for(var i=0; i<$("#scoreboard").children().length; i++) {
        var childAtIndex = $("#scoreboard").children().eq(i);
        if(playerName == childAtIndex.find(".scoreboardPlayerName").html()) {
            return childAtIndex.find(".scoreboardPlayerScore");
        }
    }
}

function getPlayerInScoreboardByName(playerName) {
    for(var i=0; i<$("#scoreboard").children().length; i++) {
        var childAtIndex = $("#scoreboard").children().eq(i);
        if(playerName == childAtIndex.find(".scoreboardPlayerName").html()) {
            return childAtIndex;
        }
    }
    return 0;
}

function removeCommand(commandWord) {
    annyang.removeCommands(commandWord);
}

function addCommand(commandWord, action) {
    annyang.addCommands({commandWord: action});
}
