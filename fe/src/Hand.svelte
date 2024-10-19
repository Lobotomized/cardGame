<script lang="ts">
    import type { CardType } from "./types/Card";
    import type { modeType } from "./types/mode";
    import sphinx from "./assets/Gen-2 4040823856, Gen-2 Preview, M 5.mp4"
    import woodMonster from "./assets/Gen-3 Alpha 1800160069, Make the monster mov, 1 A scary snakelike, M 5.mp4"
    import Card from "./Card.svelte";

    export let socket;
    export let cards:CardType[];
    export let mode: modeType
</script>


<div class="cards">

        {#each cards as card, cardIndex}
        

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:click={() => {
            socket.emit('move' , {
                cardIndex
            })
        }} >
            <Card mode={mode} card={card}></Card>
        </div>

        {/each}


</div>

<style>
     .cards{
        display:flex;
        flex-direction: row;
    }
</style>