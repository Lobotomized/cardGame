<script lang="ts">
  import type { BattleHistoryTrick, turn, stateType } from './types/State';
  import type { modeType } from './types/mode';
  import Card from './Card.svelte';

  export let history: BattleHistoryTrick[] = [];
  export let meRef: turn;
  export let mode: modeType;
  export let state: stateType | null = null;
  export let close: () => void;

  function getWinnerLabel(trick: BattleHistoryTrick) {
    if (trick.winnerRef === 'tie') return 'TIE';
    if (trick.winnerRef === meRef) return 'YOU WON';
    return 'ENEMY WON';
  }

  $: unplayedCards = (() => {
    if (!state || !state.bigGameCards) return [];
    
    const seenAnimations = new Set<string>();

    if (state.me && state.me.hand) {
      state.me.hand.forEach(c => seenAnimations.add(c.animation));
    }
    
    if (state.board) {
      if (state.board.player1) seenAnimations.add(state.board.player1.animation);
      if (state.board.player2) seenAnimations.add(state.board.player2.animation);
    }
    
    if (state.battleHistory) {
      state.battleHistory.forEach(trick => {
        seenAnimations.add(trick.player1.animation);
        seenAnimations.add(trick.player2.animation);
      });
    }

    return state.bigGameCards.filter(c => !seenAnimations.has(c.animation));
  })();
</script>

