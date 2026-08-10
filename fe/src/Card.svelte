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

    function handleVideoLoaded() {
        if (video && video.readyState >= 1) {
            video.currentTime = 0.1;
        }
    }

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
    <!-- <div class="card-header">
        {cardTitle}
    </div> -->
    <div class="card-image">
        {#await import(`./assets/${animation}.mp4`)}
            <!-- Loading -->
        {:then { default: anim }}
            <video class="card-video" bind:this={video} muted preload="auto" playsinline on:loadedmetadata={handleVideoLoaded}>
                <source src={anim} type="video/mp4">
            </video>
        {:catch}
            {#await import(`./assets/${animation}.jpg`) then { default: img }}
                <img class="card-video" src={img} alt={cardTitle} />
            {/await}
        {/await}
    </div>
    <div class="description">
        <div class="card-name-title">{cardTitle}</div>
        <div class="skill-name-title">{descriptionTitle}</div>
        <div class="skill-desc-text">{description}</div>
    </div>
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
    height: var(--card-height);
    background: var(--card-background);
    box-sizing: border-box;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    border: 1px solid #333333;
    border-radius: 2px;
    padding: 10px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
 }

 .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.8);
 }

 .card-header {
    font-weight: 700;
    font-size: 1.1rem;
    text-align: center;
    padding: 8px 5px;
    color: var(--letters-color);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
    flex-shrink: 0;
 }

 .card-image {
    width: 100%;
    background: #111111;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    border: 6px solid var(--frame-color);
    box-shadow: inset 0 0 10px rgba(0,0,0,0.8), 0 4px 8px rgba(0,0,0,0.5);
    margin-bottom: 12px;
 }

 .card-video {
   width: 100%;
   height: calc(var(--card-height) * 0.400);
   object-fit: cover;
   display: block;
}

 .description {
    text-align: left;
    padding: 0 8px;
    margin: 0 0 10px 0;
    font-size: 0.85rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    line-height: 1.4;
    color: #cccccc;
    border-left: 2px solid var(--accent-color);
    overflow-x: hidden;
    overflow-y: auto;
    min-height: 0;
 }

 /* Custom scrollbar for description to keep it neat */
 .description::-webkit-scrollbar {
    width: 4px;
 }
 .description::-webkit-scrollbar-track {
    background: transparent;
 }
 .description::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 2px;
 }

 .card-name-title {
    color: #f0f0f0;
    font-size: 0.95rem;
    margin-bottom: 2px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-family: 'Playfair Display', serif;
    font-weight: bold;
    flex-shrink: 0;
    word-break: break-word;
    hyphens: auto;
 }

 .skill-name-title {
    color: #aaaaaa;
    margin-bottom: 4px;
    font-style: italic;
    flex-shrink: 0;
    word-break: break-word;
 }

 .skill-desc-text {
    flex-shrink: 0;
    word-break: break-word;
 }

 .card-stats {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 8px;
    flex-shrink: 0;
    border-top: 1px solid #333333;
    padding-top: 8px;
 }

 .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #444444;
    padding: 4px 0;
    flex: 1;
    background: #1a1a1a;
    transition: all 0.3s ease;
 }

 .stat > h4 {
    margin: 0;
    font-size: 0.75rem;
    color: #aaaaaa;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
 }

 .stat > p {
    margin: 2px 0 0 0;
    font-weight: 400;
    font-size: 1.2rem;
    color: #f0f0f0;
    font-family: 'Georgia', serif;
 }

 .activeStat {
    background: var(--active-stat-color);
    border-color: var(--accent-color);
    box-shadow: inset 0 0 0 1px var(--accent-color);
 }

 .activeStat > h4 {
    color: var(--accent-color);
 }

 .activeStat > p {
    color: #ffffff;
    font-weight: 700;
 }

 @media (max-width: 900px), (max-height: 800px) {
    .card { padding: 6px; }
    .card-image { border-width: 4px; margin-bottom: 6px; }
    .card-video { height: calc(var(--card-height) * 0.35); }
    .description { font-size: 0.7rem; padding: 0 4px; margin-bottom: 4px; }
    .card-name-title { font-size: 0.8rem; }
    .stat > h4 { font-size: 0.6rem; }
    .stat > p { font-size: 0.9rem; }
 }

 @media (max-width: 600px), (max-height: 600px) {
    .card { padding: 4px; }
    .card-image { border-width: 3px; margin-bottom: 4px; }
    .card-video { height: calc(var(--card-height) * 0.32); }
    .description { font-size: 0.55rem; padding: 0 2px; margin-bottom: 2px; }
    .card-name-title { font-size: 0.65rem; }
    .card-stats { padding-top: 4px; gap: 4px; }
    .stat > h4 { font-size: 0.5rem; }
    .stat > p { font-size: 0.7rem; }
 }
</style>