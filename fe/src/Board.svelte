<script lang="ts">
    import Card from './Card.svelte';
    import type { Board } from './types/State';
    import type { modeType } from './types/mode';

    export let board:Board;
    export let mode:modeType;

    let animateCounter: number = 0;
    let localAnimateTimer: any;
    let currentTrick: any = null;

    $: {
        if (board.lastTrick && JSON.stringify(currentTrick) !== JSON.stringify(board.lastTrick)) {
            currentTrick = board.lastTrick;
            animateCounter = 50;
            clearInterval(localAnimateTimer);
            localAnimateTimer = setInterval(() => {
                if (animateCounter > 0) {
                    animateCounter--;
                } else {
                    clearInterval(localAnimateTimer);
                }
            }, 50);
        }
    }

    let hideCards: boolean = false;
    $: hideCards = animateCounter > 0;
</script>

<div class="board">
    <div style={!hideCards ? "" : `opacity:${(1-((50-animateCounter)/50))}`} class="me">
        {#if animateCounter > 0 && currentTrick?.player1}
            <Card card={currentTrick.player1} mode={mode}></Card>
        {:else if board.player1}
            <Card card={board.player1} mode={mode}></Card>
        {/if}
    </div>

    <div style={`opacity:${((70-animateCounter)/50)}`} class="battleGround"> 
        {#if animateCounter > 0 && currentTrick?.winnerCard}
            <Card mode={mode} card={currentTrick.winnerCard}></Card>
        {/if}
    </div>
    <div style={!hideCards ? "" : `opacity:${(1-((50-animateCounter)/50))}`} class="enemy">
        {#if animateCounter > 0 && currentTrick?.player2}
            <Card card={currentTrick.player2} mode={mode}></Card>
        {:else if board.player2}
            <Card card={board.player2} mode={mode}></Card>
        {/if}
    </div>
</div>


<style>
    .board{
        display:grid;
        grid-template-columns: repeat(5,1fr);
        width:100%;
        grid-template-areas: "me . battleGround . enemy";
        grid-template-rows:1fr;
        height:100%;
    }
    .me{
        grid-area:me;
    }
    .enemy{
        grid-area:enemy;
    }
    .battleGround{
        grid-area:battleGround;
    }
    
</style>