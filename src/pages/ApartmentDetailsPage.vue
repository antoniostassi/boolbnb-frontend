<script>
import axios from 'axios';
import { store } from '../store'

export default {
    data() {
        return {
            store,
            apartment: null
        };
        
    },
    props: {
        id: {
            type: Number,
            required: true
        }
    },
    components: {
    },
    mounted() {
        this.getApartment();
    },

    methods: {
        getApartment() {
            axios
                .get(`http://localhost:8000/api/apartments/${this.id}`)
                .then((response) => {
                    console.log(response.data[0]); // Logga la risposta completa
                    this.apartment = response.data[0];
                    this.apartment.image = `https://picsum.photos/seed/${this.id}/400/300`;
                    this.store.currentApartment = this.id
                    console.log(this.store.currentApartment)
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    },
}

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
        </div>
        
          <router-link :to="{ name: 'edit-apartment', params: { id: this.id } }">
            Modifica
          </router-link>

      
    </div>
</template>



<style>
</style>