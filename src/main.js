import { createApp } from 'vue';
import '../src/style.scss';
import App from './App.vue';
import axios from 'axios';
import { api } from './store.js';

axios.defaults.withCredentials = true;

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import { router } from './router'; // Importato Router

createApp(App).use(router).mount('#app'); // Utilizzo di router nella navigazione delle pagine

api.getCSRF();
console.log(api.getCsrfTokenFromCookies());

axios.defaults.headers.common["X-XSRF-TOKEN"] = api.getCsrfTokenFromCookies();
console.log(axios.defaults.headers.common);