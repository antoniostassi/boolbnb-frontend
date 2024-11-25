import axios from 'axios';
import { reactive } from 'vue';

export const api = reactive({
    loginCheck: false, // Serve a fare il primo check per vedere se l'utente è loggato
    isLoggedIn: false, // Stato per verificare se l'utente è loggato
    user: [],
    services: [],
    promotions: [],

    async getCSRF() {
        await axios.get('http://localhost:8000/sanctum/csrf-cookie');
        setTimeout(async () => {
            axios.defaults.headers.common["X-XSRF-TOKEN"] = this.getCsrfTokenFromCookies();
            console.log(axios.defaults.headers.common["X-XSRF-TOKEN"]);
        }, 100); // Ritardo in millisecondi
    },

    getCsrfTokenFromCookies() {
        const matches = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return matches ? decodeURIComponent(matches[1]) : null;
    },

    async getServices() {
        await axios.get('http://localhost:8000/api/services').then((result) => {
            this.services = result.data; // Store services
        });
    },

    async getPromotions() {
        await axios.get('http://localhost:8000/api/promotions').then((result) => {
            this.promotions = result.data; // Store promotions
        });
    },

    async getUserData() {
        await axios.get('http://localhost:8000/api/user').then((result) => {
            this.user = result.data; // Store user data
            this.isLoggedIn = true; // Set user logged for frontend control
            this.getUserApartments(); // Store user's apartments
            this.getServices(); // Store services
            this.getPromotions(); // Store promotions
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
    },


    async userLogout(param) {
        try {
            await axios.post('http://localhost:8000/logout');
            this.isLoggedIn = false;
            param.push('/')
            this.getCSRF();
        } catch (error) {
            console.error('Errore durante il logout:', error.response?.data?.message || error.message);
        }
    },

});

export const store = reactive({
    navbarLinks: [
        { name: "Strutture", href: "/apartments" },
        { name: "Piani promozionali", href: "/promotions" },
        { name: "Chi siamo", href: "/about" },
        { name: "Contatti", href: "/contacts" },
    ],
    currentApartment: 0, // 0 by default because it is a number
    showLoginForm: false, // Stato per mostrare/nascondere il form di login
    // Variabili per il form di login e registrazione
    isRegistration: false, // Stato per passare da login a registrazione
    servicesEmpty: false,

});