<script lang="ts">
import type { stateType } from "./types/State";

export let socket;
export let state:stateType;

$:myTurn = state.turn === state.meRef;
$:isMyTurn = myTurn ? "Your turn" : "Enemies turn";


const bettingSteps  = [0,1,2,3,4,5]
const modes:string[] = [
  'Intelligence',
  'Agility',
  'Strength'
]
</script>

<dialog open={state.mode === 'betting'}>
    <div class="container">
        {#if myTurn}
        {#if !state?.koeficient?.value || state.koeficient.value < 5}
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
    background: #1e1e1e;
    border: 1px solid #333333;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    border-radius: 2px;
    color: #f0f0f0;
    font-family: 'Inter', sans-serif;
    z-index: 100;
    position: absolute;
    left: 0;
    right: 0;
    top: 10vh;
    bottom: auto;
    margin: 0 auto;
    padding: 2rem;
    width: 90vw;
    max-width: 500px;
    text-align: center;
    box-sizing: border-box;
  }
  
  dialog::backdrop {
    background: rgba(18, 18, 18, 0.8);
    backdrop-filter: blur(2px);
  }

 .container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
 }

 .enemy-vote {
   font-size: 1.1rem;
   color: #cccccc;
   font-weight: 600;
   margin-bottom: 1rem;
   display: block;
   font-family: 'Playfair Display', serif;
 }

 .enemy-voting-text {
   color: #f0f0f0;
   font-size: 1.5rem;
   text-transform: uppercase;
   letter-spacing: 2px;
   margin: 2rem 0;
   font-family: 'Playfair Display', serif;
 }

 button {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  color: #121212;
  padding: 12px 24px;
  border-radius: 2px;
  background: #f0f0f0;
  outline: none;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease-out;
  text-transform: uppercase;
  letter-spacing: 1px;
 }

 button:hover {
  background: #ffffff;
  color: #121212;
  transform: translateY(-2px);
 }
 
 .give-up-btn {
   margin-top: 1rem;
   background: #1e1e1e;
   border-color: #ff5555;
   color: #ff5555;
 }

 .give-up-btn:hover {
   background: #ff5555;
   color: #ffffff;
 }

 .modeName {
  color: #f0f0f0;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 1.2rem;
  margin-bottom: 15px;
  border-bottom: 1px solid #333333;
  padding-bottom: 5px;
  width: 100%;
  font-family: 'Playfair Display', serif;
 }

 .modeBet {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #121212;
  border: 1px solid #333333;
  padding: 1.5rem 1rem;
  border-radius: 2px;
  width: 100%;
 }

 .bets {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 15px;
  margin-top: 10px;
  flex-wrap: wrap;
 }

 h3 {
   margin: 0;
 }

 @media (max-width: 600px) {
   dialog {
     padding: 1rem;
   }
   .bets {
     gap: 0.8rem;
   }
   .modeBet {
     padding: 1rem 0.5rem;
   }
   button {
     padding: 8px 12px;
     font-size: 0.8rem;
   }
   .enemy-voting-text {
     font-size: 1.2rem;
   }
 }
</style>