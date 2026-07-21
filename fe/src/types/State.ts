import type { CardType } from "./Card"
import type { modeType } from "./mode"

export type stateType = {
    me?:player,
    currentBettingStep:number,
    tie:{taken:CardType[]},
    board?:Board,
    turn:turn,
    mode:modeType,
    lastBattleWinner: turn,
    tempMode: modeType,
    koeficient: {
        mode:modeType,
        value:number,
        better:turn
    },
    battleHistory: BattleHistoryTrick[],
    meRef:turn,
    enemyScore:number,
    enemyTaken:number,
    enemyHandSize:number,
    enemyReady?:boolean,
    message?:string,
    bigGameCards?:CardType[]
}

export type turn = 'player1' | 'player2' | null

export type player = {
    hand:CardType[],
    taken:CardType[],
    score:number,
    ready?:boolean
}

export type Board = {
    player1:CardType,
    player2:CardType,
    winnerCard:CardType,
    lastTrick?: {
        player1:CardType,
        player2:CardType,
        winnerCard:CardType,
        winnerRef?: turn | 'tie'
    },
    publicDeck:CardType[]
}

export type BattleHistoryTrick = {
    player1: CardType,
    player2: CardType,
    winnerCard: CardType,
    winnerRef?: turn | 'tie'
}