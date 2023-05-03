let searchQuery;
let filterQuery;
let currentPage = 1;
let MAIN_URL = `https://api.jikan.moe/v4/anime?page=${currentPage}`;
const inputField = document.querySelector('#inputSearch');
const container = document.querySelector(".row");
const filterSelector = document.querySelector('#selectElement');
const Paginator = document.querySelector('#currentLocation');
const previousPage = document.querySelector('#previousPage');
const nextPage = document.querySelector('#nextPage');
const pagesIndex = document.querySelector('#totalOfPages');
let allAnimes;

//EventListeners
nextPage.addEventListener('click', ()=>{
  ToGoNextPage();
})
previousPage.addEventListener('click', ()=>{
  ToGoPreviousPage();
})
inputField.addEventListener('keyup', (event)=>{
  currentPage = 1;
  Paginator.textContent = 1;
  previousPage.setAttribute('disabled','');
  Paginator.textContent = currentPage;
  (event.code==='Enter'&& inputField.value !=='' ) && getAnimeByName();
})
filterSelector.addEventListener('change', ()=>{
  currentPage = 1
  Paginator.textContent = 1;
  previousPage.setAttribute('disabled','');
  Paginator.textContent = currentPage;
  if(filterSelector.value !== "Choose one...") {
    filterAnimeByType();
  }
  else{
    filterQuery = undefined;
    MAIN_URL = filterQuery === undefined ? 
    `https://api.jikan.moe/v4/anime?page=${currentPage}`:
    `https://api.jikan.moe/v4/anime?page=${currentPage}${filterQuery}`;
    MAIN_URL = searchQuery === undefined ? 
    MAIN_URL : `https://api.jikan.moe/v4/anime?page=${currentPage}${searchQuery}`;
    MAIN_URL = filterQuery === undefined ? MAIN_URL:
    `https://api.jikan.moe/v4/anime?page=${currentPage}${filterQuery}${searchQuery}`;
    console.log(MAIN_URL);
    DrawAnimes(MAIN_URL);
  } 
})
// functions
function ToGoNextPage() {
  currentPage++;
  (currentPage === allAnimes.pagination.last_visible_page) && nextPage.setAttribute('disabled','');
  (currentPage === 2) && previousPage.removeAttribute('disabled');
  (allAnimes.pagination.has_next_page) && previousPage.removeAttribute('disabled');
  Paginator.textContent = currentPage;
  //
  MAIN_URL = filterQuery === undefined ? 
  `https://api.jikan.moe/v4/anime?page=${currentPage}`:
   `https://api.jikan.moe/v4/anime?page=${currentPage}${filterQuery}`;
   //
  MAIN_URL = searchQuery === undefined ? 
  MAIN_URL : `https://api.jikan.moe/v4/anime?page=${currentPage}${searchQuery}`;
  //

  MAIN_URL = filterQuery === undefined ? 
  `https://api.jikan.moe/v4/anime?page=${currentPage}${filterQuery}${searchQuery}`: MAIN_URL;
  DrawAnimes(MAIN_URL);
}
function ToGoPreviousPage() {
  currentPage--;
  ( currentPage !== allAnimes.pagination.last_visible_page) && nextPage.removeAttribute('disabled');
  (currentPage === 1 ) && previousPage.setAttribute('disabled','');
  (allAnimes.pagination.has_next_page) && nextPage.removeAttribute('disabled');
  Paginator.textContent = currentPage;
  pageCount=currentPage;
  MAIN_URL = filterQuery === undefined ? 
  `https://api.jikan.moe/v4/anime?page=${currentPage}`: `https://api.jikan.moe/v4/anime?page=${currentPage}${filterQuery}`;
  MAIN_URL = searchQuery === undefined ? 
  MAIN_URL : `https://api.jikan.moe/v4/anime?page=${currentPage}${searchQuery}`;
  MAIN_URL = filterQuery === undefined ? 
  `https://api.jikan.moe/v4/anime?page=${currentPage}${filterQuery}${searchQuery}`:  MAIN_URL;
  DrawAnimes(MAIN_URL);
}

function getAnimeByName(){
  let inputValue = inputField.value.toLowerCase();
  searchQuery = `&q=${inputValue}`;
  MAIN_URL = filterQuery === undefined ? 
  `https://api.jikan.moe/v4/anime?page=${1}${searchQuery}`: `https://api.jikan.moe/v4/anime?page=${1}${filterQuery}${searchQuery}`;
  DrawAnimes(MAIN_URL);
}
function filterAnimeByType(){
  let selectorValue = filterSelector.value;
  filterQuery = `&type=${selectorValue}`;
  MAIN_URL = searchQuery === undefined ? 
   `https://api.jikan.moe/v4/anime?page=${currentPage}${filterQuery}`:
    `https://api.jikan.moe/v4/anime?page=${1}${filterQuery}${searchQuery}`;
  DrawAnimes(MAIN_URL);
}
//async functions
async function getAllAnimeInfo(URL) {
  let response = await fetch(URL);
  let res = await response.json();
  allAnimes = {...res};
}
async function DrawAnimes(URL) {
  await getAllAnimeInfo(URL);
  container.innerHTML = '';
  pagesIndex.textContent = allAnimes.pagination.last_visible_page;
  (currentPage===allAnimes.pagination.last_visible_page) && nextPage.setAttribute('disabled','');
  (currentPage < allAnimes.pagination.last_visible_page) && nextPage.removeAttribute('disabled');
  allAnimes.data.forEach(element => {
    //creating elements...
    let colDiv = document.createElement('div');
    let cardDiv = document.createElement('div');
    let animeImg = document.createElement('img'); // must has attributes
    let cardBody = document.createElement('div');
    let cardTitle = document.createElement('h5'); // must has attributes
    let cardType = document.createElement('p'); // must has attributes
    let cardBtn = document.createElement('a'); // must has attributes where should go once is clicked.

    // creating classes and id's...
    colDiv.className ='col mb-3';
    cardDiv.className = 'card';
    animeImg.className = 'card-img-top';
    cardBody.className = 'card-body';
    cardTitle.className = 'card-title text-truncate';
    cardType.className ='card-text';
    cardBtn.className = 'btn btn-primary';

    //setting attributes..
    animeImg.setAttribute('src', element.images.webp.image_url);
    cardTitle.textContent = `Title: ${element.title}.`
    cardType.textContent = `Type: ${element.type}.`
    cardBtn.textContent = "Find this out!";
    cardBtn.setAttribute('href', `../Details/details.html?id=${element.mal_id}`);
    cardBtn.setAttribute('target', 'blank');

    // setting tooltips
    cardTitle.setAttribute('data-bs-toggle', "tooltip");
    cardTitle.setAttribute('data-bs-placement', "top");
    cardTitle.setAttribute('data-bs-title', `Watch ${element.title}`);
    //animeImg.setAttribute('data-bs-toggle', "tooltip");
    //animeImg.setAttribute('data-bs-placement', "top");
    //animeImg.setAttribute('data-bs-title', `Watch ${element.synopsis}`);
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    // Appending children...
    colDiv.appendChild(cardDiv);
    cardDiv.appendChild(animeImg);
    cardDiv.appendChild(cardBody);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardType);
    cardBody.appendChild(cardBtn);
    container.appendChild(colDiv);
  });
} // this erases previous animes.
window.onload = DrawAnimes(MAIN_URL);