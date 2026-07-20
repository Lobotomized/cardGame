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
    background: #1a1a1a;
    background-image: var(--paper-texture), linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
    border: 4px solid #ffffff;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.8);
    border-radius: 16px 16px 24px 24px;
    color: #ffffff;
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
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(3px);
  }

 .container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
 }

 .enemy-vote {
   font-size: 1.2rem;
   color: #dddddd;
   font-weight: 700;
   text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
   margin-bottom: 1rem;
   display: block;
 }

 .enemy-voting-text {
   color: #ffffff;
   font-size: 1.8rem;
   text-transform: uppercase;
   letter-spacing: 2px;
   text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
   margin: 2rem 0;
 }

 button {
  font-family: 'Quicksand', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 8px;
  background: linear-gradient(180deg, #333333 0%, #111111 100%);
  outline: none;
  border: 2px solid #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: all 0.2s ease-out;
  text-transform: uppercase;
  letter-spacing: 1px;
 }

 button:hover {
  background: linear-gradient(180deg, #555555 0%, #333333 100%);
  border-color: #cccccc;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
 }
 
 .give-up-btn {
   margin-top: 1rem;
   background: linear-gradient(180deg, #500000 0%, #300000 100%);
   border-color: #ff0000;
   color: #ffcccc;
 }

 .give-up-btn:hover {
   background: linear-gradient(180deg, #700000 0%, #500000 100%);
   border-color: #ff5555;
   box-shadow: 0 4px 10px rgba(255, 0, 0, 0.3);
   color: #ffffff;
 }

 .modeName {
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 1.4rem;
  margin-bottom: 15px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
  border-bottom: 2px solid #555555;
  padding-bottom: 5px;
  width: 100%;
 }

 .modeBet {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(30, 30, 30, 0.8);
  background-image: var(--paper-texture);
  border: 2px dashed #777777;
  padding: 1.5rem 1rem;
  border-radius: 16px;
  width: 100%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
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