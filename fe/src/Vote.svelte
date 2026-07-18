<script lang="ts">
import type { stateType } from "./types/State";

export let socket;
export let state:stateType;

$:myTurn = state.turn === state.meRef;
$:isMyTurn = myTurn ? "Your turn" : "Enemies turn";


const bettingSteps  = [0,1,3,5,8,10]
const modes:string[] = [
  'Intelligence',
  'Agility',
  'Strength'
]
</script>

<dialog open={state.mode === 'betting'}>
    <div class="container">
        {#if myTurn}
        {#if !state?.koeficient?.value || state.koeficient.value < 10}
          {#if state?.koeficient}
          <span class="enemy-vote">Enemy voted for {state.tempMode} with coefficient {bettingSteps[state.currentBettingStep-1]} to 1 </span>
          {/if}
          <div class="bets">
            {#each modes as mode}
              {#if mode.toLowerCase() !== state.tempMode}
              <div class="modeBet">
                <h3 class="modeName">{mode.substring(0,3)}</h3>
                <button on:click={() =>{
                  socket.emit('move', {
                    mode:mode.toLowerCase()
                  })}}>Bet {bettingSteps[state.currentBettingStep]} to 1</button>
              </div>
              {/if}
            {/each}
          </div>
        {/if}
        
        {#if state.currentBettingStep > 1}
          <button class="give-up-btn" on:click={() => {
              socket.emit('move', {
                giveUp:true
              })
          }}>Give up</button>
        {/if}
      
      {:else}
          <h3 class="enemy-voting-text">Enemy is voting...</h3>
      {/if}
    </div>

</dialog>

<style>
  dialog {
    background: #fdfaf6;
    background-image: var(--paper-texture), linear-gradient(180deg, #fdfaf6 0%, #e8f0e6 100%);
    border: 4px solid #8fb996;
    box-shadow: 0 10px 25px rgba(143, 185, 150, 0.3);
    border-radius: 16px 16px 24px 24px;
    color: #4a5d4e;
    font-family: 'Quicksand', sans-serif;
    z-index: 100;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    padding: 2rem;
    max-width: 500px;
    text-align: center;
  }
  
  dialog::backdrop {
    background: rgba(44, 62, 46, 0.6);
    backdrop-filter: blur(3px);
  }

 .container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
 }

 .enemy-vote {
   font-size: 1.2rem;
   color: #5c8065;
   font-weight: 700;
   text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.8);
   margin-bottom: 1rem;
   display: block;
 }

 .enemy-voting-text {
   color: #5c8065;
   font-size: 1.8rem;
   text-transform: uppercase;
   letter-spacing: 2px;
   text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.8);
   margin: 2rem 0;
 }

 button {
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: #2c3e2e;
  padding: 12px 24px;
  border-radius: 8px;
  background: linear-gradient(180deg, #ffffff 0%, #e8f0e6 100%);
  outline: none;
  border: 2px solid #8fb996;
  box-shadow: 0 4px 6px rgba(143, 185, 150, 0.15);
  cursor: pointer;
  transition: all 0.2s ease-out;
  text-transform: uppercase;
  letter-spacing: 1px;
 }

 button:hover {
  background: linear-gradient(180deg, #fdfaf6 0%, #d4e5d1 100%);
  border-color: #5c8065;
  color: #2c3e2e;
  box-shadow: 0 4px 10px rgba(143, 185, 150, 0.3);
  transform: translateY(-2px);
 }
 
 .give-up-btn {
   margin-top: 1rem;
   background: linear-gradient(180deg, #ffe6e6 0%, #ffcccc 100%);
   border-color: #ff9999;
   color: #cc3333;
 }

 .give-up-btn:hover {
   background: linear-gradient(180deg, #ffcccc 0%, #ffb3b3 100%);
   border-color: #ff6666;
   box-shadow: 0 4px 10px rgba(255, 102, 102, 0.3);
   color: #990000;
 }

 .modeName {
  color: #5c8065;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 1.4rem;
  margin-bottom: 15px;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.8);
  border-bottom: 2px solid #b5d5b7;
  padding-bottom: 5px;
  width: 100%;
 }

 .modeBet {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(253, 250, 246, 0.8);
  background-image: var(--paper-texture);
  border: 2px dashed #8fb996;
  padding: 1.5rem 1rem;
  border-radius: 16px;
  width: 100%;
  box-shadow: 0 2px 6px rgba(143, 185, 150, 0.1);
 }

 .bets {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 15px;
  margin-top: 10px;
 }

 h3 {
   margin: 0;
 }
</style>