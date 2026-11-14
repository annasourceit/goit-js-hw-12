import iziToast from "izitoast";
import { getImagesByQuery } from "./js/pixabay-api.js";
import { createGallery } from "./js/render-functions.js";
import { clearGallery } from "./js/render-functions.js";
import { showLoader } from "./js/render-functions.js";
import { hideLoader } from "./js/render-functions.js";
import { showLoadMoreButton } from "./js/render-functions.js";
import { hideLoadMoreButton } from "./js/render-functions.js";
import { scrollAfterClickLoadMore } from "./js/render-functions.js";
 
const form = document.querySelector(".form");
const btnLoadMore = document.querySelector(".btn-load-more");
const input = document.querySelector('.form-input');

let page = 1;
let totalHits;

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearGallery();
    const formData = new FormData(form);
    const query = formData.get('search-text').trim();
    if (query) {
        showLoader();
        try {
            const response = await getImagesByQuery(query, page);
            totalHits = response.data.totalHits;
            if (response.data.hits.length > 0) {
                let arrImages = [];
                for (const data of response.data.hits) {
                    const image = {
                        webformatURL: data.webformatURL,
                        largeImageURL: data.largeImageURL,
                        tags: data.tags,
                        likes: data.likes,
                        views: data.views,
                        comments: data.comments,
                        downloads: data.downloads,
                    }
                    arrImages.push(image);
                }
                createGallery(arrImages);
                showLoadMoreButton();
            } else {
                hideLoadMoreButton();
                iziToast.error({
                    id: 'error',
                    title: 'Error',
                    message: 'Sorry, there are no images matching your search query. Please try again!',
                    position: 'topRight',
                    transitionIn: 'fadeInDown'
                });
            }
        } catch (error) {
            iziToast.error({
                id: 'error',
                title: 'Error',
                message: error,
                position: 'topRight',
                transitionIn: 'fadeInDown'
            });
        }
        hideLoader();
    } else {
        iziToast.error({
            id: 'error',
            title: 'Error',
            message: 'Fill please all fields',
            position: 'topRight',
            transitionIn: 'fadeInDown'
        });
    }
});

btnLoadMore.addEventListener('click', async (event) => {
    const query = input.value;
    showLoader();
    try {
        const response = await getImagesByQuery(query, ++page);
        totalHits = response.data.totalHits;
        const datas = response.data.hits;
        let arrImages = [];
        for (const data of datas) {
            const image = {
                webformatURL: data.webformatURL,
                largeImageURL: data.largeImageURL,
                tags: data.tags,
                likes: data.likes,
                views: data.views,
                comments: data.comments,
                downloads: data.downloads,
            }
            arrImages.push(image);
        }
        createGallery(arrImages);
        scrollAfterClickLoadMore();
    } catch (error) {
        iziToast.error({
            id: 'error',
            title: 'Error',
            message: error,
            position: 'topRight',
            transitionIn: 'fadeInDown'
        });
    }
    hideLoader();
    const maxPage = Math.ceil(totalHits / 15);
    if (page < maxPage) {
        showLoadMoreButton();
    } else {
        hideLoadMoreButton();
        iziToast.info({
            message: "We're sorry, but you've reached the end of search results.",
            position: 'topRight',
        });
    }
});
