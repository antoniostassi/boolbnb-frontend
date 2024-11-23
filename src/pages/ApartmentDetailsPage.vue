<script>
import axios from 'axios';
import tt from '@tomtom-international/web-sdk-maps';
import { markRaw } from 'vue';
import { store } from '../store'

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
            type: Number, // To understand
            required: true, // To understand
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

                    this.store.currentApartment = this.id // To understand
                    console.log(this.store.currentApartment) // To understand
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
        }
    },
};

</script>



<template>
    <div>
        <!-- Caricamento in corso -->
        <div v-if="apartment === null">
            <p>Caricamento in corso o appartamento non trovato.</p>
        </div>

        <!-- Dettagli dell'appartamento -->
        <div v-else>
            <h1>{{ apartment.title }}</h1>
            <small v-if="apartment_created_at">
                Annuncio inserito il {{ apartment.created_at }}
            </small>
            <small v-if="apartment.user.firstname != null & apartment.user.lastname != null">
                Annuncio inserito da {{ apartment.user.firstname + apartment.user.lastname }} 
            </small>
            <small v-if="apartment.user.email">
                Email del proprietario: {{ apartment.user.email }}
            </small>
            <p>Indirizzo: {{ apartment.address }}</p>
            <div>N. stanze: {{ apartment.rooms }}</div>
            <div>Metri Quadrati: {{ apartment.apartment_size }}</div>
            <div>Letti: {{ apartment.beds }}</div>
            <img :src="apartment.image" :alt="apartment.title">

            <div>
                Servizi all'interno:
                <ul>
                    <li v-for="(service, index) in apartment.services" :key="index">
                        {{ service.title }}
                    </li>
                </ul>
            </div>

            <div v-if="apartment && mapCenter.lat && mapCenter.lng" class="map-container container d-flex flex-column justify-content-center align-items-center">
                <h2 class="text-center">
                    Posizione dell'appartamento
                </h2>
                <div id="map">

                </div>
            </div>
            
        </div>
        
          <router-link :to="{ name: 'edit-apartment', params: { id: this.id } }">
            Modifica
          </router-link>

      
    </div>
</template>



<style>
#map {
    height: 400px;
    width: 400px;
}
</style>