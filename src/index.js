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
    return Notify.info('Please enter a search query');
  }
  refs.gallery.innerHTML = '';
  imagesApi.resetPage();
  try {
    renderAllCards().then(totalHits => {
      if (totalHits > 0) {
        Notify.info(`Hooray! We found ${totalHits} images.`);
      }
      if (totalHits < imagesApi.imagesPerPage) {
        refs.loadMore.classList.add('hidden');
      }
    });
  } catch (error) {
    Notify.failure(error.message);
  }
  refs.loadMore.addEventListener('click', renderAllCards);
}

const renderAllCards = async () => {
  refs.loadMore.classList.add('hidden');
  try {
    const images = await imagesApi.fetchImages();
    if (imagesApi.totalHits === 0) {
      return Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    images.hits.map(renderCard);
    if (
      imagesApi.page >= imagesApi.totalHits / imagesApi.imagesPerPage &&
      imagesApi.page !== 1
    ) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      return imagesApi.totalHits;
    }
    refs.loadMore.classList.remove('hidden');
    return imagesApi.totalHits;
  } catch (error) {
    Notify.failure(error.message);
    console.log(error);
    return;
  }
};
function renderCard(card) {
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
