import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
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
// let page = 1;
// const fetchImages = async q => {
//   try {
//     const response = await axios.get(BASE_URL, {
//       params: {
//         key: API_KEY,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//         page: 1,
//         per_page: 40,
//         q: q,
//       },
//     });
//     console.log(response);
//     return response.data;
//   } catch (error) {
//     Notify.failure(error.message, {
//       position: 'center-top',
//     });
//     console.log(error);
//   }
// };

// export { fetchImages };
export default class ImagesApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = 0;
  }
  async fetchImages() {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          key: API_KEY,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          page: this.page,
          per_page: 40,
          q: this.searchQuery,
        },
      });
      console.log(this);
      this.totalHits = response.data.totalHits;
      return response.data.hits;
    } catch (error) {
      Notify.failure(error.message, {
        position: 'center-top',
      });
      console.log(error);
    }
  }
  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
