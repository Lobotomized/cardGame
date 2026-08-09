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
  let hasPlayedAbility = false;
  let hasBiddedInt = false;
  let selectedBid = '';

  const sphinxCard: CardType = {
    cardTitle: "Sphinx",
    intelligence: 7,
    agility: 5,
    strength: 6,
    descriptionTitle: "Riddle",
    description: "If you have more intelligence enemy loses all stats",
    animation: "sphinx"
  };

  const inquisitorCard: CardType = {
    cardTitle: "Inquisitor",
    intelligence: 5,
    strength: 5,
    agility: 8,
    descriptionTitle: "Intelligence Trap",
    description: "If you have less intelligence than the enemy, the enemy loses all stats.",
    animation: "inquisitor"
  };

  const exampleCard: CardType = {
    intelligence: 12,
    strength: 2,
    agility: 2,
    description: "All cards in your hand get +1 for the game mode stat",
    descriptionTitle: "Science!!!",
    animation: "scientist",
    cardTitle: "Scientist"
  };

  const enemyCard: CardType = {
    intelligence: 3,
    strength: 8,
    agility: 12,
    description: "",
    descriptionTitle: "No special",
    animation: "boxer",
    cardTitle: "Boxer"
  };

  const dummyCard: CardType = {
    intelligence: 2,
    strength: 2,
    agility: 2,
    description: "All cards in the enemy hand lose 1 from the game mode stat",
    descriptionTitle: "Fear",
    animation: "leviathan",
    cardTitle: "Leviathan"
  };

  let steps = [
    {
      title: "Welcome to the Exhibition",
      content: "This tutorial will teach you how to evaluate the artworks (cards) and outwit your opponent."
    },
    {
      title: "Understanding Cards",
      content: "Each card has three main stats: Intelligence (Brain), Strength (Fist), and Agility (Foot). These stats are used in Clash phases depending on the current game mode."
    },
    {
      title: "Card Abilities & Timing",
      content: "Special abilities trigger in order: first the card played first, then the second. The enemy played Sphinx first. Play Inquisitor and watch the abilities resolve!"
    },
    {
      title: "The Bidding Phase",
      content: "At the start of each round, players bid on the game mode. The winner chooses the mode. Look at your hand below and bid on the property where you are strongest to move forward!"
    },
    {
      title: "Your Turn to Play",
      content: "Let's say the current mode is Intelligence. Select Scientist from your hand to defeat Boxer!"
    },
    {
      title: "The Clash",
      content: "When both curators play a card, they clash! Let's see how Scientist fares against Boxer in a match of Intelligence."
    },
    {
      title: "Victory",
      content: "Because the game mode was Intelligence, Scientist (12) defeated Boxer (3)! The winner takes both cards to their score."
    }
  ];

  let boardState: any = null;
  let myHand = [dummyCard, exampleCard];
  let showBiddingMock = false;

  const biddingHand = [
    exampleCard,
    {
      ...exampleCard,
      cardTitle: "Professor",
      intelligence: 10,
      strength: 1,
      agility: 3,
      animation: "professor"
    },
    {
      ...exampleCard,
      cardTitle: "Student",
      intelligence: 8,
      strength: 4,
      agility: 4,
      animation: "student"
    },
    {
      ...enemyCard,
      cardTitle: "Bully",
      intelligence: 2,
      strength: 9,
      agility: 9,
      animation: "boxer"
    },
    dummyCard
  ];

  // Dummy socket to intercept the play action
  const dummySocket = {
    emit: (event: string, data: any) => {
      if (event === 'move') {
        if (step === 2) {
          if (data.cardIndex === 0) {
            hasPlayedAbility = true;
            // We set isAnimating true so user can't click next during the sequence
            isAnimating = true;
            
            // Initial state (both cards on board but NOT clashing yet)
            // We set lastTrick to null so Board.svelte stays in 'idle' state 
            // and simply shows the cards on the board.
            boardState = {
              player1: inquisitorCard,
              player2: sphinxCard,
              lastTrick: null,
              publicDeck: Array(10).fill({})
            };

            // Step 1: Sphinx effect (still NOT clashing, just updating stats)
            setTimeout(() => {
              const modifiedInquisitor = { ...inquisitorCard, intelligence: 0, strength: 0, agility: 0 };
              boardState = {
                player1: modifiedInquisitor,
                player2: sphinxCard,
                lastTrick: null,
                publicDeck: Array(10).fill({})
              };
              steps[2].content = "Sphinx triggered first! Since it has more Intelligence (7 vs 5), your Inquisitor lost all stats.";
              steps = [...steps];
            }, 2000);

            // Step 2: Inquisitor effect & CLASH
            setTimeout(() => {
              const modifiedInquisitor = { ...inquisitorCard, intelligence: 0, strength: 0, agility: 0 };
              const modifiedSphinx = { ...sphinxCard, intelligence: 0, strength: 0, agility: 0 };
              // NOW we set lastTrick, which will trigger Board.svelte's clash animation
              boardState = {
                player1: modifiedInquisitor,
                player2: modifiedSphinx,
                lastTrick: {
                  player1: modifiedInquisitor,
                  player2: modifiedSphinx,
                  winnerCard: null // tie
                },
                publicDeck: Array(10).fill({})
              };
              steps[2].content = "Now Inquisitor triggers! Since it had less Intelligence than Sphinx (0 vs 7), Sphinx also lost all stats. It's a tie!";
              steps = [...steps];
              
              // We unlock the UI slightly after the clash animation starts
              setTimeout(() => {
                isAnimating = false;
              }, 2600);
            }, 5000);
          }
        } else if (step === 4) {
          if (data.cardIndex === 1) {
            hasPlayed = true;
            isAnimating = true;
            nextStep(); // Move to step 5: The Clash
            
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
              nextStep(); // Move to step 6: Victory
            }, 2600); // Wait for the full clash and resolve animation
            
          } else {
            alert("Try playing Scientist (the second card) to win the Intelligence clash!");
          }
        }
      }
    }
  };

  $: {
    showBiddingMock = step === 3;
    
    if (step === 2 && !hasPlayedAbility) {
      boardState = {
        player1: null,
        player2: sphinxCard,
        lastTrick: null,
        publicDeck: Array(10).fill({})
      };
    } else if (step === 4 && !hasPlayed) {
      boardState = {
        player1: null,
        player2: enemyCard,
        lastTrick: null,
        publicDeck: Array(10).fill({})
      };
    } else if (step === 5 && !hasPlayed) {
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
    } else if (step === 6) {
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
    } else if (step < 4 && step !== 2) {
      boardState = null;
      hasPlayed = false;
    }
  }

  function nextStep() {
    if (step === 2 && !hasPlayedAbility) {
      alert("Please play Inquisitor to see the abilities resolve!");
      return;
    }
    if (step === 3 && !hasBiddedInt) {
      alert("Please bid on Intelligence (INT) as you have the most Intelligence cards!");
      return;
    }
    if (step === 4 && !hasPlayed) {
      alert("Please play a card to continue!");
      return;
    }
    if (step < steps.length - 1) {
      step++;
    } else {
      dispatch('close');
    }
  }

  function handleBid(mode: string) {
    selectedBid = mode;
    if (mode === 'INT') {
      hasBiddedInt = true;
      nextStep();
    } else {
      alert("Look closely at your hand! You have more Intelligence cards. Bid on INT!");
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

      <div class="visuals" class:highlight-intelligence={step === 4}>
        {#if step === 0}
          <div class="intro-cards">
            <Card card={sphinxCard} mode={{attribute: 'intelligence', isReversed: false}} />
            <Card card={exampleCard} mode={{attribute: 'intelligence', isReversed: false}} />
            <Card card={inquisitorCard} mode={{attribute: 'intelligence', isReversed: false}} />
          </div>
        {:else if step === 1}
          <div class="showcase">
            <Card card={exampleCard} mode={{attribute: 'intelligence', isReversed: false}} />
          </div>
        {:else if step === 2}
          <div class="interactive-showcase">
            <div class="board-wrapper">
              {#if boardState}
                <Board board={boardState} mode={{attribute: 'intelligence', isReversed: false}} meRef="player1" bind:isAnimating={isAnimating} />
              {/if}
            </div>
            {#if !hasPlayedAbility}
              <div class="hand-wrapper">
                <Hand socket={dummySocket} cards={[inquisitorCard]} mode={{attribute: 'intelligence', isReversed: false}} isMyTurn={true} bind:isAnimating={isAnimating} />
              </div>
            {/if}
          </div>
        {:else if step === 3}
          <div class="interactive-showcase">
            <div class="bidding-showcase">
              <div class="mock-vote-container">
                <span class="enemy-vote">Enemy voted for agility with coefficient 1 to 1 </span>
                <div class="bets">
                  <div class="modeBet" class:selected={selectedBid === 'INT'}>
                    <h3 class="modeName">INT</h3>
                    <button class="mock-btn" class:active-bid={selectedBid === 'INT'} on:click={() => handleBid('INT')}>Bet 2 to 1</button>
                  </div>
                  <div class="modeBet" class:selected={selectedBid === 'STR'}>
                    <h3 class="modeName">STR</h3>
                    <button class="mock-btn" class:active-bid={selectedBid === 'STR'} on:click={() => handleBid('STR')}>Bet 2 to 1</button>
                  </div>
                </div>
                <button class="give-up-btn mock-btn" on:click={() => handleBid('GIVE_UP')}>Give up</button>
              </div>
            </div>
            <div class="hand-wrapper">
              <Hand socket={dummySocket} cards={biddingHand} mode={{attribute: 'intelligence', isReversed: false}} isMyTurn={false} bind:isAnimating={isAnimating} />
            </div>
          </div>
        {:else if step === 4}
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
        {:else if step === 5 || step === 6 || step === 7}
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
    width: 100%;
    height: 100%;
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
    overflow-x: hidden;
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
  
  /* Highlight effect for the target stat */
  :global(.visuals.highlight-intelligence .stat:nth-child(2)) {
    animation: pulse-highlight 2s infinite;
    box-shadow: 0 0 15px rgba(201, 162, 39, 0.6);
    border-color: var(--accent-color, #c9a227);
    z-index: 10;
  }

  @keyframes pulse-highlight {
    0% { transform: scale(1); box-shadow: 0 0 10px rgba(201, 162, 39, 0.4); }
    50% { transform: scale(1.1); box-shadow: 0 0 20px rgba(201, 162, 39, 0.8); }
    100% { transform: scale(1); box-shadow: 0 0 10px rgba(201, 162, 39, 0.4); }
  }

  .showcase {
    transform: scale(1.8);
  }

  .intro-cards {
    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: center;
    transform: scale(1.2);
    flex-wrap: wrap;
    width: 100%;
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

  /* Mock Bidding Styles */
  .bidding-showcase {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mock-vote-container {
    background: #1e1e1e;
    border: 1px solid #333333;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    border-radius: 2px;
    color: #f0f0f0;
    font-family: 'Inter', sans-serif;
    padding: 2rem;
    width: 90vw;
    max-width: 500px;
    text-align: center;
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

  .bets {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 15px;
    margin-top: 10px;
    flex-wrap: wrap;
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
    flex: 1;
    min-width: 120px;
  }

  .modeBet.selected {
    border-color: #c9a227;
    box-shadow: 0 0 15px rgba(201, 162, 39, 0.2);
  }

  .modeName {
    color: #f0f0f0;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 1.2rem;
    margin: 0 0 15px 0;
    border-bottom: 1px solid #333333;
    padding-bottom: 5px;
    width: 100%;
    font-family: 'Playfair Display', serif;
  }

  .mock-btn {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    color: #121212;
    padding: 12px 24px;
    border-radius: 2px;
    background: #f0f0f0;
    border: 1px solid #f0f0f0;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.2s;
  }

  .mock-btn:hover {
    background: #ffffff;
    transform: translateY(-1px);
  }

  .mock-btn.active-bid {
    background: #c9a227;
    border-color: #c9a227;
    color: #121212;
  }

  .give-up-btn {
    margin-top: 1rem;
    background: #1e1e1e;
    border-color: #ff5555;
    color: #ff5555;
    align-self: center;
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

    .intro-cards {
      transform: scale(0.9);
      gap: 10px;
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
