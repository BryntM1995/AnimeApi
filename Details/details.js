const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('id');
const ANIME_URL = `https://api.jikan.moe/v4/anime/${myParam}/full`;
const ANIME_EPISODES = `https://api.jikan.moe/v4/anime/${myParam}/videos/episodes?page=1`;
let anime;
let episodes;
// to build page.
let mainProfilePic = document.querySelector('#portrait');
const animeStatus = document.querySelector('#animeStatus');
const animeType = document.querySelector('#animetype');
const mainAnimeTitle = document.querySelector('#mainAnimeTitle');
const animeSynopsis = document.querySelector('#animeSynopsis');
const animeScore = document.querySelector('#animeScore');
const animeRating = document.querySelector('#animeRating');
const scoredLikes = document.querySelector("#scoredLikes");
const listOfEpisodesRow = document.querySelector('#listOfEpisodes');

async function getAllAnimeInfo(URL) {
    let response = await fetch(URL);
    let res = await response.json();
    anime = {...res};
}
async function getAllAnimeEpisodes(URL) {
    let response = await fetch(URL);
    let res = await response.json();
    episodes = {...res};
}
async function DrawAnimes(URL, URL_EPISODES) {
    await getAllAnimeInfo(URL)
    await getAllAnimeEpisodes(URL_EPISODES);
    console.log(episodes)

    //setting attributes
    mainProfilePic.setAttribute('src',anime.data.images.webp.image_url);
    let currentAnimeStatus = anime.data.airing ?
     `<i class="fa-solid fa-play"></i> In emision` : `<i class="fa-solid fa-play"></i> Finalized`;
    animeStatus.innerHTML = currentAnimeStatus;
    animeType.textContent = `Type: ${anime.data.type}`;
    mainAnimeTitle.textContent = anime.data.title;
    animeSynopsis.textContent = anime.data.synopsis;
    animeScore.innerHTML = `<i class="fa-solid fa-star"> ${anime.data.score}`;
    scoredLikes.textContent = `${anime.data.scored_by}`;
    animeRating.innerHTML =`<i class="fa-solid fa-film"></i> ${anime.data.rating}`;

    //bulding list of episodes

    episodes.data.forEach(element => {
        let colDiv = document.createElement('div');
        let colImg = document.createElement('img');
        let capInfoDiv = document.createElement('div');
        let animeTitle = document.createElement('strong');
        let episodeNumber = document.createElement('a');


        // setting classes and id's
        colDiv.className ="col mb-3 colVideos d-flex flex-wrap";
        colImg.id = "episodePreview";
        capInfoDiv.className ="capInfo";
        episodeNumber.className ="capLinks";
        //setting attributes..
        animePhoto = element.images.jpg.image_url === null ? "../animeMIx.jpg" : element.images.jpg.image_url; 
        colImg.setAttribute('src', animePhoto);
        animeTitle.textContent = element.title;
        episodeNumber.textContent = element.episode;
        console.log(element.episode);
        episodeNumber.setAttribute('href', `../Play/play.html?id=${element.mal_id}`);
        episodeNumber.setAttribute('target', 'blank');
        //appeding...
        colDiv.appendChild(colImg);
        capInfoDiv.appendChild(animeTitle);
        capInfoDiv.appendChild(episodeNumber);
        colDiv.appendChild(capInfoDiv);
        listOfEpisodesRow.appendChild(colDiv);
    });
};
window.onload = DrawAnimes(ANIME_URL , ANIME_EPISODES);

/*<div class="col mb-3 colVideos d-flex flex-wrap">
<img id="episodePreview" src="VID-20200709-WA0081.mp4" controls muted poster="animeMix.jpg"></img>
<div class="capInfo">
    <strong>Anime title</strong>
    <p> Episode 1</p>
</div>
</div>

"https://myanimelist.net/anime/34566/Boruto__Naruto_Next_Generations/episode/285"
cardBtn.setAttribute('href', `details.html?id=${element.mal_id}`);
    cardBtn.setAttribute('target', 'blank');
*/
