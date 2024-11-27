import axios from 'axios';
import { reactive } from 'vue';
import { router } from './router'; // Importato Router

export const api = reactive({
    loginCheck: false, // Serve a fare il primo check per vedere se l'utente è loggato
    isLoggedIn: false, // Stato per verificare se l'utente è loggato
    user: [],
    services: [],
    apartments: [], // Lista degli appartamenti
    paginationClick: false,
    promotions: [],
    // paginazione
    pagination: {
        currentPage: 1, // Pagina corrente
        firstPage:1,
        lastPage: 0, // Numero totale di pagine
        total: 0, // Numero totale di appartamenti
        prevPage:'',
        nextPage:'',
    },
    loginError: false,
     
    redirectIfNotAuth() {
        if (!this.isLogged) {
            router.push('/');
            store.showLoginForm = true;
        }
    },

    async getCSRF() {
        await axios.get('http://localhost:8000/sanctum/csrf-cookie');
        setTimeout(async () => {
            axios.defaults.headers.common["X-XSRF-TOKEN"] = this.getCsrfTokenFromCookies();
            console.log(axios.defaults.headers.common["X-XSRF-TOKEN"]);
        }, 100); // Ritardo in millisecondi
        this.getServices(); // Store services
        this.getPromotions(); // Store promotions
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
    
    refreshButtons(){
        setTimeout(() => {
            this.paginationClick = false
        }, 2000);
    },
    getAllApartments() {
        axios
            .get("http://localhost:8000/api/apartments?all=true")
            .then((response) => {
                this.apartments = response.data.map((apartment) => {
                    return {
                    ...apartment,
                    image: `https://picsum.photos/seed/${apartment.id}/400/400`
                    };
                });
            })
            .catch((error) => {
                console.error("Errore nel caricamento degli appartamenti:", error);
            });
    },
    getApartments(page = 1) {
    this.paginationClick = true;
    axios
        .get(`http://localhost:8000/api/apartments?page=${page}`)
        .then((response) => {
        console.log("Risposta API:", response.data);
        // Aggiorna gli appartamenti aggiungendo un'immagine Picsum generata e filtrando l'indirizzo
        this.apartments = response.data.data.map((apartment) => {
            return {
            ...apartment,
            image: `https://picsum.photos/seed/${apartment.id}/400/400`
            };
        });
        // Aggiorna la paginazione con i dati restituiti dall'API
        this.pagination = {
            currentPage: response.data.current_page,
            lastPage: response.data.last_page,
            total: response.data.total,
            prevPage: response.data.current_page - 1,
            nextPage: response.data.current_page + 1,
        };

        })
        .catch((error) => {
        console.error("Errore nel caricamento degli appartamenti:", error);
        });
    this.refreshButtons();
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
    formSubmitted: false, //stato per bloccare i form di submit create/edit
    servicesEmpty: false, // stato per controllare se c'è almeno un servizio nei form di create/edit
    filterSelected: [],
    messageFilter: '',
});

import * as services from "@tomtom-international/web-sdk-services";
export const tomtom = reactive({

    address:'',
    position:{},
    suggestions: [],
    apiKey: "Wuj8g5xvkgHJPaT4SjFEwshVAT3SbkVQ",

    fetchSuggestions(query) {
        console.log(query);
        if (query.length < 3) {
            this.suggestions = [];
            return;
        }
        services.services.fuzzySearch({
            key: this.apiKey, query, language: "it-IT",limit: 10,countrySet: ["IT"]})
            .then((response) => {
                console.log(response);
                this.suggestions = response.results.map((result) => ({
                    address: result.address.freeformAddress,
                    position: result.position,
                }));
                console.log(this.suggestions);

            })
            .catch((error) => {
                console.error("Errore durante la ricerca delle città:", error);
            });
    },
    
    selectSuggestion(suggestion) {
        this.address = suggestion.address;
        this.position = suggestion.position;
        this.changeRoute();
        this.suggestions = [];
    },

    changeRoute() {
        // Naviga alla pagina degli appartamenti con il filtro
        router.push({
            path: "/apartments",
        });
    },

    resetResearch() {
        this.address = '',
        this.position = {},
        this.suggestions = [],
        store.filterSelected = []
    }
})