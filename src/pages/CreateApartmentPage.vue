<script>

import { api } from '../store';
import axios from 'axios';

export default {
  data() {
    return {
      api,
      apartment : {
        services: []
      },
    };
  },
  components: {
  },
  mounted() {
    this.api.getServices();
    this.api.getPromotions();
  },
  methods: {
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
        latitude: 32.2112,
        longitude: 1.3203,
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
    },

    tryLog() {
      /* console.log(this.api.services);
      console.log(this.api.promotions); */
      // 
      console.log(this.apartment);
      console.log(this.promotion);
    }
  },
}
</script>

<template>
  <button @click="tryLog" class="d-non"> Cliccami </button> <!-- for test purposes -->
  <form @submit.prevent="createApartment">
    <label for="title">Titolo della struttura</label>
    <input type="text" name="title" required v-model="apartment.title">

    <label for="rooms">Numero di stanze</label>
    <input type="number" name="rooms" required v-model="apartment.rooms">

    <label for="beds">Numero di letti</label>
    <input type="number" name="beds" required v-model="apartment.beds">

    <label for="bathrooms">Numero di bagni</label>
    <input type="number" name="bathrooms" required v-model="apartment.bathrooms">

    
    <label for="apartment_size">Metri quadrati</label>
    <input type="number" name="apartment_size" required v-model="apartment.apartment_size">

    <label for="address">Indirizzo</label>
    <input type="text" name="address" required v-model="apartment.address">

    <label for="image">Immagine</label>
    <input type="text" name="image" required v-model="apartment.image">

    <h1>Services</h1>
    <div class="row gap-2">
      <div class="col-2" v-for="(service, index) in this.api.services" :key="index">
        <input type="checkbox" name="services[]" :id="'service-'+service.id" :value="service.id">
        <label :for="'service-'+index">{{service.title}}</label>
      </div>
    </div>

    <h1>Promotions</h1>
    <div class="row gap-2">
      <div class="col-2" v-for="(promotion, index) in this.api.promotions" :key="index">
        <label :for="'promotion-'+index">{{promotion.title}}</label>
        <input type="radio" name="promotions" :id="'promotion-'+promotion.id" :value="promotion.id" v-model="apartment.promotion">
      </div>
      <label for="nothing">Nessun abbonamento</label>
      <input type="radio" name="promotions" id="nothing" :value=null checked="checked" v-model="apartment.promotion">
      
    </div>

    <button type="submit">
      Crea
    </button>

  </form>
</template>

<style scoped>
  input {
    display: block;
    margin:auto;
    text-align: center;
  }

</style>