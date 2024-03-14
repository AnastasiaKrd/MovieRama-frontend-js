import { getClassesByRating, fixDecimals, getYearFromDate } from "./utils.js";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "?api_key=bc50218d91157b1ba4f142ef7baaa6a0";
const NOW_PLAYING_URL = API_BASE_URL + "/movie/now_playing" + API_KEY;
const SEARCH_URL = API_BASE_URL + "/search/movie" + API_KEY;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const GENRES_LIST_URL = API_BASE_URL + "/genre/movie/list" + API_KEY;
const DETAIL_INFO_URL = API_BASE_URL + "/movie/";

const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');


async function getGenresList() {
    try {
        const res = await fetch(GENRES_LIST_URL);
        const data = await res.json();
        return data.genres;
    }
    catch (e) {
        console.log(e);
        alert("Something went wrong");
    }
}

async function getDetailsForId(id, info) {
    try {
        const res = await fetch(DETAIL_INFO_URL + id + "/" + info + API_KEY)
        const data = await res.json();
        return data.results;
    }
    catch (e) {
        console.log(e);
        alert("Something went wrong");
    }
}

function getVideos(id) {
    let videosList = [];
    getDetailsForId(id, 'videos').then((res) => {
        res.forEach(item => {
            if (item.type.toLowerCase() == 'trailer' && item.site.toLowerCase() == 'youtube')
                videosList.push('https://www.youtube.com/embed/' + item.key);
        })
        videosList.forEach(video => {
            const element = document.createElement('div');
            let idName = `#details-${id}`;
            const main_movies = document.querySelector(idName);
            element.innerHTML +=
                `<iframe width="220" height="100"
                    src="${video}" loading="lazy">
                </iframe>`
            main_movies.appendChild(element);
        })
    })
}

function getReviews(id) {
    let reviewsList = [];
    getDetailsForId(id, 'reviews').then((res) => {
        res.slice(-2).forEach(item => {
            reviewsList.push({ author: item.author_details.username, content: item.content });
        })
        const element = document.createElement('div');
        element.classList.add('text');
        let idName = `#details-${id}`;
        const main_movies = document.querySelector(idName);
        let content = ``;
        reviewsList.forEach(review => {
            content += `
            <b>User </b><span class="reviewer">${review.author}:</span><br>
                <span class="review">${review.content}</span><br>
            `
        });
        element.innerHTML +=
            `<h4 class="detail-title">Reviews:</h4>
             `+ content;
        main_movies.appendChild(element);
    })
}

function getSimilarMovies(id) {
    getDetailsForId(id, 'similar').then((res) => {
        let content = `<ul>`;
        res.forEach(item => {
            content += `<li>${item.title}</li>`;
        })
        content += `</ul>`;
        const element = document.createElement('div');
        element.classList.add('text');
        let idName = `#details-${id}`;
        const main_movies = document.querySelector(idName);
        element.innerHTML +=
            `<h4 class="detail-title">Similar movies:</h4> ` + `${content}`;
        main_movies.appendChild(element);
    })
}

function displayMovies(movies, searchText) {
    main.innerHTML = '';
    let mainHeaderText = '';
    if (searchText) {
        mainHeaderText = 'Search results for "' + searchText + '"...';
    }
    else {
        mainHeaderText = 'Now playing...';;
    }
    const headerElement = document.createElement('div');
    headerElement.classList.add('main-header')
    headerElement.innerHTML = `<h3>${mainHeaderText}</h3>`;
    main.appendChild(headerElement);
    movies.forEach(movie => {
        const { id, title, backdrop_path, genres, release_date, vote_average, overview } = movie;
        const moviesElement = document.createElement('div');
        moviesElement.classList.add('movie');
        let image_path = '';
        if (backdrop_path) {
            image_path = IMAGE_BASE_URL + backdrop_path;
        }
        else {
            image_path = '/no_image_available.png';
        }
        moviesElement.innerHTML = `
            <img src="${image_path}" alt="${title}" />
            <div class='movie-info'>
            <h2>${title}</h2>
            <span class='${getClassesByRating(vote_average)}'>&starf; ${fixDecimals(vote_average, 1)}</span>
            </div>    
            <div class="movie-info-secondary">
                <span class="secondary-info">Release year:</span> ${getYearFromDate(release_date)}   
                <span class="secondary-info">Genres:</span> ${genres}
                <span class="secondary-info">Overview:</span> ${overview}
            </div>
            <button class="info-button" id="${id}" onclick="animation(id)">Show more info &#128899</button>
            <div class='details' id='details-${id}'>
            </div>
            `
        main.appendChild(moviesElement);
        getVideos(id);
        getReviews(id);
        getSimilarMovies(id);
    });
}

async function getMovies(url, searchText) {
    try {
        const moviesRes = await fetch(url);
        const data = await moviesRes.json();
        const genresList = await getGenresList();
        data.results.forEach(element => {
            let genresArr = [];
            genresList.forEach(li => {
                if (element.genre_ids.includes(li.id)) {
                    genresArr.push(li.name);
                }
                let genresStr = genresArr.join('-');
                element.genres = genresStr;
            })
        })
        displayMovies(data.results, searchText);
    }
    catch (e) {
        console.log(e);
        alert("Something went wrong");
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let searchValue = search.value;
    if (searchValue && searchValue !== '') {
        getMovies(SEARCH_URL + '&query=' + searchValue, searchValue);
        searchValue = '';
    }
    else {
        window.location.reload();
    }
})

function animation(id) {
    let elementId = `details-${id}`;
    let content = document.getElementById(id).innerHTML;
    content.toLowerCase().includes('more') ? document.getElementById(id).innerHTML = `Hide info &#128897` : document.getElementById(id).innerHTML = `Show more info &#128899`;
    document.getElementById(elementId).classList.toggle('visible');
}

window.animation = animation;

getMovies(NOW_PLAYING_URL, '');
