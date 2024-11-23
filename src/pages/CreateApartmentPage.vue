<script>
import { api } from '../store';
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
    mounted() {
        this.api.getServices();
        this.api.getPromotions();
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
            this.apartment.longitude = suggestion.position.lon;
            this.suggestions = [];
        },
        createApartment() {
            axios
            .post('http://localhost:8000/api/apartments', {
                user_id: 1,
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
                console.log(result);
            })
            .catch((error) => {
                console.log(error);
            })
        }
    },
}
</script>

<template>
    <div class="container">
        <form @submit.prevent="createApartment">
            <label class="form-label" for="title">Titolo della struttura</label>
            <input class="form-control" type="text" name="title" required v-model="apartment.title">

            <label class="form-label" for="rooms">Numero di stanze</label>
            <input class="form-control" type="number" name="rooms" required v-model="apartment.rooms">

            <label class="form-label" for="beds">Numero di letti</label>
            <input class="form-control" type="number" name="beds" required v-model="apartment.beds">

            <label class="form-label" for="bathrooms">Numero di bagni</label>
            <input class="form-control" type="number" name="bathrooms" required v-model="apartment.bathrooms">

            <label class="form-label" for="apartment_size">Metri quadrati</label>
            <input class="form-control" type="number" name="apartment_size" required v-model="apartment.apartment_size">

            <label class="form-label" for="address">Indirizzo</label>
            <input class="form-control" type="text" name="address" required v-model="apartment.address" @input="fetchSuggestions(apartment.address)" autocomplete="off">
            <ul v-if="suggestions.length" class="list-group">
                <li v-for="(suggestion, index) in suggestions" :key="index" @click="selectSuggestion(suggestion)" class="list-group-item">
                    {{ suggestion.address }}
                </li>
            </ul>

            <label class="form-label" for="image">Immagine</label>
            <input class="form-control" type="text" name="image" required v-model="apartment.image">

            <h1>Services</h1>
            <div class="row gap-2">
            <div class="col-2" v-for="(service, index) in this.api.services" :key="index">
                <input type="checkbox" name="services[]" :id="'service-'+service.id" v-model="apartment.services" :value="service.id">
                <label class="form-label" :for="'service-'+index">{{service.title}}</label>
            </div>
            </div>
            <h1>Promotions</h1>
            <div class="row gap-2">
            <div class="col-2" v-for="(promotion, index) in this.api.promotions" :key="index">
                <label class="form-label" :for="'promotion-'+index">{{promotion.title}}</label>
                <input type="radio" name="promotions" :id="'promotion-'+promotion.id" :value="promotion.id" v-model="apartment.promotion">
            </div>
            <label class="form-label" for="nothing">Nessun abbonamento</label>
            <input type="radio" name="promotions" id="nothing" :value=null checked="checked" v-model="apartment.promotion">
            </div>

            <button type="submit">
                Crea
            </button>

        </form>
    </div>
</template>

<style lang="scss" scoped>
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

</style>