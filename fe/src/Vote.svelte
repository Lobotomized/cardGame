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
    background: linear-gradient(180deg, #1f140e 0%, #0a0604 100%);
    border: 2px solid #b38b14;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.9), 0 0 10px rgba(212, 175, 55, 0.2) inset;
    border-radius: 8px;
    color: #fdf5e6;
    font-family: 'Quicksand', sans-serif;
    z-index: 10;
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
    background: rgba(0, 0, 0, 0.85);
  }

 .container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
 }

 .enemy-vote {
   font-size: 1.2rem;
   color: #ffd700;
   font-weight: 600;
   text-shadow: 2px 2px 4px rgba(0,0,0,0.9);
   margin-bottom: 1rem;
   display: block;
 }

 .enemy-voting-text {
   color: #ffd700;
   font-size: 1.8rem;
   text-transform: uppercase;
   letter-spacing: 2px;
   text-shadow: 2px 2px 4px rgba(0,0,0,0.9);
   margin: 2rem 0;
 }

 button {
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 6px;
  background: linear-gradient(180deg, #3d2a13 0%, #1a100a 100%);
  outline: none;
  border: 2px solid #b38b14;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.8);
  cursor: pointer;
  transition: all 0.2s ease-out;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
 }

 button:hover {
  background: linear-gradient(180deg, #5c4322 0%, #2a1a0f 100%);
  border-color: #ffd700;
  color: #ffffff;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
  transform: translateY(-2px);
 }
 
 .give-up-btn {
   margin-top: 1rem;
   background: linear-gradient(180deg, #4a1515 0%, #2a0a0a 100%);
   border-color: #cc3333;
   color: #ffcccc;
 }

 .give-up-btn:hover {
   background: linear-gradient(180deg, #6a1a1a 0%, #3a0a0a 100%);
   border-color: #ff4444;
   box-shadow: 0 0 15px rgba(255, 68, 68, 0.4);
 }

 .modeName {
  color: #ffd700;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 1.4rem;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
  border-bottom: 1px solid #5c4322;
  padding-bottom: 5px;
  width: 100%;
 }

 .modeBet {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(15, 10, 6, 0.85);
  border: 1px solid #5c4322;
  padding: 1.5rem 1rem;
  border-radius: 8px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6) inset;
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