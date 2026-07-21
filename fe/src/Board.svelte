<script lang="ts">
    import Card from './Card.svelte';
    import type { Board, turn } from './types/State';
    import type { modeType } from './types/mode';

    export let board:Board;
    export let mode:modeType;
    export let meRef:turn;
    export let isAnimating: boolean = false;

    let animateState: 'idle' | 'clash' | 'resolve' = 'idle';
    let currentTrick: any = null;
    let animationTimer1: any;
    let animationTimer2: any;

    $: isAnimating = animateState !== 'idle';

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
        min-height: var(--card-height);
        z-index: 5;
    }

    .card-container {
        display: flex;
        justify-content: center;
        min-height: var(--card-height);
        min-width: calc(45px * var(--umnojitel));
        transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
        z-index: 10;
    }

    /* --- CLASH PHASE --- */
    .me-container.clash {
        transform: translateX(120px) scale(1.1) rotate(5deg);
        z-index: 20;
        filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8));
    }

    .enemy-container.clash {
        transform: translateX(-120px) scale(1.1) rotate(-5deg);
        z-index: 20;
        filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8));
    }

    /* --- RESOLVE PHASE --- */
    .me-container.winner {
        transform: translateX(60px) scale(1.2);
        z-index: 30;
        filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 20px rgba(200, 200, 200, 0.8));
        transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .enemy-container.winner {
        transform: translateX(-60px) scale(1.2);
        z-index: 30;
        filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 20px rgba(200, 200, 200, 0.8));
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
        width: calc(30px * var(--umnojitel));
        height: calc(var(--card-height) * 0.55);
        background: linear-gradient(135deg, #333333 0%, #111111 100%);
        background-image: var(--paper-texture), linear-gradient(135deg, #333333 0%, #111111 100%);
        border: 4px solid #555555;
        border-radius: 16px;
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255,255,255,0.05);
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        font-family: 'Quicksand', sans-serif;
    }

    .deck-card::before {
        content: '';
        position: absolute;
        top: 8px; left: 8px; right: 8px; bottom: 8px;
        border: 2px dashed rgba(255, 255, 255, 0.3);
        border-radius: 10px;
        pointer-events: none;
    }

    .deck-card::after {
        content: '💀';
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 1.5rem;
        color: #ffffff;
        opacity: 0.6;
        filter: drop-shadow(1px 2px 3px rgba(0,0,0,0.5));
        pointer-events: none;
    }

    .deck-count {
        font-size: calc(0.7rem * var(--umnojitel));
        font-weight: 800;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        z-index: 2;
    }

    .deck-label {
        font-size: calc(0.2rem * var(--umnojitel));
        font-weight: 700;
        letter-spacing: 2px;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        z-index: 2;
    }

    @media (max-width: 900px) {
        .board {
            gap: 10px;
        }
        .center-area {
            gap: 10px;
        }
        .me-container.clash {
            transform: translateX(30px) scale(1.05) rotate(5deg);
        }
        .enemy-container.clash {
            transform: translateX(-30px) scale(1.05) rotate(-5deg);
        }
        .me-container.winner {
            transform: translateX(15px) scale(1.1);
        }
        .enemy-container.winner {
            transform: translateX(-15px) scale(1.1);
        }
        .me-container.loser {
            transform: translateX(30px) scale(0.6) translateY(20px) rotate(-15deg);
        }
        .enemy-container.loser {
            transform: translateX(-30px) scale(0.6) translateY(20px) rotate(15deg);
        }
        .me-container.tie {
            transform: translateX(15px) scale(0.8);
        }
        .enemy-container.tie {
            transform: translateX(-15px) scale(0.8);
        }
    }
</style>
