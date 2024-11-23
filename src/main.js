import { createApp } from 'vue';
import '../src/style.scss';
import App from './App.vue';
import axios from 'axios';
import { api } from './store.js';
import '@tomtom-international/web-sdk-maps/dist/maps.css';


axios.defaults.withCredentials = true;

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import { router } from './router'; // Importato Router

createApp(App).use(router).mount('#app'); // Utilizzo di router nella navigazione delle pagine

//console.log(axios.defaults.headers.common);

if (!api.loginCheck) {
    api.getCSRF();
    api.getUserData();
    axios.defaults.headers.common["X-XSRF-TOKEN"] = api.getCsrfTokenFromCookies();
    api.loginCheck = true;
};