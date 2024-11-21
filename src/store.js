import axios from 'axios';
import { reactive } from 'vue';

export const api = reactive({

    getCSRF() {
        axios.get('http://localhost:8000/sanctum/csrf-cookie');
        console.log('storing Api');
    },

    getCsrfTokenFromCookies() {
        const matches = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return matches ? decodeURIComponent(matches[1]) : null;
    },

});