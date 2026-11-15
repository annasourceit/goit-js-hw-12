import SimpleLightbox from "simplelightbox";
import { getImagesByQuery } from "./pixabay-api.js";

let gallery = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
});

export function createGallery(images) {
    const list = document.querySelector('.gallery');
    const markup = images.map((image) =>

    `<li class = "gallery-item">
        <a class = "gallery-link" href = "${image.largeImageURL}">
            <img
            class = "gallery-image"
            src = "${image.webformatURL}"
            data-source = "${image.largeImageURL}"
            alt = "${image.tags}"
            />        
        </a>
         <ul class = "gallery-textcontainer">
           <li class = "gallery-text"><p>Likes</p><p class = "quantity">${image.likes}</p></li>
           <li class = "gallery-text"><p>Views</p><p class = "quantity">${image.views}</p></li>
           <li class = "gallery-text"><p>Comments</p><p class = "quantity">${image.comments}</p></li>
           <li class = "gallery-text"><p>Downloads</p><p class = "quantity">${image.downloads}</p></li>
         </ul>
    </li>`).join('');

    list.insertAdjacentHTML('beforeend', markup);
    
    gallery.refresh(); 
}

export function clearGallery(){
    const list = document.querySelector('.gallery');
    if (list) {
        list.innerHTML = '';
    }
}

export function showLoader() {
    const containerLoader = document.querySelector(".container-loader span");
    if (containerLoader && !containerLoader.classList.contains("loader")) {
        containerLoader.classList.add("loader");
    };
    
}

export function hideLoader() {
    const containerLoader = document.querySelector(".container-loader span");
    if (containerLoader && containerLoader.classList.contains("loader")) {
        containerLoader.classList.remove("loader");
    };
}


export function showLoadMoreButton() {
    const btnLoadMore = document.querySelector(".btn-load-more");
    if (btnLoadMore && btnLoadMore.classList.contains("is-hidden")) {
        btnLoadMore.classList.remove("is-hidden");
    }
}

export function hideLoadMoreButton() {
    const btnLoadMore = document.querySelector(".btn-load-more"); 
        if (btnLoadMore && !btnLoadMore.classList.contains("is-hidden")) {
        btnLoadMore.classList.add("is-hidden");
    }
}

export function scrollAfterClickLoadMore() {
    const item = document.querySelector(".gallery-item");
    if (item) {
        const itemHight = item.getBoundingClientRect().height;
        scrollBy({
        top: itemHight * 2,
        behavior: 'smooth',
        });
    }
}

export async function renderView(query, page) {
    showLoader();

    const response = await getImagesByQuery(query, page);
    
    if (response.hits.length > 0) {
        createGallery(response.hits);
    } else {
        hideLoadMoreButton();
        hideLoader();
        throw new Error('Sorry, there are no images matching your search query. Please try again!')
    }

    hideLoader();

    const maxPage = Math.ceil(response.totalHits / 15);
    if (page < maxPage) {
        showLoadMoreButton();
    } else {
        hideLoadMoreButton();
        throw new RangeError("We're sorry, but you've reached the end of search results.")
    }
}