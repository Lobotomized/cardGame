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
dialog{
    background:var(--card-background);
    z-index:10;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}
.container{
    width:80vw;
    height:80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>