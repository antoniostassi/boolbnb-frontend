<script>

import { api } from '../../store';
import { store } from '../../store';

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
        services: this.activeServices,
      })
        .then((result) => {
          console.log(result);
          this.api.getUserApartments();
          alert('Modifica effettuata con successo');
          this.$router.push('/user/dashboard');
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
  <div class="container my-5">
    <h1 class="text-center mb-4">Modifica l'appartamento</h1>
    <form @submit.prevent="editApartment" validate class="p-4 border rounded shadow">
      <div class="mb-3">
        <label class="form-label" for="title">Titolo dell'annuncio <span class="text-danger">*</span></label>
        <input
          class="form-control"
          type="text"
          name="title"
          minlength="5"
          maxlength="128"
          required
          v-model="apartment.title"
          placeholder="Modifica il titolo"
        />
      </div>
      <div class="row">
        <div class="col-md-3 mb-3">
          <label class="form-label" for="rooms">Numero di stanze <span class="text-danger">*</span></label>
          <input
            class="form-control"
            type="number"
            name="rooms"
            required
            step="1"
            min="1"
            max="20"
            v-model="apartment.rooms"
            placeholder="Modifica il numero di stanze"
          />
        </div>
        <div class="col-md-3 mb-3">
          <label class="form-label" for="beds">Numero di letti <span class="text-danger">*</span></label>
          <input
            class="form-control"
            type="number"
            name="beds"
            required
            step="1"
            min="1"
            max="20"
            v-model="apartment.beds"
            placeholder="Modifica il numero di letti"
          />
        </div>
        <div class="col-md-3 mb-3">
          <label class="form-label" for="bathrooms">Numero di bagni <span class="text-danger">*</span></label>
          <input
            class="form-control"
            type="number"
            name="bathrooms"
            min="1"
            step="1"
            max="10"
            required
            v-model="apartment.bathrooms"
            placeholder="Modifica il numero di bagni"
          />
        </div>
        <div class="col-md-3 mb-3">
          <label class="form-label" for="apartment_size">Metri quadrati <span class="text-danger">*</span></label>
          <input
            class="form-control"
            type="number"
            name="apartment_size"
            required
            min="7"
            step="1"
            max="500"
            v-model="apartment.apartment_size"
            placeholder="Modifica i metri quadrati"
          />
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label" for="address">Indirizzo <span class="text-danger">*</span></label>
        <input
          class="form-control"
          type="text"
          name="address"
          minlength="10"
          maxlength="128"
          required
          v-model="apartment.address"
          placeholder="Modifica l'indirizzo"
        />
      </div>
      <div class="mb-3">
        <label class="form-label" for="image">Immagine <span class="text-danger">*</span></label>
        <input
          class="form-control"
          type="text"
          name="image"
          required
          v-model="apartment.image"
          placeholder="Modifica il link dell'immagine"
        />
      </div>
      <div class="fw-bold mb-3">I campi contrassegnati con <span class="text-danger">*</span> sono obbligatori</div>
      <hr>
      <h3>Servizi</h3>
      <div class="row mb-3">
        <div
          class="col-md-3 d-flex align-items-center justify-content-center"
          v-for="(service, index) in api.services"
          :key="index"
        >
          <label :for="'service-'+index" class="ms-1 my-1 w-50 ">{{ service.title }}</label>
          <input
            type="checkbox"
            name="services[]"
            :id="'service-'+service.id"
            v-model="activeServices"
            required
            :value="service.id"
          />
        </div>
        <p class="fw-bold my-2">NB: Inserisci almeno un servizio </p>

      </div>
      <button class="btn btn-primary w-100">Salva Modifiche</button>
    </form>
  </div>
</template>


<style scoped>
.container {
  max-width: 1000px;
  margin: auto;
}

h1 {
  font-weight: bold;
  color: #2c3e50;
}

.form-label {
  font-weight: 500;
}

input, label {
  margin-bottom: 10px;
}

button {
  background-color: #3498db;
  border-color: #3498db;
  color: white;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2980b9;
}
</style>
