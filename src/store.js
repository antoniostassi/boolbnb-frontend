import axios from 'axios';
import { reactive } from 'vue';

export const api = reactive({
    loginCheck: false, // Serve a fare il primo check per vedere se l'utente è loggato
    isLoggedIn: false, // Stato per verificare se l'utente è loggato
    user: [],
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

    async getUserData() {
        await axios.get('http://localhost:8000/api/user').then((result) => {
            this.user = result.data;
            this.isLoggedIn = true;
            this.getUserApartments();
        }).catch((error) => {
            console.log('Utente non loggato');
        });
    },

    async getUserApartments() {
        await axios.get('http://localhost:8000/api/apartments?user_id='+this.user.id).then((result) => {
            this.user.apartments = result.data;
            console.log(this.user.apartments);
        }).catch((error) => {
            console.log(error);
        })
    }


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