<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Card from './Card.svelte';
  import Board from './Board.svelte';
  import Hand from './Hand.svelte';
  import type { CardType } from './types/Card';

  const dispatch = createEventDispatcher();

  let step = 0;
  let isAnimating = false;
  let hasPlayed = false;

  const exampleCard: CardType = {
    intelligence: 8,
    strength: 5,
    agility: 6,
    description: "The Scientist uses superior intelligence to outsmart brute force.",
    descriptionTitle: "Calculation",
    animation: "scientist",
    cardTitle: "The Scientist"
  };

  const enemyCard: CardType = {
    intelligence: 2,
    strength: 9,
    agility: 4,
    description: "The Boxer relies purely on physical strength.",
    descriptionTitle: "Haymaker",
    animation: "boxer",
    cardTitle: "The Boxer"
  };

  const dummyCard: CardType = {
    intelligence: 3,
    strength: 3,
    agility: 3,
    description: "A simple artwork with no special traits.",
    descriptionTitle: "Ordinary",
    animation: "philosopher",
    cardTitle: "The Ordinary"
  };

  const steps = [
    {
      title: "Welcome to the Exhibition",
      content: "This tutorial will teach you how to evaluate the artworks (cards) and outwit your opponent."
    },
    {
      title: "Understanding Cards",
      content: "Each card has three main stats: Intelligence (Brain), Strength (Fist), and Agility (Foot). These stats are used in Clash phases depending on the current game mode."
    },
    {
      title: "Card Abilities",
      content: "Many cards have special abilities (shown at the bottom placard). Some abilities trigger under certain conditions, completely turning the tide of the battle!"
    },
    {
      title: "Your Turn to Play",
      content: "The current mode is Intelligence. Select The Scientist from your hand to defeat The Boxer!"
    },
    {
      title: "The Clash",
      content: "When both curators play a card, they clash! Let's see how The Scientist fares against The Boxer in a match of Intelligence."
    },
    {
      title: "Victory",
      content: "Because the game mode was Intelligence, The Scientist (8) defeated The Boxer (2)! The winner takes both cards to their score."
    }
  ];

  let boardState: any = null;
  let myHand = [dummyCard, exampleCard];

  // Dummy socket to intercept the play action
  const dummySocket = {
    emit: (event: string, data: any) => {
      if (event === 'move' && step === 3) {
        if (data.cardIndex === 1) {
          hasPlayed = true;
          isAnimating = true;
          nextStep(); // Move to step 4: The Clash
          
          // Trigger clash
          boardState = {
            player1: exampleCard,
            player2: enemyCard,
            lastTrick: {
              player1: exampleCard,
              player2: enemyCard,
              winnerCard: exampleCard
            },
            publicDeck: Array(10).fill({})
          };
          
          setTimeout(() => {
            isAnimating = false;
            nextStep(); // Move to step 5: Victory
          }, 2600); // Wait for the full clash and resolve animation
          
        } else {
          alert("Try playing The Scientist (the second card) to win the Intelligence clash!");
        }
      }
    }
  };

  $: {
    if (step === 3 && !hasPlayed) {
      boardState = {
        player1: null,
        player2: enemyCard,
        lastTrick: null,
        publicDeck: Array(10).fill({})
      };
    } else if (step === 4 && !hasPlayed) {
      // Fallback if accessed via next button without playing
      boardState = {
        player1: exampleCard,
        player2: enemyCard,
        lastTrick: {
          player1: exampleCard,
          player2: enemyCard,
          winnerCard: exampleCard
        },
        publicDeck: Array(10).fill({})
      };
    } else if (step === 5) {
      boardState = {
        player1: null,
        player2: null,
        lastTrick: {
          player1: exampleCard,
          player2: enemyCard,
          winnerCard: exampleCard
        },
        publicDeck: Array(10).fill({})
      };
    } else if (step < 3) {
      boardState = null;
      hasPlayed = false;
    }
  }

  function nextStep() {
    if (step === 3 && !hasPlayed) {
      alert("Please play a card to continue!");
      return;
    }
    if (step < steps.length - 1) {
      step++;
    } else {
      dispatch('close');
    }
  }

  function prevStep() {
    if (step > 0) {
      step--;
    }
  }

</script>

