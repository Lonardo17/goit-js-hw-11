import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import API from "./api.js"
const refs = {
    form: document.querySelector("#search-form"),
    nextBtn: document.querySelector(".load-more"),
    gallery: document.querySelector(".gallery")
}
 
const gallery = new SimpleLightbox('.gallery__item');

let page = 0
refs.form.addEventListener("submit", getEvent)
refs.nextBtn.addEventListener("click", loadMore)

function getEvent(ev) {
  ev.preventDefault();
  page = 1
  refs.gallery.innerHTML = ""
   refs.nextBtn.style.display = "none"
  if (!ev) {
    return;
  }
  const form = ev.target;
  const searchQuery = form.elements.searchQuery.value;
  
  try {
    API.getRequest(searchQuery.trim(), page)
      .then(ev => {
        createGallery(ev)
        Notiflix.Notify.success(`Hooray! We found ${ev.data.totalHits} images.`);
      })
      .catch(errorMassage)
  }
  catch (error) {
    Notiflix.Notify.failure(error.message);
    console.log(error); }
  
}

function createGallery(ev) {
  const find = ev.data;
    
    if (find.totalHits > 0) {
      refs.gallery.innerHTML += addImg(find.hits);
     
      gallery.refresh();
  } else return rejected
  
  if (page * API.perPage < find.totalHits) {
    refs.nextBtn.style.display = "block"
  } else {
    Notiflix.Notify.info(`We're sorry, but you've reached the end of search results.`)
    refs.nextBtn.style.display = "none"
  }
}
function errorMassage() {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
}
function addImg(ev) {
    const step = ev.map(({ webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads, }) => {
        return `<a class="gallery__item" href="${largeImageURL}"><div class="photo-card">
  <img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div></a>` }).join("")
    return step 
}
function loadMore() {
  page += 1;
  const form = refs.form.elements.searchQuery.value;
  
  API.getRequest(form, page)
    .then(createGallery)
  .catch(errorMassage)

}