<div class="modal-backdrop" on:click={close}>
  <div class="modal-content" on:click|stopPropagation>
    <div class="modal-header">
      <h2>Battle History</h2>
      <button class="close-btn" on:click={close}>✕</button>
    </div>
    
    <div class="history-list">
      {#if history.length === 0}
        <div class="empty-state">No battles yet in this round.</div>
      {:else}
        {#each history as trick, index}
          <div class="trick-row">
            <div class="trick-number">Round {index + 1}</div>
            <div class="trick-cards">
              <div class="card-wrapper" tabindex="0" class:winner={trick.winnerRef === meRef}>
                <div class="label">You</div>
                <div class="card-layout-box">
                  <div class="card-scaler">
                    <Card card={meRef === 'player1' ? trick.player1 : trick.player2} mode={mode} />
                  </div>
                </div>
              </div>
              <div class="vs-label">
                <span class="winner-badge" class:win={trick.winnerRef === meRef} class:loss={trick.winnerRef !== meRef && trick.winnerRef !== 'tie'}>
                  {getWinnerLabel(trick)}
                </span>
                <span class="vs">VS</span>
              </div>
              <div class="card-wrapper" tabindex="0" class:winner={trick.winnerRef !== meRef && trick.winnerRef !== 'tie'}>
                <div class="label">Enemy</div>
                <div class="card-layout-box">
                  <div class="card-scaler">
                    <Card card={meRef === 'player1' ? trick.player2 : trick.player1} mode={mode} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/each}
      {/if}
    </div>

    <div class="unplayed-section">
      <h3 class="section-title">Unplayed Cards (Enemy Hand & Deck)</h3>
      {#if unplayedCards.length === 0}
        <div class="empty-state">No unplayed cards left.</div>
      {:else}
        <div class="unplayed-grid">
          {#each unplayedCards as card}
            <div class="unplayed-card-wrapper" tabindex="0">
              <div class="card-layout-box">
                <div class="card-scaler">
                  <Card {card} mode={mode} />
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    padding: 40px 20px;
    overflow-y: auto;
  }
  
  .modal-content {
    margin: auto;
    flex-shrink: 0;
    background: #fdfaf6;
    background-image: var(--paper-texture), linear-gradient(135deg, #fdfaf6, #f4eee1);
    border: 3px dashed #8fb996;
    border-radius: 16px;
    width: 90%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    color: #2c3e2e;
    font-family: 'Quicksand', sans-serif;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 25px;
    border-bottom: 2px dashed #8fb996;
    background: #e8f0e6;
    border-radius: 16px 16px 0 0;
  }

  .modal-header h2 {
    margin: 0;
    color: #2c3e2e;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #2c3e2e;
    cursor: pointer;
    padding: 0;
    font-weight: bold;
  }

  .close-btn:hover {
    color: #1a251b;
  }

  .history-list {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .empty-state {
    text-align: center;
    font-size: 1.2rem;
    color: #5c7e63;
    padding: 40px;
    font-style: italic;
  }

  .trick-cards {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    position: relative;
    z-index: 1;
  }

  .trick-row {
    background: rgba(255, 255, 255, 0.5);
    border: 2px dashed #b5d1b9;
    border-radius: 12px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  .trick-row:hover,
  .trick-row:focus-within {
    z-index: 100;
  }

  .trick-number {
    font-weight: bold;
    color: #5c7e63;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 1px solid #d4e5d1;
    padding-bottom: 5px;
  }

  .card-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    transition: transform 0.2s;
    position: relative;
    z-index: 1;
    cursor: pointer;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  .card-wrapper:hover,
  .card-wrapper:focus,
  .card-wrapper:focus-within {
    z-index: 100;
  }

  .card-wrapper.winner {
    transform: scale(1.05);
  }

  .label {
    font-weight: 600;
    color: #2c3e2e;
    text-transform: uppercase;
    transition: opacity 0.2s;
  }

  .card-layout-box {
    width: calc(45px * var(--umnojitel) * 0.6);
    height: calc(var(--card-height) * 0.6);
    position: relative;
  }

  .card-scaler {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.6);
    width: calc(45px * var(--umnojitel));
    height: auto;
    min-height: var(--card-height);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 1;
    border-radius: 16px;
    display: flex;
  }

  .card-wrapper:hover .card-scaler,
  .card-wrapper:focus .card-scaler,
  .card-wrapper:focus-within .card-scaler {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    z-index: 1000;
  }

  .vs-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    font-weight: bold;
  }

  .vs {
    font-size: 1.5rem;
    color: #8fb996;
  }

  .winner-badge {
    padding: 5px 10px;
    border-radius: 8px;
    font-size: 0.9rem;
    background: #d4e5d1;
    color: #2c3e2e;
    text-align: center;
  }

  .winner-badge.win {
    background: #8fb996;
    color: white;
  }

  .winner-badge.loss {
    background: #e5a5a5;
    color: white;
  }

  .unplayed-section {
    padding: 20px;
    border-top: 2px dashed #8fb996;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 0 0 16px 16px;
  }

  .section-title {
    margin: 0 0 15px 0;
    color: #2c3e2e;
    font-size: 1.2rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-align: center;
  }

  .unplayed-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
    padding: 10px;
  }

  .unplayed-card-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.2s;
    position: relative;
    z-index: 1;
    cursor: pointer;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  .unplayed-card-wrapper:hover,
  .unplayed-card-wrapper:focus,
  .unplayed-card-wrapper:focus-within {
    z-index: 100;
  }

  .unplayed-card-wrapper .card-layout-box {
    width: calc(45px * var(--umnojitel) * 0.5);
    height: calc(var(--card-height) * 0.5);
  }

  .unplayed-card-wrapper .card-scaler {
    transform: translate(-50%, -50%) scale(0.5);
  }

  .unplayed-card-wrapper:hover .card-scaler,
  .unplayed-card-wrapper:focus .card-scaler,
  .unplayed-card-wrapper:focus-within .card-scaler {
    transform: translate(-50%, -50%) scale(0.8);
    box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    z-index: 1000;
  }

  @media (max-width: 600px) {
    .trick-cards {
      flex-direction: column;
    }
    .card-layout-box {
      width: calc(45px * var(--umnojitel) * 0.8);
      height: calc(var(--card-height) * 0.8);
    }
    .card-scaler {
      transform: translate(-50%, -50%) scale(0.8);
    }
    .card-wrapper:hover .card-scaler,
    .card-wrapper:focus .card-scaler,
    .card-wrapper:focus-within .card-scaler {
      transform: translate(-50%, -50%) scale(1.1);
    }
    .vs-label {
      flex-direction: row;
    }
  }
</style>