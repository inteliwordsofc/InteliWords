import axios from 'axios';

const api = axios.create({
    baseURL: 'https://apiinteliwords2.azurewebsites.net/api'
})

export default api;