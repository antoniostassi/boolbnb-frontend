import axios from 'axios';
import { reactive } from 'vue';

export const api = reactive({

    getCSRF() {
        axios.get('http://localhost:8000/sanctum/csrf-cookie');
    },

    getCsrfTokenFromCookies() {
        const matches = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return matches ? decodeURIComponent(matches[1]) : null;
    },

});

export const store = reactive({
    navbarLinks: [
        { name: "Strutture", href: "/apartments" },
        { name: "Piani promozionali", href: "/promotions" },
        { name: "Servizi", href: "/services" },
        { name: "Chi siamo", href: "/about" },
        { name: "Contatti", href: "/contacts" },
    ],
});