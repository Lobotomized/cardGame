<script lang="ts">
import type { stateType } from "./types/State";

export let state:stateType;

</script>

<dialog open={state?.me?.score != undefined && (state.me.score >= 5 || state.enemyScore >= 5)}>
    <div class="container">
        {#if state?.me?.score >= 5}
            <h1 class="win">✿ You Won! ✿</h1>
            <p class="subtitle">Congratulations, you defeated your opponent!</p>
        {:else}
            <h1 class="lose">💀 You Lost... 💀</h1>
            <p class="subtitle">Better luck next time.</p>
        {/if}
        
        <button class="new-game-btn" on:click={() => window.location.reload()}>
            Start New Game
        </button>
    </div>
</dialog>


<style>
dialog {
    background: #1a1a1a;
    background-image: var(--paper-texture), linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
    border: 4px solid #ffffff;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.8);
    border-radius: 16px 16px 24px 24px;
    color: #ffffff;
    font-family: 'Quicksand', sans-serif;
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
    background: rgba(0, 0, 0, 0.8);
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
    font-size: 3.5rem;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 3px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    margin-bottom: 0.5rem;
}

h1.win {
    color: #a8d5ba; /* Soft green */
}

h1.lose {
    color: #d5a8a8; /* Soft red */
}

.subtitle {
    font-size: 1.5rem;
    color: #dddddd;
    margin-bottom: 3rem;
    font-weight: 600;
}

.new-game-btn {
    font-family: 'Quicksand', sans-serif;
    font-weight: 700;
    font-size: 1.2rem;
    color: #ffffff;
    padding: 16px 32px;
    border-radius: 8px;
    background: linear-gradient(180deg, #5b8c5a 0%, #3a6b39 100%);
    background-image: var(--paper-texture), linear-gradient(180deg, #5b8c5a 0%, #3a6b39 100%);
    outline: none;
    border: 2px dashed #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    transition: all 0.2s ease-out;
    text-transform: uppercase;
    letter-spacing: 1.5px;
}

.new-game-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
    background: linear-gradient(180deg, #6c9d6b 0%, #4b7c4a 100%);
    background-image: var(--paper-texture), linear-gradient(180deg, #6c9d6b 0%, #4b7c4a 100%);
}

.new-game-btn:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

@media (max-width: 600px) {
    h1 {
        font-size: 2.2rem;
    }
    .subtitle {
        font-size: 1.2rem;
        margin-bottom: 2rem;
    }
    .new-game-btn {
        padding: 12px 24px;
        font-size: 1rem;
    }
    .container {
        width: 95vw;
        padding: 1rem;
    }
}
</style>