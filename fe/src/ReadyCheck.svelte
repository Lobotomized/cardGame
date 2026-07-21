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
        <h2 class="title">✿ 16 Big Game Cards ✿</h2>
        <p class="subtitle">These cards will be used for all sets in this match</p>
        
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
    width: 100vw;
    height: 100vh;
    background: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Quicksand', sans-serif;
    overflow-y: auto;
}

.ready-content {
    background: linear-gradient(135deg, #fdfaf6, #e6e0d4);
    background-image: var(--paper-texture), linear-gradient(135deg, #fdfaf6, #e6e0d4);
    padding: 2rem;
    border-radius: 24px;
    border: 3px dashed #8fb996;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
}

.title {
    color: #2c3e2e;
    font-size: 2.5rem;
    margin: 0 0 0.5rem 0;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.subtitle {
    color: #4a5d4c;
    font-size: 1.2rem;
    margin: 0 0 2rem 0;
    font-weight: 600;
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
    font-size: 1.5rem;
    font-family: 'Quicksand', sans-serif;
    font-weight: 700;
    color: #ffffff;
    background: #8fb996;
    background-image: var(--paper-texture), linear-gradient(135deg, #8fb996, #5c7e63);
    border: 2px dashed #ffffff;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.ready-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0,0,0,0.3);
    background-image: var(--paper-texture), linear-gradient(135deg, #9cc8a4, #6a8c71);
}

.ready-btn:active {
    transform: translateY(1px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.status-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: #2c3e2e;
    font-size: 1.5rem;
    font-weight: 700;
}

.enemy-status {
    color: #5c7e63;
    font-weight: 700;
    font-size: 1.2rem;
    margin: 0;
}

.spinner {
    width: 30px;
    height: 30px;
    border: 4px solid #d4e5d1;
    border-top: 4px solid #8fb996;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>