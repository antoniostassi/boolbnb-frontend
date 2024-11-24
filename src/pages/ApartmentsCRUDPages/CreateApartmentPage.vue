<script>
import { api } from '../../store';
import axios from 'axios';
import * as services from '@tomtom-international/web-sdk-services';

export default {
    data() {
        return {
            api,
            apartment : {
                services: [],
                address: '',
                latitude: null,
                longitude: null,
            },
            suggestions: [],
            apiKey: 'Wuj8g5xvkgHJPaT4SjFEwshVAT3SbkVQ',
        };
    },
    components: {
    },
    methods: {
        fetchSuggestions(query) {
            if (query.length < 3) {
                this.suggestions = [];
                return;
            }

            services.services.fuzzySearch({
                key: this.apiKey,
                query: query,
                language: 'it-IT', 
                limit: 10,
                countrySet: ['IT']
            })
            .then((response) => {
                this.suggestions = response.results.map((result) => ({
                    address: result.address.freeformAddress,
                    position: result.position,
                }));
            })
            .catch((error) => {
                console.error('Errore durante la ricerca:', error);
            });
        },

        selectSuggestion(suggestion) {
            this.apartment.address = suggestion.address;
            this.apartment.latitude = suggestion.position.lat;
            this.apartment.longitude = suggestion.position.lng;
            this.suggestions = [];
        },
        createApartment() {
            axios
            .post('http://localhost:8000/api/apartments', {
                user_id: this.api.user.id,
                title: this.apartment.title,
                rooms: this.apartment.rooms,
                beds: this.apartment.beds,
                bathrooms: this.apartment.bathrooms,
                apartment_size: this.apartment.apartment_size,
                address: this.apartment.address,
                latitude: this.apartment.latitude,
                longitude: this.apartment.longitude,
                image: this.apartment.image,
                services: this.apartment.services,
                promotions: this.apartment.promotion
            })
            .then((result) => {
                console.log('Risultato:', result);
                alert('Appartamento creato con successo');
                this.$router.push('/user/dashboard')
            })
            .catch((error) => {
                console.log(error);
            })
        }
    },
}
</script>

<template>
    <div class="container my-5">
        <h1 class="text-center mb-4">Aggiungi un nuovo appartamento</h1>
        <form @submit.prevent="createApartment" class="p-4 border rounded shadow">
            <div class="mb-3">
                <label class="form-label" for="title">Titolo dell'annuncio</label>
                <input
                    class="form-control"
                    type="text"
                    name="title"
                    required
                    v-model="apartment.title"
                    placeholder="Inserisci il titolo"
                />
            </div>
            <div class="row">
                <div class="col-md-3 mb-3">
                    <label class="form-label" for="rooms">Numero di stanze</label>
                    <input
                        class="form-control"
                        type="number"
                        name="rooms"
                        required
                        v-model="apartment.rooms"
                        placeholder="Inserisci il numero di stanze"
                    />
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label" for="beds">Numero di letti</label>
                    <input
                        class="form-control"
                        type="number"
                        name="beds"
                        required
                        v-model="apartment.beds"
                        placeholder="Inserisci il numero di letti"
                    />
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label" for="bathrooms">Numero di bagni</label>
                    <input
                        class="form-control"
                        type="number"
                        name="bathrooms"
                        required
                        v-model="apartment.bathrooms"
                        placeholder="Inserisci il numero di bagni"
                    />
                </div>
                <div class="col-md-3 mb-3">
                    <label class="form-label" for="apartment_size">Metri quadrati</label>
                    <input
                        class="form-control"
                        type="number"
                        name="apartment_size"
                        required
                        v-model="apartment.apartment_size"
                        placeholder="Inserisci i metri quadrati"
                    />
                </div>
            </div>
            <div class="mb-3">
                <label class="form-label" for="address">Indirizzo</label>
                <input
                    class="form-control"
                    type="text"
                    name="address"
                    required
                    v-model="apartment.address"
                    @input="fetchSuggestions(apartment.address)"
                    placeholder="Inserisci l'indirizzo"
                    autocomplete="off"
                />
                <ul v-if="suggestions.length" class="list-group mt-2">
                    <li
                        v-for="(suggestion, index) in suggestions"
                        :key="index"
                        @click="selectSuggestion(suggestion)"
                        class="list-group-item list-group-item-action"
                    >
                        {{ suggestion.address }}
                    </li>
                </ul>
            </div>

            <div class="mb-3">
                <label class="form-label" for="image">Immagine</label>
                <input
                    class="form-control"
                    type="text"
                    name="image"
                    required
                    v-model="apartment.image"
                    placeholder="Inserisci il link dell'immagine"
                />
            </div>

            <h3>Servizi</h3>
            <div class="row mb-3">
                <div class="col-md-3 d-flex align-items-center justify-content-center" v-for="(service, index) in api.services" :key="index">
                    <label :for="'service-'+index" class="ms-1 my-1 w-50">{{ service.title }}</label>
                    <input
                        type="checkbox"
                        name="services[]"
                        :id="'service-'+service.id"
                        v-model="apartment.services"
                        :value="service.id"
                    />
                    
                </div>
            </div>

            <button class="btn btn-success w-100">Aggiungi Appartamento</button>
        </form>
    </div>
</template>

<style lang="scss" scoped>
.container {
    max-width: 1000px;

    input {
        display: block;
        margin:auto;
        text-align: center;
    }

    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        border: 1px solid #ccc;
        max-height: 150px;
        overflow-y: auto;

        li {
            padding: 8px;
            cursor: pointer;

            &:hover {
                background-color: #f0f0f0;
            }
        }
    }
}
</style>