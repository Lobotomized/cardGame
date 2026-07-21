<script lang="ts">
    import type { CardType } from "./types/Card";
    import type { modeType } from "./types/mode";
    import Card from "./Card.svelte";

    export let socket;
    export let cards:CardType[];
    export let mode: modeType;
    export let isAnimating: boolean = false;
    export let isMyTurn: boolean = false;

    let selectedCardIndex: number | null = null;

    function handleCardClick(cardIndex: number) {
        if (isAnimating) return;
        if (window.innerWidth <= 900) {
            selectedCardIndex = cardIndex;
        } else {
            playCard(cardIndex);
        }
    }

    function playCard(cardIndex: number) {
        if (!isMyTurn) return;
        socket.emit('move', { cardIndex });
        selectedCardIndex = null;
    }
</script>



<div class="cards">

        {#each cards as card, cardIndex}
        

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        {#key card.cardTitle}
        <div class="card-wrapper" class:disabled={isAnimating} on:click={() => handleCardClick(cardIndex)}>
            <Card mode={mode} card={card}></Card>
        </div>
        {/key}

        {/each}


</div>

{#if selectedCardIndex !== null && cards[selectedCardIndex]}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="mobile-card-overlay" on:click|self={() => selectedCardIndex = null}>
        <div class="overlay-card-wrapper">
            <Card mode={mode} card={cards[selectedCardIndex]}></Card>
        </div>
        <div class="overlay-buttons">
            <button 
                class="btn-play" 
                disabled={!isMyTurn}
                on:click={() => isMyTurn && playCard(selectedCardIndex)}
            >
                {isMyTurn ? 'Play the Card' : 'Wait your turn to play'}
            </button>
            <button class="btn-back" on:click={() => selectedCardIndex = null}>Back</button>
        </div>
    </div>
{/if}

<style>
     .cards{
        display:flex;
        flex-direction: row;
        gap:8px;
        overflow-x:auto;
        justify-content: center;
        padding: 0 10px;
        box-sizing: border-box;
    }

    .card-wrapper {
        position: relative;
        z-index: 1;
        transition: z-index 0.2s ease;
        display: flex;
    }

    .card-wrapper:hover, .card-wrapper:active {
        z-index: 10;
    }

    @media (max-width: 900px) {
        .cards {
            justify-content: center;
            flex-wrap: nowrap;
            overflow: visible;
            gap: 0;
        }
        .card-wrapper:not(:first-child) {
            margin-left: calc(-22px * var(--umnojitel));
        }
    }

    .card-wrapper.disabled {
        pointer-events: none;
        opacity: 0.8;
        cursor: not-allowed;
    }

    /* OVERLAY STYLES */
    .mobile-card-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(5px);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .overlay-card-wrapper {
        transform: scale(1.5);
        margin-bottom: 70px;
        pointer-events: none;
    }

    @media (max-width: 600px) {
        .overlay-card-wrapper {
            transform: scale(2.2);
            margin-bottom: 120px;
        }
    }

    .overlay-buttons {
        display: flex;
        gap: 15px;
        z-index: 10000;
    }

    .overlay-buttons button {
        font-family: 'Quicksand', sans-serif;
        font-weight: 700;
        font-size: 1rem;
        color: #ffffff;
        padding: 12px 24px;
        border-radius: 8px;
        outline: none;
        cursor: pointer;
        text-transform: uppercase;
        letter-spacing: 1px;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
        transition: all 0.2s ease;
    }

    .btn-play {
        background: linear-gradient(180deg, #5b8c5a 0%, #3a6b39 100%);
    }
    .btn-play:hover:not(:disabled) {
        background: linear-gradient(180deg, #6c9d6b 0%, #4b7c4a 100%);
        transform: translateY(-2px);
    }
    .btn-play:disabled {
        background: linear-gradient(180deg, #888888 0%, #555555 100%);
        color: #cccccc;
        border-color: #999999;
        cursor: not-allowed;
        box-shadow: none;
    }

    .btn-back {
        background: linear-gradient(180deg, #8b4513 0%, #6b2500 100%);
    }
    .btn-back:hover {
        background: linear-gradient(180deg, #9c5624 0%, #7c3611 100%);
        transform: translateY(-2px);
    }
</style>