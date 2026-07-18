<script lang="ts">
  import io  from 'socket.io-client';
  import Hand from './Hand.svelte';
  import Vote from './Vote.svelte'
  import Board from './Board.svelte'
    import type { stateType } from './types/State';
    import Endscreen from './Endscreen.svelte';

  let socket = io();
  let state:stateType | null  = null;
  let isAnimating = false;

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
          <div class="section-title">CARDS TAKEN</div>
          <div class="stat-row">
            <span>By You:</span>
            <span class="stat-value">{state?.me?.taken.length}</span>
          </div>
          <div class="stat-row">
            <span>By Enemy:</span>
            <span class="stat-value">{state?.enemyTaken}</span>
          </div>
          <div class="stat-row">
            <span>Tied Cards:</span>
            <span class="stat-value">{state.tie?.taken.length}</span>
          </div>
        </div>

        <div class="helper-box">
          <div class="helper-title">HELPER</div>
          <p>The special of the first played card executes first.</p>
        </div>
      </div>
      
      {#if state.enemyHandSize !== undefined}
        <div class="enemyHand">
          <div class="cards">
            {#each Array(state.enemyHandSize) as _}
              <div class="card-back"></div>
            {/each}
          </div>
        </div>
      {/if}

      {#if state.board}
        <div class="board">
          <Board mode={state.mode} board={state.board} meRef={state.meRef} bind:isAnimating></Board>
        </div>
      {/if}
      
      {#if state.me && state.me.hand}
        <div class="hand">
          <Hand socket={socket} mode={state.mode} cards={state.me.hand} isAnimating={isAnimating}></Hand>
        </div>
      {/if}

  </div>


  {/if}
</main>


<style>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap');

  .hand{
    grid-area: hand;
    padding-bottom: 20px;
  }

  .enemyHand{
    grid-area: enemyHand;
    padding-top: 20px;
  }

  .cards {
    display:flex;
    flex-direction: row;
    gap:8px;
    overflow-x:auto;
    justify-content: center;
  }

  .card-back {
    width: 225px; /* 45px * 5 */
    height: 400px;
    background: linear-gradient(135deg, #8fb996 0%, #5c8065 100%);
    background-image: var(--paper-texture), linear-gradient(135deg, #8fb996 0%, #5c8065 100%);
    border: 4px solid #4a5d4e;
    border-radius: 16px;
    box-shadow: 0 6px 15px rgba(74, 93, 78, 0.3), inset 0 0 20px rgba(0,0,0,0.1);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .card-back::before {
    content: '';
    position: absolute;
    top: 12px; left: 12px; right: 12px; bottom: 12px;
    border: 2px dashed rgba(253, 250, 246, 0.6);
    border-radius: 10px;
  }

  .card-back::after {
    content: '🌿';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 4rem;
    color: #fdfaf6;
    opacity: 0.8;
    filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.2));
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
    background: linear-gradient(180deg, rgba(253, 250, 246, 0.9) 0%, rgba(232, 240, 230, 0.9) 100%);
    background-image: var(--paper-texture), linear-gradient(180deg, rgba(253, 250, 246, 0.9) 0%, rgba(232, 240, 230, 0.9) 100%);
    border-left: 3px solid #8fb996;
    box-shadow: -5px 0 20px rgba(92, 128, 101, 0.15);
    color: #2c3e2e;
    font-family: 'Quicksand', sans-serif;
    overflow-y: auto;
  }

  .turn-indicator {
    font-size: 1.8rem;
    font-weight: 700;
    text-align: center;
    padding: 1rem;
    border-radius: 8px;
    background: rgba(253, 250, 246, 0.9);
    background-image: var(--paper-texture), linear-gradient(90deg, rgba(253, 250, 246, 0.9), rgba(232, 240, 230, 0.9));
    border: 3px solid #a3c9a6;
    color: #5c8065;
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
    box-shadow: 0 4px 6px rgba(143, 185, 150, 0.15);
    letter-spacing: 2px;
    text-transform: uppercase;
    transition: all 0.3s ease;
  }

  .turn-indicator.my-turn {
    color: #ffffff;
    border-color: #f7a072;
    background: rgba(247, 160, 114, 0.9);
    background-image: var(--paper-texture), linear-gradient(90deg, rgba(247, 160, 114, 0.9), rgba(243, 210, 193, 0.9));
    text-shadow: 1px 1px 2px rgba(247, 160, 114, 0.8);
    box-shadow: 0 4px 12px rgba(247, 160, 114, 0.4);
  }

  .score-section {
    background: rgba(253, 250, 246, 0.85);
    background-image: var(--paper-texture), linear-gradient(180deg, rgba(253, 250, 246, 0.85), rgba(232, 240, 230, 0.85));
    border: 2px solid #b5d5b7;
    border-radius: 8px;
    padding: 1rem;
    position: relative;
    box-shadow: 0 4px 6px rgba(143, 185, 150, 0.1);
  }

  .score-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: #8fb996;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  .section-title {
    font-size: 1.2rem;
    font-weight: 800;
    color: #4a5d4e;
    margin-bottom: 0.8rem;
    letter-spacing: 2px;
    border-bottom: 2px dashed #a3c9a6;
    padding-bottom: 0.5rem;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .section-title::before, .section-title::after {
    content: '✿';
    color: #8fb996;
    font-size: 0.9rem;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: #4a5d4e;
  }

  .stat-row:last-child {
    margin-bottom: 0;
  }

  .stat-value {
    color: #2c3e2e;
    font-weight: 700;
    font-size: 1.2rem;
  }

  .helper-box {
    margin-top: auto;
    background: rgba(253, 250, 246, 0.85);
    background-image: var(--paper-texture), linear-gradient(180deg, rgba(253, 250, 246, 0.85), rgba(232, 240, 230, 0.85));
    border: 2px dashed #a3c9a6;
    padding: 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    line-height: 1.4;
    color: #4a5d4e;
  }

  .helper-box p {
    margin: 0;
  }

  .helper-title {
    color: #5c8065;
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
    "enemyHand enemyHand enemyHand scoreBoard"
    "board board board scoreBoard"
    "hand hand hand scoreBoard";
    grid-template-rows: auto 1fr auto;
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