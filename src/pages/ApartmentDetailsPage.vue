<script>
import axios from 'axios';
import tt from '@tomtom-international/web-sdk-maps';
import { markRaw } from 'vue';
import { store } from '../store';

export default {
    data() {
        return {
            apartment: null,
            map: null,
            mapCenter: { lat: 0, lng: 0 },
            store,
        };
    },
    props: {
        id: {
            type: Number,
            required: true,
        },
    },
    mounted() {
        this.getApartment();
    },
    methods: {
        getApartment() {
            axios
                .get(`http://localhost:8000/api/apartments/${this.id}`)
                .then((response) => {
                    this.apartment = response.data[0];
                    this.apartment.image = `https://picsum.photos/seed/${this.apartment.id}/400/300`;

                    if (this.apartment.latitude && this.apartment.longitude) {
                        this.mapCenter = {
                            lat: this.apartment.latitude,
                            lng: this.apartment.longitude,
                        };
                        this.initializeMap();
                    }

                    this.store.currentApartment = this.id;
                    console.log(this.store.currentApartment);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        initializeMap() {
            this.$nextTick(() => {
                this.map = markRaw(tt.map({
                    key: 'Wuj8g5xvkgHJPaT4SjFEwshVAT3SbkVQ',
                    container: 'map',
                    center: [this.mapCenter.lng, this.mapCenter.lat],
                    zoom: 15,
                }));

                const marker = markRaw(new tt.Marker()
                    .setLngLat([this.mapCenter.lng, this.mapCenter.lat])
                    .addTo(this.map));
            });
        },
    },
};
</script>

<template>
    <div class="apartment-details">
        <!-- Caricamento in corso -->
        <div v-if="apartment === null" class="loading">
            <p>Caricamento in corso o appartamento non trovato...</p>
        </div>

        <!-- Dettagli dell'appartamento -->
        <div v-else class="details-container">
            <h1 class="apartment-title">{{ apartment.title }}</h1>
            <img :src="apartment.image" :alt="apartment.title" class="apartment-image">
            <p class="apartment-description">
                <strong>Indirizzo:</strong> {{ apartment.address }}<br>
                <strong>N. Stanze:</strong> {{ apartment.rooms }}<br>
                <strong>Metri Quadrati:</strong> {{ apartment.apartment_size }}<br>
                <strong>Letti:</strong> {{ apartment.beds }}
            </p>

            <!-- Servizi -->
            <div class="services">
                <h3>Servizi Disponibili:</h3>
                <ul>
                    <li v-for="(service, index) in apartment.services" :key="index">
                        {{ service.title }}
                    </li>
                </ul>
            </div>

            <!-- Sezione Proprietario -->
            <div class="owner-section">
                <h2>Contatti del Proprietario</h2>
                <p v-if="apartment.user.firstname && apartment.user.lastname">
                    <strong>Nome:</strong> {{ apartment.user.firstname }} {{ apartment.user.lastname }}
                </p>
                <p v-if="apartment.user.email">
                    <strong>Email:</strong> {{ apartment.user.email }}
                </p>
                <button class="contact-button" @click="alert('Contatta il proprietario via email: ' + apartment.user.email)">
                    Contatta il Proprietario
                </button>
            </div>

            <!-- Mappa -->
            <div v-if="apartment && mapCenter.lat && mapCenter.lng" class="map-section">
                <h2>Posizione dell'appartamento</h2>
                <div id="map"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Container principale */
.apartment-details {
    font-family: 'Arial', sans-serif;
    margin: 20px auto;
    max-width: 800px;
    padding: 20px;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* Titolo dell'appartamento */
.apartment-title {
    font-size: 2rem;
    color: #4A4A4A;
    text-align: center;
    margin-bottom: 20px;
}

/* Immagine dell'appartamento */
.apartment-image {
    width: 100%;
    height: auto;
    border-radius: 10px;
    margin-bottom: 20px;
}

/* Descrizione dell'appartamento */
.apartment-description {
    font-size: 1.1rem;
    color: #333;
    line-height: 1.5;
    margin-bottom: 20px;
}

/* Servizi */
.services {
    margin-bottom: 20px;
}
.services h3 {
    font-size: 1.5rem;
    color: #4A90E2;
}
.services ul {
    list-style: none;
    padding: 0;
}
.services li {
    background-color: #e8f4fa;
    margin: 5px 0;
    padding: 10px;
    border-radius: 5px;
    color: #333;
}

/* Sezione Proprietario */
.owner-section {
    margin: 30px 0;
    padding: 20px;
    background-color: #fff3e6;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.owner-section h2 {
    font-size: 1.5rem;
    color: #F57C00;
    margin-bottom: 10px;
}
.contact-button {
    padding: 10px 20px;
    background-color: #F57C00;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}
.contact-button:hover {
    background-color: #E65100;
}

/* Mappa */
.map-section {
    margin: 20px 0;
    text-align: center;
}
#map {
    height: 400px;
    width: 100%;
    border-radius: 10px;
    margin-top: 10px;
}

/* Link di modifica */
.edit-link {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    text-align: center;
    transition: background-color 0.3s;
}
.edit-link:hover {
    background-color: #388E3C;
}

/* Stile per il caricamento */
.loading {
    text-align: center;
    font-size: 1.2rem;
    color: #555;
}
</style>
