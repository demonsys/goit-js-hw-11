import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApi from './fetchImages.js';
const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  searchQuery: document.querySelector('input[name="searchQuery"]'),
  loadMore: document.querySelector('.load-more'),
};
const imagesApi = new ImagesApi();
refs.searchForm.addEventListener('submit', onSearch);
function onSearch(e) {
  e.preventDefault();
  imagesApi.searchQuery = e.target.elements.searchQuery.value.trim();
  if (imagesApi.searchQuery === '') {
    return Notify.info('Please enter a search query', {
      position: 'center-top',
    });
  }
  refs.gallery.innerHTML = '';
  imagesApi.fetchImages().then(response => {
    response.map(card => {
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
