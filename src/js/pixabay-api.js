import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/'
const API_KEY = '58393440-33caa61bebfe5f460528244dd';

export const getImagesByQuery = async (query, page) => {
    const response = await axios.get(BASE_URL, {
        params: {
            key: API_KEY,
            q: query,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            page: page,
            per_page : 15,
        }
    })
    return response;
}

