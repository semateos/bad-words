
var socket = io();

var words = [
    // bombs
    {word:"teleport", action:{type:"teleport"}},
    {word:"supercalifragilisticexpialidocious", action:{type:"gifBomb", gifName:"bananaMan"}},
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
    {word:"thong", action:{type:"gifBomb", gifName:"freeFoodDog"}},
    {word:"silly", action:{type:"gifBomb", gifName:"trippyMan"}},
    {word:"spank", action:{type:"gifBomb", gifName:"stimpyButton"}},
    
    // point words
    {word:"caboodle", action:{type:"addPoints", numPoints: 5}},
    {word:"banana", action:{type:"addPoints", numPoints: 5}},
    {word:"epiglottis", action:{type:"addPoints", numPoints: 5}},
    {word:"bumfuzzle", action:{type:"addPoints", numPoints: 5}},
    {word:"collywobbles", action:{type:"addPoints", numPoints: 5}},
    {word:"goomba", action:{type:"addPoints", numPoints: 5}},
    {word:"bumbershoot", action:{type:"addPoints", numPoints: 5}},
    {word:"monkey", action:{type:"addPoints", numPoints: 5}},
    {word:"nincompoop", action:{type:"addPoints", numPoints: 5}},
    {word:"stinkpot", action:{type:"addPoints", numPoints: 5}},
    {word:"kazoo", action:{type:"addPoints", numPoints: 5}},
    {word:"squabble", action:{type:"addPoints", numPoints: 5}},
    {word:"crusty", action:{type:"addPoints", numPoints: 5}},
    {word:"toejam", action:{type:"addPoints", numPoints: 5}},
    {word:"lollygag", action:{type:"addPoints", numPoints: 5}},
    {word:"slurpee", action:{type:"addPoints", numPoints: 5}},
    {word:"bloated", action:{type:"addPoints", numPoints: 5}},
    {word:"dongle", action:{type:"addPoints", numPoints: 5}},
    {word:"giblets", action:{type:"addPoints", numPoints: 5}},
    {word:"orangutan", action:{type:"addPoints", numPoints: 5}},
    {word:"nugget", action:{type:"addPoints", numPoints: 5}},
    {word:"persnickety", action:{type:"addPoints", numPoints: 5}},
    {word:"pipsqueak", action:{type:"addPoints", numPoints: 5}},
    {word:"shenanigans", action:{type:"addPoints", numPoints: 5}},
    {word:"supercilious", action:{type:"addPoints", numPoints: 5}},
    {word:"Zamboni", action:{type:"addPoints", numPoints: 5}},
    {word:"schmutz", action:{type:"addPoints", numPoints: 5}},
    {word:"guacamole", action:{type:"addPoints", numPoints: 5}},
    {word:"dangler", action:{type:"addPoints", numPoints: 5}},
    {word:"snickerdoodle", action:{type:"addPoints", numPoints: 5}},
    {word:"fart", action:{type:"addPoints", numPoints: 5}},
    {word:"cheese", action:{type:"addPoints", numPoints: 5}},
    {word:"stinkbomb", action:{type:"addPoints", numPoints: 5}},
    {word:"bunion", action:{type:"addPoints", numPoints: 5}},
    {word:"bladder", action:{type:"addPoints", numPoints: 5}},
    {word:"ukulele", action:{type:"addPoints", numPoints: 5}},
    {word:"greasy", action:{type:"addPoints", numPoints: 5}},
    {word:"stanky", action:{type:"addPoints", numPoints: 20}},
    {word:"Narwhal", action:{type:"addPoints", numPoints: 5}},
    {word:"slimy", action:{type:"addPoints", numPoints: 5}},
    {word:"sourpuss", action:{type:"addPoints", numPoints: 5}}
];

var gifBombs = [
    {name:"bananaMan", src:"images/banana-man.gif"},
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
            case "teleport":
                teleport();
            break;
        }
    }
}

function teleport() {
    me.positionX = Math.random() * 500 - 250;
    me.positionY = Math.random() * 500 - 250;
    me.positionZ = Math.random() * 500 - 250;
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
        console.log('player list update', message.players);
        updatePlayers(message.players);
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
        
    }
    // updatePlayerAvatarPosition(player);
}

function updatePlayers(playerDbList) {
    for(var i=0; i<playerDbList.length; i++) {
        if(!getPlayerInScoreboardByName(playerDbList[i].name)) {
            addPlayerToGame(playerDbList[i]);
        }
    }
    
    var numScoreboardChildren = $("#scoreboard").children().length;
    if(numScoreboardChildren > playerDbList.length) {
        for(var i=0; i<numScoreboardChildren; i++) {
            var $scoreboardElement = $("#scoreboard").children().eq(i);
            var scoreboardName = $scoreboardElement.find(".scoreboardPlayerName").html();
            var nameInDb = false;
            for(var j=0; j<playerDbList.length; j++) {
                if(playerDbList[j].name == scoreboardName){
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
    // addPlayerAvatarToCanvas(player);
}

function removePlayerFromGame(playerName, $scoreboardElement) {
    $scoreboardElement.remove();
    // removePlayerAvatarFromCanvas(playerName);
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
