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
        <h1 class="game-title">Exhibition Hall</h1>
        <p class="search-message">{searchMessage}</p>
        <p class="wait-info">Awaiting another curator...</p>
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
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;600&display=swap');

  .start-menu {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #121212;
  }

  .menu-content {
    background: #1e1e1e;
    padding: 3rem 4rem;
    border-radius: 4px;
    border: 1px solid #333333;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .game-title {
    font-family: 'Playfair Display', serif;
    color: #f0f0f0;
    font-size: 3rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: 2px;
  }

  .search-message {
    font-family: 'Inter', sans-serif;
    font-size: 1.2rem;
    color: #cccccc;
    margin: 0;
    font-weight: 600;
  }

  .wait-info {
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    color: #aaaaaa;
    margin: 0;
    font-weight: 400;
    font-style: italic;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #333333;
    border-top: 3px solid var(--letters-color, #f0f0f0);
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
    background-color: #0f0f0f;
    background-image: 
        repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px),
        repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 12px);
    border: 4px solid var(--frame-color, #0a0a0a);
    border-radius: 3px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(0,0,0,0.8);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  
  .card-back::before {
    content: '';
    position: absolute;
    top: 4px; left: 4px; right: 4px; bottom: 4px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 2px;
    z-index: 1;
  }

  .card-back::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 14px; height: 14px;
    transform: translate(-50%, -50%) rotate(45deg);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 
        inset 0 0 0 3px #0f0f0f, 
        inset 0 0 0 4px rgba(255,255,255,0.15),
        0 0 0 3px #0f0f0f, 
        0 0 0 4px rgba(255,255,255,0.15);
    z-index: 2;
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
    background: #1a1a1a;
    border-left: 1px solid #333333;
    box-shadow: -5px 0 20px rgba(0, 0, 0, 0.5);
    color: #f0f0f0;
    font-family: 'Inter', sans-serif;
    overflow-y: auto;
  }

  .turn-indicator {
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    padding: 1rem;
    border-radius: 2px;
    background: #121212;
    border: 1px solid #333333;
    color: #aaaaaa;
    letter-spacing: 2px;
    text-transform: uppercase;
    transition: all 0.3s ease;
    font-family: 'Playfair Display', serif;
  }

  .turn-indicator.my-turn {
    color: #121212;
    border-color: #f0f0f0;
    background: #f0f0f0;
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
  }

  .score-section {
    background: #1e1e1e;
    border: 1px solid #333333;
    border-radius: 2px;
    padding: 1rem;
    position: relative;
  }

  .score-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--accent-color, #c9a227);
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #f0f0f0;
    margin-bottom: 0.8rem;
    letter-spacing: 1px;
    border-bottom: 1px solid #333333;
    padding-bottom: 0.5rem;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
    font-weight: 400;
    color: #cccccc;
  }

  .stat-row:last-child {
    margin-bottom: 0;
  }

  .stat-value {
    color: #f0f0f0;
    font-weight: 600;
    font-size: 1.1rem;
    font-family: 'Georgia', serif;
  }

  .helper-box {
    margin-top: auto;
    background: #1e1e1e;
    border: 1px solid #333333;
    padding: 1rem;
    border-radius: 2px;
    font-size: 0.85rem;
    line-height: 1.5;
    color: #cccccc;
  }

  .helper-box p {
    margin: 0;
  }

  .helper-title {
    color: #f0f0f0;
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .history-btn {
    margin-top: 10px;
    padding: 12px;
    background: #1e1e1e;
    border: 1px solid #555555;
    border-radius: 2px;
    color: #f0f0f0;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .history-btn:hover {
    background: #333333;
    color: #ffffff;
  }

  .history-btn:active {
    transform: translateY(1px);
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
    border-bottom: 1px solid #333333;
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