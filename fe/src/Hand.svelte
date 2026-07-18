<script lang="ts">
    import type { CardType } from "./types/Card";
    import type { modeType } from "./types/mode";
    import Card from "./Card.svelte";

    export let socket;
    export let cards:CardType[];
    export let mode: modeType;
    export let isAnimating: boolean = false;
</script>



<div class="cards">

        {#each cards as card, cardIndex}
        

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        {#key card.cardTitle}
        <div class="card-wrapper" class:disabled={isAnimating} on:click={() => {
            if (isAnimating) return;
            socket.emit('move' , {
                cardIndex
            })
        }} >
            <Card mode={mode} card={card}></Card>
        </div>
        {/key}

        {/each}


</div>

<style>
     .cards{
        display:flex;
        flex-direction: row;
        /* flex-wrap: wrap; */
        gap:8px;
        overflow-x:auto;
    }

    .card-wrapper.disabled {
        pointer-events: none;
        opacity: 0.8;
        cursor: not-allowed;
    }
</style>