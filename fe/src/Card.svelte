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
        console.log('here')
        video.play();
    }

    function pauseVideo() {
        video.pause();
        video.currentTime = 0; // Reset to start on pause
    }

</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:mouseenter={playVideo} on:mouseleave={pauseVideo} class="card" >
    <div class="card-header">
        {cardTitle}
    </div>
    <div class="card-image">
        <video height="130px" bind:this={video} muted preload="auto">
            {#await import(`./assets/${animation}.mp4`) then { default: anim }}
                <source src={anim} type="video/mp4">
            {/await}
        </video>
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
 :root{
    --umnojitel:5;
 }

 .card {
    color: var(--letters-color);
    display: flex;
    flex-direction: column;
    width: calc(45px * var(--umnojitel));
    height: 400px;
    background: #fdfaf6;
    background-image: var(--paper-texture), linear-gradient(to bottom, #fdfaf6, #e8f0e6);
    border: 4px solid #8fb996;
    box-shadow: 0 4px 12px rgba(143, 185, 150, 0.25);
    cursor: pointer;
    border-radius: 12px 12px 24px 24px;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    overflow: hidden;
    position: relative;
    font-family: 'Quicksand', sans-serif;
 }

 .card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 16px rgba(143, 185, 150, 0.4);
    border-color: #5c8065;
 }

 .card-header {
    font-weight: 800;
    font-size: 1.1rem;
    text-align: center;
    padding: 8px 5px;
    background: transparent;
    border-bottom: 2px dashed #b5d5b7;
    color: #4a5d4e;
    text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.8);
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
    color: #8fb996;
    font-size: 0.9em;
 }

 .card-image {
    width: 100%;
    border-bottom: 2px dashed #b5d5b7;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
 }

 video {
    width: 100%;
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
    border-bottom: 2px dashed #b5d5b7;
    line-height: 1.3;
    color: #4a5d4e;
    overflow-y: auto;
 }

 /* Custom scrollbar for description */
 .description::-webkit-scrollbar {
    width: 4px;
 }
 .description::-webkit-scrollbar-track {
    background: rgba(232, 240, 230, 0.8);
 }
 .description::-webkit-scrollbar-thumb {
    background: #b5d5b7;
    border-radius: 2px;
 }
 .description::-webkit-scrollbar-thumb:hover {
    background: #8fb996;
 }

 .description b {
    color: #2c3e2e;
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
    border: 2px solid #b5d5b7;
    padding: 4px 0;
    flex: 1;
    border-radius: 12px;
    background: rgba(255,255,255,0.7);
    box-shadow: 0 2px 4px rgba(143, 185, 150, 0.1);
    transition: all 0.3s ease;
 }

 .stat > h4 {
    margin: 0;
    font-size: 0.75rem;
    color: #8fb996;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
 }

 .stat > p {
    margin: 2px 0 0 0;
    font-weight: 700;
    font-size: 1.2rem;
    color: #4a5d4e;
 }

 .activeStat {
    background: rgba(212, 229, 209, 0.9);
    border-color: #8fb996;
    box-shadow: inset 0 0 8px rgba(255,255,255,0.8), 0 0 8px rgba(143, 185, 150, 0.4);
 }

 .activeStat > h4 {
    color: #2c3e2e;
 }

 .activeStat > p {
    color: #2c3e2e;
 }
</style>