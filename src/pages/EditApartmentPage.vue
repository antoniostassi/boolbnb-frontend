<script>

import { api } from '../store';
import { store } from '../store';

import axios from 'axios';

export default {
  data() {
    return {
      api,
      store,
      apartment: [],
      activeServices: []
    };
  },
  components: {
  },
  mounted() {
    this.getApartment();
  },
  methods: {
   
    getApartment() {
      axios.get(`http://localhost:8000/api/apartments/${this.store.currentApartment}`)
          .then((response) => {
              //console.log(response.data);
              this.apartment = response.data[0];
              this.apartment.services.forEach(element => {
                this.activeServices.push(element.id);
              });
          })
          .catch((error) => {
              console.error(error);
          });
                
    },
    editApartment() {
      axios
      .put('http://localhost:8000/api/apartments/'+ this.apartment.id , {
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
        services: this.activeServices,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      })
    },

    tryLog() {
       console.log(this.apartment);
      // 
    }
  },
}
</script>

<template>

  <button @click="tryLog" class="d-non"> Cliccami </button> <!-- for test purposes -->
  <h1>
    {{ apartment.title }}
  </h1>
  <form @submit.prevent="editApartment">
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
        <input type="checkbox" :checked="activeServices.includes(service.id)" name="services[]" :id="'service-'+service.id" :value="service.id" v-model="activeServices">
        <label :for="'service-'+index">{{service.title}}</label>        
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