<script lang="ts">
  import io  from 'socket.io-client';
  import Hand from './Hand.svelte';
  import Vote from './Vote.svelte'
  import Board from './Board.svelte'
    import type { stateType } from './types/State';

  let socket = io();
  let state:stateType | null  = null;

  socket.on('returnState', (innerState:stateType) => {
      state = innerState;
  }) // Return State

</script>

<main>
  {#if state}
    <Vote socket={socket} state={state}></Vote>
    <h1>{state.meRef === state.turn ? 'My Turn' : 'Enemy Turn'}  Az sym : {state.meRef}</h1>
    {#if state.board}
      <div class="board">
        <Board animateCounter={state.animateCounter} mode={state.mode} board={state.board}></Board>
      </div>
    {/if}
    
    
    {#if state.me && state.me.hand}
      <div class="hand">
        <Hand socket={socket} mode={state.mode} cards={state.me.hand}></Hand>
      </div>

      <div>
        <span>Public deck left : {state.board?.publicDeck.length}</span>
        <span>Points : {state?.me.taken.length}</span>
      </div>
    {/if}


  {/if}




</main>


<style>
  main{
    height:100%;
    width:100%;
    display:grid;
    grid-template-rows: 1fr;
  }
</style>