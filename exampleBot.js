const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const newG = require('./globby').newIOServer;
const delayStartBlocker = require('./blockers').delayStartBlocker
const {battle,special, drawCard,playCard,bet, checkIfMyTurn, checkForBattle, cleanBoard, isRoundFinished, countRoundAndClean, giveStartingCards, oppositePlayer} = require('./helperMethods.js')
const cardsObj = require('./cards.js')

app.use('/static', express.static('public'))
app.use('/assets', express.static('fe/dist/assets'))

const ANIMATE_COUNTER = 50;
const ANIMATE_SPECIAL_COUNTER = 15;

/*
Effect - {
effect:funk,
name:String,
descr:String,
priority:Number,
}

Move while betting - {
  Mode: Strength, Agility, Intelligence,
  Bet: 1|2|3|4|5
 }
 Move while playing - {
 cardIndex:number
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
const genericSpecial = 'genericSpecial'

const cards = Object.values(cardsObj)

const moveFunction = function (player, move, state) {
    if (state.mode === 'readyCheck') {
        if (move.ready) {
            state[player.ref].ready = true;
            if (state.player1.ready && state.player2.ready) {
                state.mode = 'betting';
                state.turn = 'player1';
            }
        }
        return;
    }

    // Check if it's the player's turn
    if (!checkIfMyTurn(player.ref, state.turn)) {
        return;
    }

    // Handle betting phase
    if (state.mode === 'betting') {
        handleBettingPhase(player, move, state);
        return;
    }

    // Handle playing phase
    handlePlayingPhase(player, move, state);
};

const handleBettingPhase = function (player, move, state) {
    if (!move.mode && !move.giveUp) {
        return;
    }

    const theBet = bet(player.ref, move, state);
    if (theBet !== 'betting') {
        state.mode = theBet;
        state.tempMode = null;
    }

    if (move.mode || move.giveUp) {
        state.turn = state.koeficient.value < 5 ? oppositePlayer(player.ref) : player.ref;
    }
};

const handlePlayingPhase = function (player, move, state) {
    if (!playCard(state[player.ref], player.ref, move.cardIndex, state.board)) {
        return;
    }

    // Set turn after one player played card
    state.turn = oppositePlayer(player.ref);

    drawCard(state[player.ref], state.board.publicDeck);

    if (!checkForBattle(state.board)) {
        return;
    }

    special(oppositePlayer(player.ref), player.ref, state);
    special(player.ref, oppositePlayer(player.ref), state);

    const winner = battle(state);
    const prevBattleWinner = state.lastBattleWinner;
    state.lastBattleWinner = winner;

    // Set turn after battle
    if (winner === "tie" && prevBattleWinner && prevBattleWinner !== "tie") {
        state.turn = prevBattleWinner;
    } else if (winner === "tie") {
        state.turn = "player1";
    } else {
        state.turn = winner;
    }
};

newG({
    baseState: {
        player1: {
            hand:[],
            taken:[],
            score:0
        },
        player2: {
            hand: [],
            taken: [],
            score:0
        },
        currentBettingStep:1,
        tie: {
            taken:[]
        },
        board: {
            player1: null,
            player2: null,
            winnerCard: null,
            lastTrick: null,
            publicDeck: cards
        },
        battleHistory: [],
        turn: 'player1',
        mode:'betting',
        lastBattleWinner: null,
        tempMode:null,  
        koeficient:null, //{value:1,better:'player1'},
        roundEndTimer: null,
    },
    moveFunction: moveFunction,
    minPlayers: 2,
    maxPlayers: 2, // Number of Players you want in a single game
    timeFunction: function (state) {
        if (!state.bigGameCards) {
            const shuffled = [...cards].sort(() => Math.random() - 0.5);
            state.bigGameCards = shuffled.slice(0, 16);
            state.board.publicDeck = JSON.parse(JSON.stringify(state.bigGameCards));
            state.mode = 'readyCheck';
            state.player1.ready = false;
            state.player2.ready = false;
            return;
        }

        if(state.mode === 'readyCheck'){
            return;
        }

        if(state.mode === 'betting'){
            if(state.player1.hand.length === 0){
                giveStartingCards(state)
            }
            return
        }

        if(state.board.player1 && state.board.player2){
            //Prepare for next turn
            cleanBoard(state.board, state[state.lastBattleWinner], state)
        }
        
        if(isRoundFinished(state.player1.hand, state.player2.hand)){
            if (!state.roundEndTimer) {
                state.roundEndTimer = Date.now() + 3000;
            } else if (Date.now() >= state.roundEndTimer) {
                countRoundAndClean(state)
                giveStartingCards(state)
                state.roundEndTimer = null;
            }
            return
        }
        //State Change on every frame
    },
    startBlockerFunction: delayStartBlocker.startBlockerFunction(1000),
    joinBlockerFunction: delayStartBlocker.joinBlockerFunction,
    statePresenter: function (state, playerRef) {
        const toReturn = {...state};
        toReturn[oppositePlayer(playerRef)] = ''
        toReturn.me = state[playerRef]
        toReturn.meRef = playerRef
        toReturn.enemyScore = state[oppositePlayer(playerRef)].score
        toReturn.enemyTaken = state[oppositePlayer(playerRef)].taken.length
        toReturn.enemyHandSize = state[oppositePlayer(playerRef)].hand.length
        toReturn.enemyReady = state[oppositePlayer(playerRef)].ready
        return toReturn;
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
        if (game.players.length === 1) {
            if (!game.createdTime) {
                game.createdTime = Date.now();
            }
            if (Date.now() - game.createdTime > 30000) {
                game.joinBot(Math.random().toString().substr(2, 6));
                game.createdTime = null; // reset to avoid multiple bots
            }
        } else {
            game.createdTime = null;
        }
    },
    botAIFunction: function (game, bot) {
        if (bot.lastMoveTime && Date.now() - bot.lastMoveTime < 1500) {
            return;
        }

        const state = game.returnState(bot.socketId);
        if (!state || state.message) return; // Blocker message

        if (state.mode === 'readyCheck') {
            if (state.me && !state.me.ready) {
                bot.lastMoveTime = Date.now();
                game.move(bot.socketId, { ready: true });
            }
            return;
        }

        if (state.meRef !== state.turn) {
            return;
        }

        bot.lastMoveTime = Date.now();

        if (state.mode === 'betting') {
            let str = 0, agi = 0, int = 0;
            if (state.me && state.me.hand && state.me.hand.length > 0) {
                state.me.hand.forEach(c => {
                    str += c.strength;
                    agi += c.agility;
                    int += c.intelligence;
                });
                const best = Math.max(str, agi, int);
                let selectedMode = 'strength';
                if (best === agi) selectedMode = 'agility';
                if (best === int) selectedMode = 'intelligence';

                // If the player just bet on the same mode we want, we MUST give up instead of betting the exact same thing
                if (state.tempMode === selectedMode) {
                    game.move(bot.socketId, { giveUp: true });
                } else if (state.tempMode && state.currentBettingStep > 3) {
                    game.move(bot.socketId, { giveUp: true });
                } else {
                    game.move(bot.socketId, { mode: selectedMode });
                }
            } else {
                game.move(bot.socketId, { giveUp: true });
            }
            return;
        }

        // Playing phase
        if (state.me && state.me.hand && state.me.hand.length > 0) {
            let bestIndex = 0;
            
            const enemyRef = state.meRef === 'player1' ? 'player2' : 'player1';
            const enemyCard = state.board && state.board[enemyRef];
            
            if (enemyCard) {
                // GOING SECOND
                let winIndex = -1;
                let winModeVal = Infinity;
                let winTotalStats = Infinity;

                let tieIndex = -1;
                let tieTotalStats = Infinity;

                let loseIndex = -1;
                let loseModeVal = Infinity;
                let loseTotalStats = Infinity;

                state.me.hand.forEach((card, index) => {
                    const testState = JSON.parse(JSON.stringify(state));
                    const myRef = testState.meRef;
                    
                    testState[enemyRef] = {
                        hand: new Array(testState.enemyHandSize || 0).fill(null),
                        taken: new Array(testState.enemyTaken || 0).fill(null)
                    };
                    testState[myRef] = testState.me;

                    testState.board[myRef] = testState.me.hand[index];
                    testState.me.hand.splice(index, 1);

                    try { special(enemyRef, myRef, testState); } catch(e) {}
                    try { special(myRef, enemyRef, testState); } catch(e) {}

                    let winner = 'tie';
                    try { winner = battle(testState); } catch(e) {}

                    let origModeVal = card[state.mode];
                    let origTotalStats = card.strength + card.agility + card.intelligence;

                    if (winner === myRef) {
                        if (origModeVal < winModeVal || (origModeVal === winModeVal && origTotalStats < winTotalStats)) {
                            winModeVal = origModeVal;
                            winTotalStats = origTotalStats;
                            winIndex = index;
                        }
                    } else if (winner === 'tie') {
                        if (origTotalStats < tieTotalStats) {
                            tieTotalStats = origTotalStats;
                            tieIndex = index;
                        }
                    } else {
                        if (origModeVal < loseModeVal || (origModeVal === loseModeVal && origTotalStats < loseTotalStats)) {
                            loseModeVal = origModeVal;
                            loseTotalStats = origTotalStats;
                            loseIndex = index;
                        }
                    }
                });

                if (winIndex !== -1) {
                    bestIndex = winIndex;
                } else if (tieIndex !== -1) {
                    bestIndex = tieIndex;
                } else {
                    bestIndex = loseIndex;
                }
            } else {
                // GOING FIRST
                let bestModeVal = -1;
                let bestTotalStats = Infinity;
                let bestIdx = 0;

                let worstModeVal = Infinity;
                let worstTotalStats = Infinity;
                let worstIdx = 0;

                let guaranteedWinIndex = -1;
                let guaranteedWinModeVal = Infinity;

                let unseenCards = [];
                if (state.bigGameCards) {
                    const knownCardTitles = new Set();
                    state.me.hand.forEach(c => knownCardTitles.add(c.cardTitle));
                    if (state.battleHistory) {
                        state.battleHistory.forEach(trick => {
                            if (trick.player1) knownCardTitles.add(trick.player1.cardTitle);
                            if (trick.player2) knownCardTitles.add(trick.player2.cardTitle);
                        });
                    }
                    
                    state.bigGameCards.forEach(c => {
                        if (!knownCardTitles.has(c.cardTitle)) {
                            unseenCards.push(c);
                        }
                    });
                }

                state.me.hand.forEach((card, index) => {
                    let origModeVal = card[state.mode];
                    let origTotalStats = card.strength + card.agility + card.intelligence;

                    if (origModeVal > bestModeVal || (origModeVal === bestModeVal && origTotalStats < bestTotalStats)) {
                        bestModeVal = origModeVal;
                        bestTotalStats = origTotalStats;
                        bestIdx = index;
                    }

                    if (origModeVal < worstModeVal || (origModeVal === worstModeVal && origTotalStats < worstTotalStats)) {
                        worstModeVal = origModeVal;
                        worstTotalStats = origTotalStats;
                        worstIdx = index;
                    }

                    let guaranteesWin = true;
                    if (unseenCards.length > 0) {
                        for (let unseen of unseenCards) {
                            const testState = JSON.parse(JSON.stringify(state));
                            const myRef = testState.meRef;
                            
                            testState[enemyRef] = {
                                hand: new Array(testState.enemyHandSize || 0).fill(null),
                                taken: new Array(testState.enemyTaken || 0).fill(null)
                            };
                            testState[myRef] = testState.me;

                            testState.board[myRef] = testState.me.hand[index];
                            testState.me.hand.splice(index, 1);
                            
                            testState.board[enemyRef] = JSON.parse(JSON.stringify(unseen));

                            try { special(myRef, enemyRef, testState); } catch(e) {}
                            try { special(enemyRef, myRef, testState); } catch(e) {}

                            let winner = 'tie';
                            try { winner = battle(testState); } catch(e) {}

                            if (winner !== myRef) {
                                guaranteesWin = false;
                                break;
                            }
                        }
                    } else {
                        guaranteesWin = false;
                    }

                    if (guaranteesWin) {
                        if (origModeVal < guaranteedWinModeVal) {
                            guaranteedWinModeVal = origModeVal;
                            guaranteedWinIndex = index;
                        }
                    }
                });
                
                if (guaranteedWinIndex !== -1) {
                    bestIndex = guaranteedWinIndex;
                } else {
                    bestIndex = worstIdx;
                }
            }

            game.move(bot.socketId, { cardIndex: bestIndex });
        }
    }
})


app.get('/', function (req, res) {
    return res.status(200).sendFile(__dirname + '/fe/dist/index.html');
});


http.listen(3005, function () {
    console.log('listening on *:3000');
});