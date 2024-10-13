const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const newG = require('./globby').newIOServer;
const delayStartBlocker = require('./blockers').delayStartBlocker


app.use('/static', express.static('public'))
app.use('/assets', express.static('fe/dist/assets'))
newG({
    baseState: {
        //Starting State
    },
    moveFunction: function (player, move, state) {
        //State Change on Move
        state[player.ref].x += 25;
    },
    minPlayers: 2,
    maxPlayers: 3, // Number of Players you want in a single game
    timeFunction: function (state) {
        state.test += 5;
        //State Change on every frame
    },
    startBlockerFunction: delayStartBlocker.startBlockerFunction(1000),
    joinBlockerFunction: delayStartBlocker.joinBlockerFunction,
    statePresenter: function (state, playerRef) {

        return state;
    },
    connectFunction: function (state, playerRef) {
        state[playerRef] = {
            x: 50,
            y: 50
        }
    },
    disconnectFunction: function (state, playerRef) {
        state[playerRef] = undefined;
    }
},
    io,
    false,
    {
        joinBotFunction: function (game, minPlayers, maxPlayers) {
            if (game.players.length < 3 && game.players.length > 1) {
                // game.joinBot('tralala')
            }
        },
        botAIFunction: function (game, bot) {
            game.move(bot.socketId, '')
        }
    })


app.get('/', function (req, res) {
    return res.status(200).sendFile(__dirname + '/fe/dist/index.html');
});


http.listen(3005, function () {
    console.log('listening on *:3000');
});