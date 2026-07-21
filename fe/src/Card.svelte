<script lang="ts">
    import type { CardType } from "./types/Card";
    import type { modeType } from "./types/mode";

    export let card:CardType;
    export let mode: modeType;

    $: animation = card.animation
    $: intelligence = card.intelligence;
    $: description = card.description;
    $: descriptionTitle = card.descriptionTitle;
    $: agility = card.agility;
    $: strength = card.strength;
    $: cardTitle = card.cardTitle
    let video:HTMLVideoElement;

    function playVideo() {
        if (video) {
            video.play().catch(() => {});
        }
    }

    function pauseVideo() {
        if (video) {
            video.pause();
            video.currentTime = 0; // Reset to start on pause
        }
    }

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:mouseenter={playVideo} on:mouseleave={pauseVideo} class="card" >
    <div class="card-header">
        {cardTitle}
    </div>
    <div class="card-image">
        {#await import(`./assets/${animation}.mp4`)}
            <!-- Loading -->
        {:then { default: anim }}
            <video class="card-video" bind:this={video} muted preload="auto">
                <source src={anim} type="video/mp4">
            </video>
        {:catch}
            {#await import(`./assets/${animation}.jpg`) then { default: img }}
                <img class="card-video" src={img} alt={cardTitle} />
            {/await}
        {/await}
    </div>
    <p class="description">
        <b>{descriptionTitle} </b><br/>
        {description}
    </p>
    <div class="card-stats">
        <div class="stat" class:activeStat={mode === 'agility'}>
            <h4>Agi</h4>
            <p>{agility}</p>
        </div>
        <div class="stat" class:activeStat={mode === 'intelligence'}>
            <h4>Int</h4>
            <p>{intelligence}</p>
        </div>
        <div class="stat" class:activeStat={mode === 'strength'}>
            <h4>Str</h4>
            <p>{strength}</p>
        </div>
    </div>
</div>


<style>
 .card {
    color: var(--letters-color);
    display: flex;
    flex-direction: column;
    width: calc(45px * var(--umnojitel));
    min-height: var(--card-height);
    height: 100%;
    background: #1a1a1a;
    background-image: var(--paper-texture), linear-gradient(to bottom, #1a1a1a, #000000);
    border: 4px solid #ffffff;
    box-sizing: border-box;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    border-radius: 12px 12px 24px 24px;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    overflow: hidden;
    position: relative;
    font-family: 'Quicksand', sans-serif;
 }

 .card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 16px rgba(255, 255, 255, 0.2);
    border-color: #cccccc;
 }

 .card-header {
    font-weight: 800;
    font-size: 1.1rem;
    text-align: center;
    padding: 8px 5px;
    background: transparent;
    border-bottom: 2px dashed #555555;
    color: #ffffff;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin: 0;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
 }

 .card-header::before, .card-header::after {
    content: '✧';
    color: #ffffff;
    font-size: 0.9em;
 }

 .card-image {
    width: 100%;
    border-bottom: 2px dashed #555555;
    background: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
 }

 .card-video {
   width: 100%;
   height: calc(var(--card-height) * 0.325);
   object-fit: cover;
   display: block;
}

 .description {
    text-align: center;
    padding: 8px 10px;
    margin: 0;
    font-weight: 600;
    font-size: 0.85rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background: transparent;
    border-bottom: 2px dashed #555555;
    line-height: 1.3;
    color: #dddddd;
    overflow: visible;
 }

 .description b {
    color: #ffffff;
    font-size: 0.95rem;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 1px;
 }

 .card-stats {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 8px 10px;
    background: transparent;
    gap: 8px;
    flex-shrink: 0;
 }

 .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2px solid #555555;
    padding: 4px 0;
    flex: 1;
    border-radius: 12px;
    background: rgba(30, 30, 30, 0.9);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
 }

 .stat > h4 {
    margin: 0;
    font-size: 0.75rem;
    color: #aaaaaa;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
 }

 .stat > p {
    margin: 2px 0 0 0;
    font-weight: 700;
    font-size: 1.2rem;
    color: #ffffff;
 }

 .activeStat {
    background: rgba(255, 255, 255, 0.9);
    border-color: #ffffff;
    box-shadow: inset 0 0 8px rgba(0,0,0,0.8), 0 0 8px rgba(255, 255, 255, 0.4);
 }

 .activeStat > h4 {
    color: #000000;
 }

 .activeStat > p {
    color: #000000;
 }

 @media (max-width: 900px) {
    .card-header {
       font-size: 0.9rem;
       padding: 4px 2px;
    }
    .description {
       font-size: 0.7rem;
       padding: 4px 5px;
    }
    .description b {
       font-size: 0.75rem;
    }
    .card-stats {
       padding: 4px 5px;
       gap: 4px;
    }
    .stat > h4 {
       font-size: 0.6rem;
    }
    .stat > p {
       font-size: 0.9rem;
    }
 }

 @media (max-width: 600px) {
    .card-header {
       font-size: 0.7rem;
       padding: 2px 1px;
    }
    .description {
       font-size: 0.55rem;
       padding: 2px 3px;
       line-height: 1.1;
    }
    .description b {
       font-size: 0.6rem;
       margin-bottom: 2px;
    }
    .card-stats {
       padding: 2px 3px;
       gap: 2px;
    }
    .stat {
       padding: 2px 0;
       border-radius: 6px;
    }
    .stat > h4 {
       font-size: 0.5rem;
    }
    .stat > p {
       font-size: 0.7rem;
    }
 }
</style>