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
let page; 
form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearGallery();
    const formData = new FormData(form);
    const query = formData.get('search-text').trim();
    page = 1;
    if (query) {
        showLoader();
        getImagesByQuery(query,page)
        .then(response => {           
            const datas = response.hits;         
            if (datas.length > 0) { 
                let arrImages = [];
                for (const data of datas) {
                    const image = {
                        webformatURL: data.webformatURL,
                        largeImageURL:  data.largeImageURL, 
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
        })
        .catch(error => {
            iziToast.error({
                id: 'error',
                title: 'Error',
                message: error,
                position: 'topRight',
                transitionIn: 'fadeInDown'
            });
        })
        .finally(() => {
            hideLoader();
        });
    } else {
        iziToast.error({
            id: 'error',
            title: 'Error',
            message: 'Fill please all fields',
            position: 'topRight',
            transitionIn: 'fadeInDown'
        });
    }
})
btnLoadMore.addEventListener('click', (event) => {    
    const query = input.value;
    page += 1;
    showLoader();
    getImagesByQuery(query, page)
        .then(response => {
            const datas = response.hits;
            const maxPage = Math.ceil(response.totalHits / 15);
            if (page < maxPage) { 
                let arrImages = [];
                for (const data of datas) {
                    const image = {
                        webformatURL: data.webformatURL,
                        largeImageURL:  data.largeImageURL, 
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
                showLoadMoreButton();
                
            } else {
                hideLoadMoreButton();
                iziToast.error({
                    id: 'error',
                    title: 'Error',
                    message: "We're sorry, but you've reached the end of search results.",
                    position: 'topRight',
                    transitionIn: 'fadeInDown'
                });
            }
        })
        .catch(error => {
            iziToast.error({
                id: 'error',
                title: 'Error',
                message: error,
                position: 'topRight',
                transitionIn: 'fadeInDown'
            });
        })
        .finally(() => {
            hideLoader();
        });
})
