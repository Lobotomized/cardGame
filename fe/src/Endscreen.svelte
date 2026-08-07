<script lang="ts">
import type { stateType } from "./types/State";

export let state:stateType;

</script>

<dialog open={state?.me?.score != undefined && (state.me.score >= 5 || state.enemyScore >= 5)}>
    <div class="container">
        {#if state?.me?.score >= 5}
            <h1 class="win">Masterpiece Collection Complete</h1>
            <p class="subtitle">Congratulations, you curated the finest exhibition!</p>
        {:else}
            <h1 class="lose">Exhibition Closed</h1>
            <p class="subtitle">Your opponent presented a superior collection.</p>
        {/if}
        
        <button class="new-game-btn" on:click={() => window.location.reload()}>
            Curate Another Gallery
        </button>
    </div>
</dialog>

<style>
dialog {
    background: #1e1e1e;
    border: 1px solid #333333;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    border-radius: 2px;
    color: #f0f0f0;
    font-family: 'Inter', sans-serif;
    z-index: 100;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    text-align: center;
}

dialog::backdrop {
    background: rgba(18, 18, 18, 0.9);
    backdrop-filter: blur(3px);
}

.container {
    width: 80vw;
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

h1 {
    font-size: 3rem;
    color: #f0f0f0;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 0.5rem;
    font-family: 'Playfair Display', serif;
}

h1.win {
    color: #a8d5ba;
}

h1.lose {
    color: #d5a8a8;
}

.subtitle {
    font-size: 1.2rem;
    color: #cccccc;
    margin-bottom: 3rem;
    font-weight: 400;
}

.new-game-btn {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 1.1rem;
    color: #121212;
    padding: 16px 32px;
    border-radius: 2px;
    background: #f0f0f0;
    outline: none;
    border: 1px solid #f0f0f0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: all 0.2s ease-out;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.new-game-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
    background: #ffffff;
}

.new-game-btn:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

@media (max-width: 600px) {
    h1 {
        font-size: 2rem;
    }
    .subtitle {
        font-size: 1rem;
        margin-bottom: 2rem;
    }
    .new-game-btn {
        padding: 12px 24px;
        font-size: 0.9rem;
    }
    .container {
        width: 95vw;
        padding: 1rem;
    }
}
</style>