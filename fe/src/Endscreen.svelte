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
    background: linear-gradient(180deg, #1f140e 0%, #0a0604 100%);
    border: 2px solid #b38b14;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.9), 0 0 10px rgba(212, 175, 55, 0.2) inset;
    border-radius: 8px;
    color: #ffd700;
    font-family: 'Quicksand', sans-serif;
    z-index: 10;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    text-align: center;
}

dialog::backdrop {
    background: rgba(0, 0, 0, 0.85);
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
    text-transform: uppercase;
    letter-spacing: 3px;
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.9);
}
</style>