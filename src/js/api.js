import axios from 'axios';
const API_KEY = "27883496-3dd209463576c9b19f64e0ddf"
const perPage = 40
axios.defaults.baseURL = 'https://pixabay.com/api/';
async function getRequest(ev, page) {
    const parameters = new URLSearchParams({
        key: API_KEY,
        q: ev,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: perPage,
    page: page,
  });
  return await axios.get(`?&${parameters}`);
}
export default {getRequest,perPage}