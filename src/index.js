import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import OnlyScroll from 'only-scrollbar';
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
  refs.gallery.innerHTML = '';
  imagesApi.resetPage();
  refs.loadMore.classList.add('hidden');
  imagesApi.searchQuery = e.target.elements.searchQuery.value.trim();
  if (imagesApi.searchQuery === '') {
    return Notify.info('Please enter a search query');
  }
  renderPage().then(totalHits => {
    if (totalHits > 0) {
      Notify.info(`Hooray! We found ${totalHits} images.`);
      refs.loadMore.classList.remove('hidden');
      refs.loadMore.addEventListener('click', renderMore);
    }
    if (totalHits < imagesApi.imagesPerPage) {
      refs.loadMore.classList.add('hidden');
    }
  });
}
function renderMore() {
  refs.loadMore.classList.add('hidden');
  renderPage().then(() => {
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    if (
      imagesApi.page >= imagesApi.totalHits / imagesApi.imagesPerPage &&
      imagesApi.page !== 1
    ) {
      refs.loadMore.removeEventListener('click', renderMore);
      return Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    refs.loadMore.classList.remove('hidden');
  });
}
const renderPage = async () => {
  try {
    const images = await imagesApi.fetchImages();
    if (imagesApi.totalHits === 0) {
      refs.loadMore.classList.add('hidden');
      return Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    images.hits.map(renderCard);
    const scroll = new OnlyScroll(document.scrollingElement);
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
