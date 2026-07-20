<script lang="ts">
import type { stateType } from "./types/State";

export let state:stateType;

</script>

<dialog open={state?.me?.score != undefined && state?.me?.score >= 10}>
    <div class="container">
        <h1>Страшен пич! Как ги би ...</h1>
    </div>
</dialog>

<dialog open={state?.me?.score != undefined && state?.enemyScore >= 10}>
    <div class="container">
        <h1>Пълен бот! Как те биха...</h1>
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
    font-size: 3rem;
    color: #ffffff;
    text-transform: uppercase;
    letter-spacing: 3px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}
</style>