<script lang="ts">
  import { onMount } from 'svelte';
  import io  from 'socket.io-client';
  import Hand from './Hand.svelte';
  import Vote from './Vote.svelte';
  import Board from './Board.svelte';
  import BattleHistoryModal from './BattleHistoryModal.svelte';
  import type { stateType } from './types/State';
  import Endscreen from './Endscreen.svelte';
  import ReadyCheck from './ReadyCheck.svelte';

  let socket: any = null;
  let state:stateType | null  = null;
  let isAnimating = false;
  let showHistory = false;
  let searching = true;
  let searchMessage = "Finding opponent...";

  function findOpponent() {
      searching = true;
      socket = io();
      socket.on('returnState', (innerState: any) => {
          if (innerState.message) {
              searchMessage = innerState.message === "Not Enough Players to Start" 
                ? "Waiting for another player..." 
                : innerState.message;
              state = null;
          } else {
              state = innerState;
              searching = false;
          }
      }) // Return State
  }

  onMount(() => {
    findOpponent();
  });
</script>

<main>
  {#if !state && searching}
    <div class="start-menu">
      <div class="menu-content">
        <h1 class="game-title">✿ Searching ✿</h1>
        <p class="search-message">{searchMessage}</p>
        <p class="wait-info">You will wait for 5 to 30 seconds before finding an opponent.</p>
        <div class="spinner"></div>
      </div>
    </div>
  {/if}

  {#if state}
  <Vote socket={socket} state={state}></Vote>
  <ReadyCheck socket={socket} state={state}></ReadyCheck>
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

        <button class="history-btn" on:click={() => showHistory = true}>
          Battle History
        </button>
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
          <Hand socket={socket} mode={state.mode} cards={state.me.hand} isAnimating={isAnimating} isMyTurn={state.meRef === state.turn}></Hand>
        </div>
      {/if}

  </div>

  {#if showHistory && state.battleHistory}
    <BattleHistoryModal 
      history={state.battleHistory} 
      meRef={state.meRef} 
      mode={state.mode}
      state={state}
      close={() => showHistory = false} 
    />
  {/if}

  {/if}
</main>


<style>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap');

  .start-menu {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #fdfaf6, #e6e0d4);
    background-image: var(--paper-texture), linear-gradient(135deg, #fdfaf6, #e6e0d4);
  }

  .menu-content {
    background: rgba(255, 255, 255, 0.85);
    padding: 3rem 4rem;
    border-radius: 24px;
    border: 3px dashed #8fb996;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .game-title {
    font-family: 'Quicksand', sans-serif;
    color: #2c3e2e;
    font-size: 3rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  }

  .search-message {
    font-family: 'Quicksand', sans-serif;
    font-size: 1.2rem;
    color: #2c3e2e;
    margin: 0;
    font-weight: 600;
  }

  .wait-info {
    font-family: 'Quicksand', sans-serif;
    font-size: 1rem;
    color: #5c7e63;
    margin: 0;
    font-weight: 500;
    font-style: italic;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #d4e5d1;
    border-top: 4px solid #8fb996;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .hand{
    grid-area: hand;
    padding-bottom: 20px;
  }

  .enemyHand{
    grid-area: enemyHand;
    padding-top: 10px;
  }

  .cards {
    display:flex;
    flex-direction: row;
    gap:8px;
    overflow-x:auto;
    justify-content: center;
    padding: 0 10px;
    box-sizing: border-box;
  }

  @media (max-width: 900px) {
    .cards {
      justify-content: flex-start;
    }
  }

  .card-back {
    width: calc(45px * var(--umnojitel) * 0.4); 
    height: calc(var(--card-height) * 0.4);
    background: linear-gradient(135deg, #333333 0%, #111111 100%);
    background-image: var(--paper-texture), linear-gradient(135deg, #333333 0%, #111111 100%);
    border: 3px solid #555555;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(255,255,255,0.05);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .card-back::before {
    content: '';
    position: absolute;
    top: 6px; left: 6px; right: 6px; bottom: 6px;
    border: 1px dashed rgba(255, 255, 255, 0.3);
    border-radius: 6px;
  }

  .card-back::after {
    content: '💀';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: calc(0.8rem * var(--umnojitel) * 0.5);
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

  .history-btn {
    margin-top: 10px;
    padding: 12px;
    background: #8fb996;
    background-image: var(--paper-texture), linear-gradient(135deg, #8fb996, #5c7e63);
    border: 2px dashed #ffffff;
    border-radius: 8px;
    color: #ffffff;
    font-family: 'Quicksand', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  .history-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
    background-image: var(--paper-texture), linear-gradient(135deg, #9cc8a4, #6a8c71);
  }

  .history-btn:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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

@media only screen and (max-width: 900px) {
  .all {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
  }
  .scoreBoard {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    border-left: none;
    border-bottom: 3px solid #555555;
    padding: 10px;
    gap: 10px;
    order: -1;
  }
  .score-section, .turn-indicator, .helper-box, .history-btn {
    flex: 1 1 200px;
    font-size: 0.9rem;
    padding: 0.5rem;
    margin-bottom: 0;
  }
  .turn-indicator {
    font-size: 1.2rem;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .section-title {
    font-size: 1rem;
    margin-bottom: 0.4rem;
  }
  .stat-row {
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
  }
  .stat-value {
    font-size: 1rem;
  }
  .helper-box {
    display: none;
  }
  .board {
    flex: 1;
    min-height: 250px;
  }
  .hand {
    padding-bottom: 10px;
  }
  .enemyHand {
    display: none;
  }
}
</style>