import axios from 'axios';
import { reactive } from 'vue';

export const api = reactive({

    services: [],
    promotions: [],


    getCSRF() {
        axios.get('http://localhost:8000/sanctum/csrf-cookie');
    },

    getCsrfTokenFromCookies() {
        const matches = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return matches ? decodeURIComponent(matches[1]) : null;
    },

    async getServices() {
        await axios.get('http://localhost:8000/api/services').then((result) => {
            this.services = result.data;
        });
    },

    async getPromotions() {
        await axios.get('http://localhost:8000/api/promotions').then((result) => {
            this.promotions = result.data;
        });
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
    currentApartment:''
});