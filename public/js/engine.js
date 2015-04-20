
var socket = io();

var playerAvatars = [
    {name:"Alien", src:"images/avatar-alien.png"},
    {name:"Ballmer", src:"images/avatar-ballmer.png"},
    {name:"Beiber", src:"images/avatar-beiber.png"},
    {name:"Betty", src:"images/avatar-betty.png"},
    {name:"Busey", src:"images/avatar-busey.png"},
    {name:"Georgio", src:"images/avatar-georgio.png"},
    {name:"Hillary", src:"images/avatar-hillary.png"},
    {name:"Kramer", src:"images/avatar-kramer.png"},
    {name:"Michael", src:"images/avatar-michael.png"},
    {name:"Mimi", src:"images/avatar-mimi.png"},
    {name:"Oh My", src:"images/avatar-ohmy.png"},
    {name:"Old Man", src:"images/avatar-oldman.png"},
    {name:"Oprah", src:"images/avatar-oprah.png"},
    {name:"Peter", src:"images/avatar-peter.png"},
    {name:"Trump", src:"images/avatar-trump.png"}
];

var words = [
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
    {word:"thong", action:{type:"addPoints", numPoints: 3}},
    {word:"silly", action:{type:"addPoints", numPoints: 5}},
    {word:"spank", action:{type:"addPoints", numPoints: 2}}
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

var players = [];

var colors = [
    {name:"pink", hex:""},
    {name:"green", hex:""},
    {name:"blue", hex:""},
    {name:"purple", hex:""},
    {name:"yellow", hex:""}
];

var crosshairsTarget = "";
var collectedGifBombs = [];
var currentPlayerTarget = null;
var playerScore = 0;
var requestingPlayers;
var playerId;
var playerRequestTimeout;
var me;

init();

function init() {
    start_voice();
    /*
    name: request.name,
                score: request.score,
                rank: request.rank,
                scoreboardAvatar: request.scoreboardAvatar,
                worldAvatar: request.worldAvatar
    */
    
    /*
    $.ajax({
        url: "/api/players/addPlayer",
        method: "POST",
        data: {
            name: "Bill",
            score: 10,
            rank: 1,
            avatar: "images/avatar-peter.png",
        },
        success: function(data){
            alert(JSON.stringify(data));
        }
    });
    */
    getPlayersInGame();
}

function getPlayersInGame() {
    requestingPlayers = true;
    playerId = Math.random();
    socketSend({event: 'playerRequest', body:{playerId: playerId}});
    playerRequestTimeout = setTimeout(function(){
        requestingPlayers = false;
        setMyPlayer();
    }, 2000);
}

function addNewPlayerToList(player) {
    players.push(player);
    addPlayerToScoreboard(player);
    updateScoreboard();
}

function addRequestedPlayerToList(player) {
    players.push(player);
    addPlayerToScoreboard(player);
    
    clearTimeout(playerRequestTimeout);
    playerRequestTimeout = setTimeout(function(){
        requestingPlayers = false;
        setMyPlayer();
    }, 800);
    updateScoreboard();
}

function setMyPlayer() {
    pickRandomAvatarAndCheck();
    
    function pickRandomAvatarAndCheck() {
        var randomIndex = Math.floor(Math.random() * playerAvatars.length);
        for(var i=0; i<players.length; i++) {
            if(players[i].name == playerAvatars[randomIndex]){
                pickRandomNameAndCheck();
                return;
            }
        }
        addMyselfToPlayers(playerAvatars[randomIndex]);
    }
}

function addMyselfToPlayers(randAvatar) {
    me = {name:randAvatar.name, avatar:randAvatar.src, score:0, rank:players.length}
    players.push(me);
    socketSend({event: 'newPlayer', body:{
        name: me.name,
        avatar: me.avatar,
        score: me.score,
        rank: me.rank
    }});
    
    addPlayerToScoreboard(me);
    
    var $meInScoreboard = getPlayerInScoreboardByName(me.name);
    $meInScoreboard.css({
        backgroundColor: "rgba(0, 255, 0, .4)"
    });
    updateScoreboard(true);
}

function start_voice() {
    // voice recognition
    annyang.start({ autoRestart: true });
    
    // show speech debug
    // annyang.debug();
    
    var word_matched = function(term) {
        
        console.log('I said:', term);
        
        var word = getWord(term);
        
        if(word && word.particle.box.intersected) {
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
                setScore("add", me.name, word.action.numPoints);
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
    case "playerRequest":
        if(!requestingPlayers) {
            socketSend({event: 'playerInfo', body:{
                name: me.name,
                avatar: me.avatar,
                score: me.score,
                rank: me.rank,
                playerId: message.body.playerId
            }});
        }
    break;
    case "playerInfo":
        if(requestingPlayers) {
            if(playerId == message.body.playerId){
                var player = {
                    name: message.body.name,
                    avatar: message.body.avatar,
                    score: message.body.score,
                    rank: message.body.rank
                }
                addRequestedPlayerToList(player);
            }
        }
    break;
    case "newPlayer":
        if(message.body.name != me.name){
            var player = {
                name: message.body.name,
                avatar: message.body.avatar,
                score: message.body.score,
                rank: message.body.rank
            }
            addNewPlayerToList(player);
        }
    break;
    case "said":
        console.log("word received thru socket: " + message.body);
    break;
    case "setPlayer":
        me = getPlayerByName(message.body);
    break;
    case "playerScoreUpdate":
        setScore(message.body.method, message.body.playerName, message.body.score);
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

// ui functions

function setScore(method, playerName, num) {
    var player = getPlayerByName(playerName);
    if(method == "add"){
        player.score += num
    } else if(method == "subtract"){
        player.score -= num
    }
    
    if(player == me) {
        socketSend({event: "playerScoreUpdate", body: {method: method, playerName: me.name, score: me.score}});
    }
    
    updateScoreboard();
}

function addPlayerToScoreboard(player) {
    $("#scoreboard").append("<div class='scoreboardPlayer'>"
                            +"<img class='scoreboardPlayerAvatar' src='"+ player.avatar +"'/>"
                            +"<div class='scoreboardPlayerName'>"+ player.name +"</div>"
                            +"<div class='scoreboardPlayerScore'>0</div>"
                            +"</div>"
                           )
}

function updateScoreboard(appStart) {
    for(var i=0; i<players.length; i++) {
        var $playerScoreInScoreboard = getPlayerScoreElementInScoreboardByName(players[i].name);
        if($playerScoreInScoreboard){
            if(parseInt($playerScoreInScoreboard.html()) != players[i].score){
                $playerScoreInScoreboard.html(players[i].score);
            }
        }
    }
    
    var flagAnimateUpdateScoreboard = false;
    var playerRankingsBeforeSorting = players.slice(0);
    
    players.sort(function(player1, player2) {
        // Ascending: first score less than the previous
        return player2.score - player1.score;
    });
    
    for(var i=0; i<players.length; i++) {
        players[i].rank = (i+1);
    }
    
    if(playerRankingsBeforeSorting != players) {
        flagAnimateUpdateScoreboard = true;
    }
    
    // alert(JSON.stringify(players));
    
    if(typeof appStart == "undefined"){
        appStart = false;
    }
    if(flagAnimateUpdateScoreboard || appStart) {
        for(var i=0; i<players.length; i++) {
            ///// alert($("#scoreboard").children().eq(i));
            var singlePlayerHeight = $("#scoreboard").children().eq(0).height() + 10; // +10 for padding
            getPlayerInScoreboardByName(players[i].name).animate({
                top: (singlePlayerHeight * i - 1)
            }, 500);
        }
    }
}

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

///////////////////////
// util functions
///////////////////////

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
