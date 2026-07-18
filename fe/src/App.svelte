<script lang="ts">
  import io  from 'socket.io-client';
  import Hand from './Hand.svelte';
  import Vote from './Vote.svelte'
  import Board from './Board.svelte'
    import type { stateType } from './types/State';
    import Endscreen from './Endscreen.svelte';

  let socket = io();
  let state:stateType | null  = null;

  socket.on('returnState', (innerState:stateType) => {
      state = innerState;
  }) // Return State

</script>

<main>
  {#if state}
  <Vote socket={socket} state={state}></Vote>
  {/if}
  {#if state}
  <Endscreen state={state}></Endscreen>
  {/if}
  {#if state}
  <div class="all">
      <div class="scoreBoard">
        <div class="turn-indicator" class:my-turn={state.meRef === state.turn}>
          {state.meRef === state.turn ? 'MY TURN' : 'ENEMY TURN'}
        </div>

        <div class="score-section">
          <div class="section-title">SETS</div>
          <div class="stat-row">
            <span>Your Points:</span>
            <span class="stat-value">{state.me?.score}</span>
          </div>
          <div class="stat-row">
            <span>Enemy Points:</span>
            <span class="stat-value">{state.enemyScore}</span>
          </div>
        </div>

        <div class="score-section">
          <div class="section-title">DECKS</div>
          <div class="stat-row">
            <span>Public Cards Left:</span>
            <span class="stat-value">{state.board?.publicDeck.length}</span>
          </div>
          <div class="stat-row">
            <span>Tied Cards:</span>
            <span class="stat-value">{state.tie?.taken.length}</span>
          </div>
        </div>

        <div class="score-section">
          <div class="section-title">CARDS TAKEN</div>
          <div class="stat-row">
            <span>By You:</span>
            <span class="stat-value">{state?.me?.taken.length}</span>
          </div>
          <div class="stat-row">
            <span>By Enemy:</span>
            <span class="stat-value">{state?.enemyTaken}</span>
          </div>
        </div>

        <div class="helper-box">
          <div class="helper-title">HELPER</div>
          <p>The special of the first played card executes first.</p>
        </div>
      </div>
      
      {#if state.board}
        <div class="board">
          <Board mode={state.mode} board={state.board}></Board>
        </div>
      {/if}
      
      
      {#if state.me && state.me.hand}
        <div class="hand">
          <Hand socket={socket} mode={state.mode} cards={state.me.hand}></Hand>
        </div>
      {/if}

  </div>


  {/if}
</main>


<style>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap');

  .hand{
    grid-area: hand;
  }

  .board{
    grid-area: board;
  }

  .scoreBoard {
    grid-area: scoreBoard;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    padding: 1.5rem;
    background: linear-gradient(180deg, #1f140e 0%, #0a0604 100%);
    border-left: 2px solid #b38b14;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.8);
    color: #fdf5e6;
    font-family: 'Quicksand', sans-serif;
    overflow-y: auto;
  }

  .turn-indicator {
    font-size: 1.8rem;
    font-weight: 700;
    text-align: center;
    padding: 1rem;
    border-radius: 4px;
    background: linear-gradient(90deg, #1a100a, #2a1a0f, #1a100a);
    border: 1px solid #8a6b08;
    color: #d4af37;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.8) inset, 0 0 10px rgba(0, 0, 0, 0.5);
    letter-spacing: 2px;
    text-transform: uppercase;
    transition: all 0.3s ease;
  }

  .turn-indicator.my-turn {
    color: #ffffff;
    border-color: #ffd700;
    background: linear-gradient(90deg, #3d2a13, #5c4322, #3d2a13);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 215, 0, 0.5);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.8) inset, 0 0 20px rgba(0, 0, 0, 0.6);
  }

  .score-section {
    background: rgba(15, 10, 6, 0.85);
    border: 1px solid #5c4322;
    border-radius: 6px;
    padding: 1rem;
    position: relative;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.8);
  }

  .score-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: #ffd700;
    box-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
  }

  .section-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #ffd700;
    margin-bottom: 0.8rem;
    letter-spacing: 1.5px;
    border-bottom: 1px solid #5c4322;
    padding-bottom: 0.3rem;
    text-transform: uppercase;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
  }

  .stat-row:last-child {
    margin-bottom: 0;
  }

  .stat-value {
    color: #ffffff;
    font-weight: 700;
    font-size: 1.2rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
  }

  .helper-box {
    margin-top: auto;
    background: rgba(15, 10, 6, 0.85);
    border: 1px dashed #b38b14;
    padding: 1rem;
    border-radius: 4px;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .helper-box p {
    margin: 0;
  }

  .helper-title {
    color: #ffd700;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  main{
    height:100%;
    width:100%;
  }

  .all{
    height:100%;
    width:100%;
    display:grid;
    grid-template: 
    "board board board scoreBoard"
    "hand hand hand scoreBoard";
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr 1fr;

  }

@media only screen and (max-width: 750px) {
  .all {
    height:100%;
    width:100%;
    display:flex;
    flex-direction:column;
  }
  .scoreBoard{
    display:none;
    /* grid-area: scoreBoard;
      display:flex;
      flex-direction: row; */
    }
}
</style>