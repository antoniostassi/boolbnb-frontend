import { createApp } from 'vue';
import '../src/style.scss';
import App from './App.vue';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import { router } from './router'; // Importato Router



createApp(App).use(router).mount('#app'); // Utilizzo di router nella navigazione delle pagine