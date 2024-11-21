import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { router } from './router'; // Importato Router

createApp(App).use(router).mount('#app'); // Utilizzo di router nella navigazione delle pagine