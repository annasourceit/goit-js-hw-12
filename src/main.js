import iziToast from "izitoast";
import { renderView } from "./js/render-functions.js";
import { clearGallery } from "./js/render-functions.js";
import { scrollAfterClickLoadMore } from "./js/render-functions.js";
 
const form = document.querySelector(".form");
const btnLoadMore = document.querySelector(".btn-load-more");
const input = document.querySelector('.form-input');

let page;
let query;

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
