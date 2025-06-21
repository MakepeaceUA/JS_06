const API_KEY = '11895a96';
const BASE_URL = 'https://www.omdbapi.com/';

const form = document.getElementById('search-form');
const resultsDiv = document.getElementById('results');
const paginationDiv = document.getElementById('pagination');
const detailsDiv = document.getElementById('movie-details');
const errorMessage = document.getElementById('error-message');

let currentSearch = 
{
  title: '',
  type: '',
  totalResults: 0
};

form.addEventListener('submit', function (e) {
  e.preventDefault();
  errorMessage.textContent = '';
  currentSearch.title = document.getElementById('title').value.trim();
  currentSearch.type = document.getElementById('type').value;
  FetchMovies(1);
});

function FetchMovies(page) 
{
  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(currentSearch.title)}&type=${currentSearch.type}&page=${page}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      resultsDiv.innerHTML = '';
      paginationDiv.innerHTML = '';
      detailsDiv.innerHTML = '';
      if (data.Response === "True") 
      {
        currentSearch.totalResults = parseInt(data.totalResults);
        RenderMovies(data.Search);
        Pagination(page, Math.ceil(currentSearch.totalResults / 10));
      } 
      else
      {
        resultsDiv.innerHTML = `<div class="error-message">${data.Error}</div>`;
      }
    })
}

function RenderMovies(movies) 
{
  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/250x350?text=No+Image'}" alt="${movie.Title}">
      <div class="card-body">
        <h3>${movie.Title}</h3>
        <p>${movie.Year} | ${movie.Type}</p>
        <button onclick="fetchDetails('${movie.imdbID}')">Детали</button>
      </div>
    `;
    resultsDiv.appendChild(card);
  });
}

function Pagination(currentPage, totalPages) 
{
  for (let i = 1; i <= totalPages; i++) 
  {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) 
    {
      btn.classList.add('active');
    }
    btn.addEventListener('click', () => FetchMovies(i));
    paginationDiv.appendChild(btn);
  }
}

function fetchDetails(imdbID) 
{
  const url = `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "True") 
      {
        detailsDiv.innerHTML = `
          <img src="${data.Poster !== "N/A" ? data.Poster : 'https://via.placeholder.com/200x300?text=No+Image'}" alt="${data.Title}">
          <h2>${data.Title} (${data.Year})</h2>
          <p><strong>Genre:</strong> ${data.Genre}</p>
          <p><strong>Director:</strong> ${data.Director}</p>
          <p><strong>Actors:</strong> ${data.Actors}</p>
          <p><strong>Plot:</strong> ${data.Plot}</p>
          <p><strong>IMDB Rating:</strong> ${data.imdbRating}</p>
        `;
        detailsDiv.scrollIntoView({ behavior: "smooth" });
      }
    })
}
