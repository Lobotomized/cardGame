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
    background: linear-gradient(135deg, #333333 0%, #111111 100%);
    background-image: var(--paper-texture), linear-gradient(135deg, #333333 0%, #111111 100%);
    border: 4px solid #555555;
    border-radius: 16px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255,255,255,0.05);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .card-back::before {
    content: '';
    position: absolute;
    top: 12px; left: 12px; right: 12px; bottom: 12px;
    border: 2px dashed rgba(255, 255, 255, 0.3);
    border-radius: 10px;
  }

  .card-back::after {
    content: '💀';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 4rem;
    color: #ffffff;
    opacity: 0.8;
    filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.5));
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
    background: linear-gradient(180deg, rgba(30, 30, 30, 0.9) 0%, rgba(10, 10, 10, 0.9) 100%);
    background-image: var(--paper-texture), linear-gradient(180deg, rgba(30, 30, 30, 0.9) 0%, rgba(10, 10, 10, 0.9) 100%);
    border-left: 3px solid #555555;
    box-shadow: -5px 0 20px rgba(0, 0, 0, 0.5);
    color: #ffffff;
    font-family: 'Quicksand', sans-serif;
    overflow-y: auto;
  }

  .turn-indicator {
    font-size: 1.8rem;
    font-weight: 700;
    text-align: center;
    padding: 1rem;
    border-radius: 8px;
    background: rgba(40, 40, 40, 0.9);
    background-image: var(--paper-texture), linear-gradient(90deg, rgba(40, 40, 40, 0.9), rgba(20, 20, 20, 0.9));
    border: 3px solid #666666;
    color: #cccccc;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
    letter-spacing: 2px;
    text-transform: uppercase;
    transition: all 0.3s ease;
  }

  .turn-indicator.my-turn {
    color: #000000;
    border-color: #ffffff;
    background: rgba(255, 255, 255, 0.9);
    background-image: var(--paper-texture), linear-gradient(90deg, rgba(255, 255, 255, 0.9), rgba(220, 220, 220, 0.9));
    text-shadow: none;
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.4);
  }

  .score-section {
    background: rgba(20, 20, 20, 0.85);
    background-image: var(--paper-texture), linear-gradient(180deg, rgba(20, 20, 20, 0.85), rgba(10, 10, 10, 0.85));
    border: 2px solid #444444;
    border-radius: 8px;
    padding: 1rem;
    position: relative;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  .score-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: #ffffff;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  .section-title {
    font-size: 1.2rem;
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 0.8rem;
    letter-spacing: 2px;
    border-bottom: 2px dashed #777777;
    padding-bottom: 0.5rem;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .section-title::before, .section-title::after {
    content: '✧';
    color: #ffffff;
    font-size: 0.9rem;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: #cccccc;
  }

  .stat-row:last-child {
    margin-bottom: 0;
  }

  .stat-value {
    color: #ffffff;
    font-weight: 700;
    font-size: 1.2rem;
  }

  .helper-box {
    margin-top: auto;
    background: rgba(20, 20, 20, 0.85);
    background-image: var(--paper-texture), linear-gradient(180deg, rgba(20, 20, 20, 0.85), rgba(10, 10, 10, 0.85));
    border: 2px dashed #555555;
    padding: 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    line-height: 1.4;
    color: #cccccc;
  }

  .helper-box p {
    margin: 0;
  }

  .helper-title {
    color: #ffffff;
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