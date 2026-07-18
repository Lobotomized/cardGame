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
        <video height="150px" bind:this={video} muted preload="auto">
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
    height: 365px;
    background: linear-gradient(180deg, #2a1f1a 0%, #110c08 100%);
    border: 2px solid #5c4322;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.9), 0 0 15px rgba(212, 175, 55, 0.1) inset;
    cursor: pointer;
    border-radius: 12px;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    overflow: hidden;
    position: relative;
    font-family: 'Quicksand', sans-serif;
 }

 .card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.95), 0 0 20px rgba(255, 215, 0, 0.25) inset;
    border-color: #ffd700;
 }

 .card-header {
    font-weight: 700;
    font-size: 1.1rem;
    text-align: center;
    padding: 8px 5px;
    background: linear-gradient(90deg, #1a100a, #3d2a13, #1a100a);
    border-bottom: 2px solid #5c4322;
    color: #ffd700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0;
 }

 .card-image {
    width: 100%;
    border-bottom: 2px solid #5c4322;
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.6) inset;
 }

 video {
    width: 100%;
    object-fit: cover;
    display: block;
 }

 .description {
    text-align: center;
    padding: 10px 12px;
    margin: 0;
    font-weight: 600;
    font-size: 0.9rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: rgba(15, 10, 6, 0.6);
    border-bottom: 2px solid #5c4322;
    line-height: 1.4;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
 }

 .description b {
    color: #ffd700;
    font-size: 1rem;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
 }

 .card-stats {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 8px 10px;
    background: linear-gradient(180deg, #1a100a 0%, #0a0604 100%);
    gap: 8px;
 }

 .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #5c4322;
    padding: 4px 0;
    flex: 1;
    border-radius: 6px;
    background: rgba(42, 31, 26, 0.6);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) inset;
    transition: all 0.3s ease;
 }

 .stat > h4 {
    margin: 0;
    font-size: 0.75rem;
    color: #b38b14;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 700;
 }

 .stat > p {
    margin: 2px 0 0 0;
    font-weight: 700;
    font-size: 1.2rem;
    color: #fdf5e6;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
 }

 .activeStat {
    background: linear-gradient(180deg, #5c4322 0%, #3d2a13 100%);
    border-color: #ffd700;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.4), 0 0 5px rgba(255, 215, 0, 0.4) inset;
 }

 .activeStat > h4 {
    color: #ffffff;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.9);
 }

 .activeStat > p {
    color: #ffffff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9), 0 0 8px rgba(255, 215, 0, 0.6);
 }
</style>