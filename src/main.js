import iziToast from "izitoast";
import { clearGallery, createGallery } from "./js/render-functions.js";
import {
    hideLoader,
    showLoader,
    showLoadMoreButton,
    hideLoadMoreButton
} from "./js/render-functions.js";
import { getImagesByQuery } from "./js/pixabay-api.js";
 
const form = document.querySelector(".form");
const btnLoadMore = document.querySelector(".btn-load-more");
const input = document.querySelector('.form-input');

let page;
let query;

async function renderView(query, page) {
    hideLoadMoreButton();
    showLoader();

    const response = await getImagesByQuery(query, page);
    
    if (response.hits.length > 0) {
        createGallery(response.hits);
        hideLoader();
    } else {
        hideLoader();
        throw new Error('Sorry, there are no images matching your search query. Please try again!')
    }

    const maxPage = Math.ceil(response.totalHits / 15);
    if (page < maxPage) {
        showLoadMoreButton();
    } else {
        throw new RangeError("We're sorry, but you've reached the end of search results.")
    }
}

function showError(error) {
    if (error instanceof RangeError) {
        iziToast.info({
            message: error.message,
            position: 'topRight',
        });
    } else {
        iziToast.error({
            id: 'error',
            title: 'Error',
            message: error.message,
            position: 'topRight',
            transitionIn: 'fadeInDown'
        });
    }
}


function scrollAfterClickLoadMore() {
    const item = document.querySelector(".gallery-item");
    if (item) {
        const itemHight = item.getBoundingClientRect().height;
        scrollBy({
        top: itemHight * 2,
        behavior: 'smooth',
        });
    }
}

form.addEventListener('submit', async (event) => {
    page = 1;
    event.preventDefault();
    clearGallery();
    const formData = new FormData(form);
    query = formData.get('search-text').trim();
    try {
        if (!query) {
            throw new Error('Fill please all fields');
        }
        await renderView(query, page);
    } catch (error) {
        showError(error);
    }
});

btnLoadMore.addEventListener('click', async (event) => {
    try {
        await renderView(query, ++page);
        scrollAfterClickLoadMore();
    } catch (error) {
        showError(error);
    }
});
