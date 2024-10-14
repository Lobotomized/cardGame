const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const newG = require('./globby').newIOServer;
const delayStartBlocker = require('./blockers').delayStartBlocker
const {test, checkIfMyTurn, checkForBattle, cleanBoard} = require('./helperMethods.js')


app.use('/static', express.static('public'))
app.use('/assets', express.static('fe/dist/assets'))

const ANIMATE_COUNTER = 50;

/*
Effect - {
effect:funk,
name:String,
descr:String,
priority:Number,
}

Move - {
}
 Card - {
 int:Number,
 str:Number,
 agi:Number,
 special:Effect,
 img:String
 }

 state - {
 player1: {
    hand:Card[],
    taken:Card[]
 },
 player2: {
    hand:Card[],
    taken:Card[]
 },
 board: {
    CardPlayer1:Card,
    CardPlayer2:Card,
    WinnerCard:Card,
    PublicDeck:Card[]
 },
 Turn:player1 | player2 | Animate,
 Mode: Intelligence, Strength, Agility, Betting
 AnimCounter: Number,
 LastBattleWinner: player1 | player2 | null
 }
*/

newG({
    baseState: {
        player1: {
            hand:[],
            taken:[]
        },
        player2: {
            hand: [],
            taken: []
        },
        board: {
            player1: null,
            player2: null,
            winnerCard: null,
            PublicDeck: []
        },
        turn: null,
        mode:null,
        animateCounter: 0,
        lastBattleWinner: null
    },
    moveFunction: function (player, move, state) {
        //State Change on Move
        if(!checkIfMyTurn(player.ref,state.turn)){
            return
        }
        if(!playCard(player.ref, move.cardIndex,state.board)){
            return
        }
        if(!checkForBattle(state.board)){
            return
        }
        const winner = battle(state.board)
        state.lastBattleWinner = winner;
        state.animateCounter = ANIMATE_COUNTER
        /*
            

            playCard

            checkForBattle
              if Battle
                winner = Battle()
                lastBattleWinner = winner;
              setAnimCounter(value)


        */
    },
    minPlayers: 2,
    maxPlayers: 2, // Number of Players you want in a single game
    timeFunction: function (state) {
        if(state.animateCounter){
            state.animateCounter--;
            return;
        }
        cleanBoard(state.board)

        //State Change on every frame
    },
    startBlockerFunction: delayStartBlocker.startBlockerFunction(1000),
    joinBlockerFunction: delayStartBlocker.joinBlockerFunction,
    statePresenter: function (state, playerRef) {

        return state;
    },
    // connectFunction: function (state, playerRef) {

    // },
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
    console.log(test())
    return res.status(200).sendFile(__dirname + '/fe/dist/index.html');
});


http.listen(3005, function () {
    console.log('listening on *:3000');
});