<div class="tutorial-overlay">
  <div class="tutorial-container">
    <div class="header">
      <h2 class="title">{steps[step].title}</h2>
      <button class="close-btn" on:click={() => dispatch('close')}>&times;</button>
    </div>
    
    <div class="content-area">
      <p class="description">{steps[step].content}</p>

      <div class="visuals">
        {#if step === 1 || step === 2}
          <div class="showcase">
            <Card card={exampleCard} mode={{attribute: 'intelligence', isReversed: false}} />
          </div>
        {:else if step === 3}
          <div class="interactive-showcase">
            <div class="board-wrapper">
              {#if boardState}
                <Board board={boardState} mode={{attribute: 'intelligence', isReversed: false}} meRef="player1" bind:isAnimating={isAnimating} />
              {/if}
            </div>
            <div class="hand-wrapper">
              <Hand socket={dummySocket} cards={myHand} mode={{attribute: 'intelligence', isReversed: false}} isMyTurn={true} bind:isAnimating={isAnimating} />
            </div>
          </div>
        {:else if step === 4 || step === 5}
          <div class="board-showcase">
            {#if boardState}
              <Board board={boardState} mode={{attribute: 'intelligence', isReversed: false}} meRef="player1" bind:isAnimating={isAnimating} />
            {/if}
          </div>
        {/if}
      </div>
    </div>

    <div class="footer">
      <div class="progress">
        {#each steps as _, i}
          <div class="dot" class:active={i === step}></div>
        {/each}
      </div>
      <div class="controls">
        <button class="btn-secondary" disabled={step === 0 || isAnimating} on:click={prevStep}>Previous</button>
        <button class="btn-primary" disabled={isAnimating} on:click={nextStep}>
          {step === steps.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .tutorial-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #121212;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    box-sizing: border-box;
  }

  .tutorial-container {
    background: #121212;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #333333;
    background: #121212;
  }

  .title {
    font-family: 'Playfair Display', serif;
    color: #f0f0f0;
    font-size: 1.8rem;
    margin: 0;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .close-btn {
    background: transparent;
    border: none;
    color: #aaaaaa;
    font-size: 2rem;
    cursor: pointer;
    line-height: 1;
    transition: color 0.2s;
  }

  .close-btn:hover {
    color: #f0f0f0;
  }

  .content-area {
    flex: 1;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    gap: 2rem;
  }

  .description {
    font-family: 'Inter', sans-serif;
    color: #cccccc;
    font-size: 1.2rem;
    line-height: 1.6;
    text-align: center;
    margin: 0;
  }

  .visuals {
    --umnojitel: 2.2;
    --card-height: 180px;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  /* Override Card.svelte font sizes for the tutorial container to prevent overflow when scaling down via CSS variables */
  :global(.visuals .card .description) {
    font-size: 0.6rem !important;
    padding: 0 4px !important;
  }
  :global(.visuals .card .description b) {
    font-size: 0.7rem !important;
  }
  :global(.visuals .card .stat > h4) {
    font-size: 0.5rem !important;
  }
  :global(.visuals .card .stat > p) {
    font-size: 0.9rem !important;
  }
  :global(.visuals .card) {
    padding: 6px !important;
  }
  :global(.visuals .card-image) {
    border-width: 4px !important;
    margin-bottom: 6px !important;
  }

  .showcase {
    transform: scale(1.8);
  }

  .board-showcase {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .interactive-showcase {
    width: 100%;
    height: auto;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    gap: 20px;
  }

  .board-wrapper {
    width: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hand-wrapper {
    width: 100%;
    padding: 10px;
    background: #121212;
    border: 1px solid #333333;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid #333333;
    background: #121212;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .progress {
    display: flex;
    gap: 8px;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #333333;
    transition: background 0.3s;
  }

  .dot.active {
    background: #f0f0f0;
  }

  .controls {
    display: flex;
    gap: 1rem;
  }

  button {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    padding: 0.8rem 1.5rem;
    border-radius: 2px;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.2s;
  }

  .btn-secondary {
    background: transparent;
    border: 1px solid #555555;
    color: #cccccc;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #333333;
    color: #f0f0f0;
  }

  .btn-secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: #f0f0f0;
    border: 1px solid #f0f0f0;
    color: #121212;
  }

  .btn-primary:hover {
    background: #ffffff;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    .showcase {
      transform: scale(1);
    }
    
    .header {
      padding: 1rem;
    }
    
    .title {
      font-size: 1.4rem;
    }
    
    .content-area {
      padding: 1rem;
    }
    
    .description {
      font-size: 1rem;
    }
  }
</style>
