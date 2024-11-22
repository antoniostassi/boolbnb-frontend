<script>

import { api } from '../store';

export default {
  data() {
    return {
      api,
      apartment : {
        services : []
      }
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
      
    },

    tryLog() {
      /* console.log(this.api.services);
      console.log(this.api.promotions); */
      // 
      console.log(this.apartment);
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
        <input type="checkbox" name="services[]" :id="'service-'+index" v-model="apartment.services">
        <label :for="'service-'+index">{{service.title}}</label>
      </div>
    </div>

    <h1>Promotions</h1>
    <div class="row gap-2">
      <div class="col-2" v-for="(promotion, index) in this.api.promotions" :key="index">
        <label :for="'promotion-'+index">{{promotion.title}}</label>
        <input type="checkbox" name="promotions[]" :id="'promotion-'+index" >
      </div>
      
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