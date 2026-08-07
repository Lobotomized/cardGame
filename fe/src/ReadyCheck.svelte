<script lang="ts">
import type { stateType } from "./types/State";
import Card from "./Card.svelte";

export let socket: any;
export let state: stateType;

$: isReady = state.me?.ready;
$: enemyReady = state.enemyReady;

function handleReady() {
    if (!isReady) {
        socket.emit('move', { ready: true });
    }
}
</script>

{#if state.mode === 'readyCheck'}
<div class="ready-check-overlay">
    <div class="ready-content">
        <h2 class="title">Exhibition Pieces</h2>
        <p class="subtitle">These pieces will be on display for this match</p>
        
        <div class="cards-grid">
            {#each state.board?.publicDeck || [] as card}
                <div class="card-wrapper">
                    <Card card={card} mode="intelligence" />
                </div>
            {/each}
        </div>

        <div class="actions">
            {#if isReady}
                <div class="status-message">
                    {#if enemyReady}
                        <p>Game starting...</p>
                    {:else}
                        <p>Waiting for opponent...</p>
                        <div class="spinner"></div>
                    {/if}
                </div>
            {:else}
                <button class="ready-btn" on:click={handleReady}>READY</button>
                {#if enemyReady}
                    <p class="enemy-status">Opponent is ready!</p>
                {/if}
            {/if}
        </div>
    </div>
</div>
{/if}

<style>
.ready-check-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(18, 18, 18, 0.95);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Inter', sans-serif;
    overflow-y: auto;
}

.ready-content {
    background: #1e1e1e;
    padding: 2rem;
    border-radius: 2px;
    border: 1px solid #333333;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
}

.title {
    color: #f0f0f0;
    font-size: 2.5rem;
    margin: 0 0 0.5rem 0;
    font-family: 'Playfair Display', serif;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.subtitle {
    color: #cccccc;
    font-size: 1.2rem;
    margin: 0 0 2rem 0;
    font-weight: 400;
}

.cards-grid {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 2rem;
    align-items: center;
    width: 100%;
    --umnojitel: 5; /* Full size cards */
}

@media (max-width: 1200px) {
    .cards-grid {
        --umnojitel: 4;
    }
}

@media (max-width: 600px) {
    .cards-grid {
        --umnojitel: 3.2;
    }
    .title {
        font-size: 1.8rem;
    }
}

.actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.ready-btn {
    padding: 15px 40px;
    font-size: 1.2rem;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    color: #121212;
    background: #f0f0f0;
    border: 1px solid #f0f0f0;
    border-radius: 2px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.ready-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.3);
    background: #ffffff;
}

.ready-btn:active {
    transform: translateY(1px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.status-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: #f0f0f0;
    font-size: 1.5rem;
    font-weight: 600;
}

.enemy-status {
    color: #aaaaaa;
    font-weight: 600;
    font-size: 1.2rem;
    margin: 0;
}

.spinner {
    width: 30px;
    height: 30px;
    border: 3px solid #333333;
    border-top: 3px solid #f0f0f0;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>