<script lang="ts">
    import Card from './Card.svelte';
    import type { Board, turn } from './types/State';
    import type { modeType } from './types/mode';

    export let board:Board;
    export let mode:modeType;
    export let meRef:turn;

    let animateState: 'idle' | 'clash' | 'resolve' = 'idle';
    let currentTrick: any = null;
    let animationTimer1: any;
    let animationTimer2: any;

    $: {
        if (board.lastTrick && JSON.stringify(currentTrick) !== JSON.stringify(board.lastTrick)) {
            currentTrick = board.lastTrick;
            animateState = 'clash';
            
            clearTimeout(animationTimer1);
            clearTimeout(animationTimer2);

            // Clash phase duration
            animationTimer1 = setTimeout(() => {
                animateState = 'resolve';
                
                // Resolve phase duration
                animationTimer2 = setTimeout(() => {
                    animateState = 'idle';
                }, 2000); 
            }, 600); 
        }
    }

    $: myCard = meRef === 'player1' ? board.player1 : board.player2;
    $: enemyCard = meRef === 'player1' ? board.player2 : board.player1;
    
    $: trickMyCard = meRef === 'player1' ? currentTrick?.player1 : currentTrick?.player2;
    $: trickEnemyCard = meRef === 'player1' ? currentTrick?.player2 : currentTrick?.player1;

    $: amIWinner = currentTrick?.winnerCard && JSON.stringify(trickMyCard) === JSON.stringify(currentTrick.winnerCard);
    $: isEnemyWinner = currentTrick?.winnerCard && JSON.stringify(trickEnemyCard) === JSON.stringify(currentTrick.winnerCard);
    $: isTie = currentTrick && !currentTrick.winnerCard;
    
    $: displayMyCard = animateState !== 'idle' ? trickMyCard : myCard;
    $: displayEnemyCard = animateState !== 'idle' ? trickEnemyCard : enemyCard;
</script>

<div class="board" class:is-animating={animateState !== 'idle'}>
    <div class="card-container me-container" 
         class:clash={animateState === 'clash'} 
         class:winner={animateState === 'resolve' && amIWinner} 
         class:loser={animateState === 'resolve' && isEnemyWinner}
         class:tie={animateState === 'resolve' && isTie}>
        {#if displayMyCard}
            <Card card={displayMyCard} mode={mode}></Card>
        {/if}
    </div>

    <div class="center-area">
        <div class="public-deck" class:fade-out={animateState !== 'idle'}>
            <div class="deck-card">
                <span class="deck-count">{board.publicDeck?.length || 0}</span>
                <span class="deck-label">CARDS</span>
            </div>
        </div>
    </div>

    <div class="card-container enemy-container" 
         class:clash={animateState === 'clash'} 
         class:winner={animateState === 'resolve' && isEnemyWinner} 
         class:loser={animateState === 'resolve' && amIWinner}
         class:tie={animateState === 'resolve' && isTie}>
        {#if displayEnemyCard}
            <Card card={displayEnemyCard} mode={mode}></Card>
        {/if}
    </div>
</div>

<style>
    .board {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        gap: 20px;
        height: 100%;
        width: 100%;
        overflow: hidden;
    }
    
    .center-area {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 40px;
        min-height: 400px;
        z-index: 5;
    }

    .card-container {
        display: flex;
        justify-content: center;
        min-height: 400px;
        min-width: 225px;
        transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
        z-index: 10;
    }

    /* --- CLASH PHASE --- */
    .me-container.clash {
        transform: translateX(120px) scale(1.1) rotate(5deg);
        z-index: 20;
        filter: drop-shadow(0 0 20px rgba(255, 0, 0, 0.6));
    }

    .enemy-container.clash {
        transform: translateX(-120px) scale(1.1) rotate(-5deg);
        z-index: 20;
        filter: drop-shadow(0 0 20px rgba(255, 0, 0, 0.6));
    }

    /* --- RESOLVE PHASE --- */
    .me-container.winner {
        transform: translateX(60px) scale(1.2);
        z-index: 30;
        filter: drop-shadow(0 0 40px rgba(255, 50, 50, 0.9)) drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
        transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .enemy-container.winner {
        transform: translateX(-60px) scale(1.2);
        z-index: 30;
        filter: drop-shadow(0 0 40px rgba(255, 50, 50, 0.9)) drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
        transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .me-container.loser {
        transform: translateX(120px) scale(0.6) translateY(50px) rotate(-15deg);
        opacity: 0;
        filter: sepia(1) hue-rotate(-50deg) saturate(5) blur(4px);
        transition: all 1.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
        z-index: 15;
    }

    .enemy-container.loser {
        transform: translateX(-120px) scale(0.6) translateY(50px) rotate(15deg);
        opacity: 0;
        filter: sepia(1) hue-rotate(-50deg) saturate(5) blur(4px);
        transition: all 1.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
        z-index: 15;
    }

    .me-container.tie {
        transform: translateX(60px) scale(0.8);
        opacity: 0;
        filter: grayscale(100%) blur(2px);
        transition: all 1.2s ease-in;
    }

    .enemy-container.tie {
        transform: translateX(-60px) scale(0.8);
        opacity: 0;
        filter: grayscale(100%) blur(2px);
        transition: all 1.2s ease-in;
    }

    /* --- PUBLIC DECK FADE --- */
    .public-deck {
        display: flex;
        justify-content: center;
        align-items: center;
        transition: opacity 0.4s ease, filter 0.4s ease;
    }

    .public-deck.fade-out {
        opacity: 0.15;
        filter: blur(2px);
    }

    .deck-card {
        width: 150px;
        height: 220px;
        background: linear-gradient(135deg, #3a0a0a 0%, #0f0202 100%);
        border: 2px solid #8a0b0b;
        border-radius: 12px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.9), 0 0 15px rgba(255, 0, 0, 0.2) inset, 0 0 20px rgba(255, 0, 0, 0.4);
        background-image: repeating-linear-gradient(45deg, #1a0505 25%, transparent 25%, transparent 75%, #1a0505 75%, #1a0505), repeating-linear-gradient(45deg, #1a0505 25%, #2a0a0a 25%, #2a0a0a 75%, #1a0505 75%, #1a0505);
        background-position: 0 0, 10px 10px;
        background-size: 20px 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #ff3333;
        font-family: 'Quicksand', sans-serif;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 0, 0, 0.8);
    }

    .deck-count {
        font-size: 3rem;
        font-weight: 700;
    }

    .deck-label {
        font-size: 1rem;
        font-weight: 600;
        letter-spacing: 2px;
    }
</style>