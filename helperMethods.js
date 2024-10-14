module.exports = {
    cleanBoard:function(board){
        board.player1 = null;
        board.player2 = null;
        board.winnerCard = null;
    },
    oppositePlayer:function(player){
        if(player === 'player1'){
            return 'player2'
        }
        return 'player1';
    },
    //Return true if my turn and false if not
    checkIfMyTurn:function(me, turn){
        if(me === turn){
            return true;
        }
        return false;
    },
    //return false if no such card exists and true if it does
    playCard:function(player, cardIndex, board){
        const card = player.hand[cardIndex];
        if(!card){
            return false
        }
        board[player] = card;
        return true;
    },
    setTurn: function(board,lastBattleWinner){

        //Returns whos turn it is
        if(!board['player1'] && !board['player2']){
            return lastBattleWinner;
        }
        else if(board['player1']){
            return 'player2'
        }
        else if(board['player2']){
            return 'player1'
        }
        else{
            return 'Animate'
        }
    },
    //Return true if battle and false if not
    checkForBattle: function(board){
        if(!board.player1 || !board.player2){
            return false;
        }
        return true;
    },
    //Do the battle and return the player who won
    battle: function(state){
        return 'player1'
    }
}