import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const API_KEY = '34212325-c6ab7e135f4fe9a0ab32789f1';
const BASE_URL = 'https://pixabay.com/api/';
const searchParams = new URLSearchParams({
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
});
const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  searchQuery: document.querySelector('input[name="searchQuery"]'),
};
refs.searchForm.addEventListener('submit', onSearch);
function onSearch(e) {
  e.preventDefault();
  if (refs.searchQuery.value === '') {
    return alert('Введите хоть что-то');
  }
  refs.gallery.innerHTML = '';
  fetch(`${BASE_URL}?${searchParams}&q=${refs.searchQuery.value}`)
    .then(r => r.json())
    .then(r => {
      r.hits.map(card => {
        renderCard(card);
      });
    });
}

function renderCard(card) {
  // const markup = photocardTpl(card);
  const {
    webformatURL,
    tags,
    likes,
    views,
    comments,
    downloads,
    largeImageURL,
  } = card;
  const markup = `
  <div class="photo-card">
  <a href='${largeImageURL}' class='photo-link'>
    <img src="${webformatURL}$" alt="${tags}" loading="lazy"/>
    </a>
      <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
       ${downloads}
      </p>
    </div>
  </div>`;
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}
let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
