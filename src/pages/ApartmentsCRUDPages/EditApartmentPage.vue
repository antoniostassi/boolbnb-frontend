<script>
import { api, store } from '../../store';
import axios from 'axios';
import * as services from '@tomtom-international/web-sdk-services';

export default {
  data() {
    return {
      api,
      store,
      apartment: [],
      activeServices: [],
      showAllServices: false,
      searchAddress: "",
      suggestions: [],
      apiKey: "Wuj8g5xvkgHJPaT4SjFEwshVAT3SbkVQ",
    };
  },
  components: {
  },
  mounted() {
    this.api.redirectIfNotAuth();
    this.store.serviceEmpty = false;
    this.getApartment();
  },
  computed: {
    visibleServices() {
      return this.showAllServices ? this.api.services : this.api.services.slice(0, 4);
    },
  },
  methods: {
    delayOnAPI() {
            setTimeout(() => {
                this.store.formSubmitted = false;
            }, 2000);
        },
    getApartment() {
      axios.get(`http://localhost:8000/api/apartments/${this.store.currentApartment}`)
          .then((response) => {

                this.apartment = response.data[0];
                this.apartment?.services?.forEach(element => {
                this.activeServices.push(element.id);
              });
          })
          .catch((error) => {
              console.error(error);
          });       
    },
    fetchSuggestions(query) {
      if (query.length < 3) {
        this.suggestions = [];
        return;
      }
      services.services
        .fuzzySearch({
          key: this.apiKey,
          query,
          language: "it-IT",
          limit: 10,
          countrySet: ["IT"],
        })
        .then((response) => {
          this.suggestions = response.results.map((result) => ({
            
            address: result.address.freeformAddress,
            position: result.position,
          }
        ));
        })
        .catch((error) => {
          console.error("Errore durante la ricerca delle città:", error);
        });
    },
    selectSuggestion(suggestion) {
        this.apartment.address = suggestion.address;
        this.apartment.latitude = suggestion.position.lat;
        this.apartment.longitude = suggestion.position.lng;
        this.suggestions = [];

    },
    editApartment() {
      this.store.formSubmitted = true;
      this.delayOnAPI();
      this.store.servicesEmpty = false;
      if (this.activeServices.length == 0){
        this.store.servicesEmpty = true;
        return
      }
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
            this.store.editedApartmentCheck = true;
            setTimeout(() => {
              this.store.editedApartmentCheck = false;
            }, 5000);
            this.$router.push('/user/dashboard');
        })
        .catch((error) => {
          console.log(error);
        }) 
    },
    toggleService(serviceId) {
      if (this.activeServices.includes(serviceId)) {
        const index = this.activeServices.indexOf(serviceId);
        this.activeServices.splice(index, 1);
      } else {
        this.activeServices.push(serviceId);
      }
    },
    showMoreServices() {
      this.showAllServices = !this.showAllServices;
    }
  },
}
</script>

<template>
  <div class="container my-5">
    <h1 class="text-center mb-4">Modifica l'appartamento</h1>
    <form @submit.prevent="editApartment" class="p-4 border rounded shadow">
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
      <p v-show="store.servicesEmpty" class="fw-bold text-danger">Inserisci almeno un servizio!</p>
      <div class="row mb-3 services-container">
        <div
          class="service-badge"
          v-for="(service, index) in visibleServices"
          :key="index"
          :class="{ selected: activeServices.includes(service.id) }"
          @click="toggleService(service.id)"
        >
          <div class="service-content">
            <!-- Icona del servizio -->
            <div class="service-icon">
              <i class="fa-solid fa-mug-saucer"></i>
            </div>
            <!-- Titolo del servizio -->
            <span class="service-title">{{ service.title }}</span>
            <!-- Spunta verde -->
            <div v-if="activeServices.includes(service.id)" class="checkmark">
              <i class="fa-solid fa-check"></i>
            </div>
          </div>
        </div>
      </div>
      <button 
        type="button" 
        class="btn btn-success p-2 text-light"
        @click="showMoreServices">
        {{ showAllServices ? 'Mostra Meno' : 'Mostra Tutti' }}
      </button>
      <p class="fw-bold my-2">NB: Inserisci almeno un servizio </p>
      <button :disabled="store.formSubmitted" class="btn btn-primary w-100">Salva Modifiche</button>
    </form>
  </div>
</template>


<style lang="scss" scoped>
.container {
  max-width: 1000px;
  margin: auto;

  h1 {
    font-weight: bold;
    color: #2c3e50;
  }
}

.service-item {
  border: 1px solid #ddd;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
}

button {
  &.btn-primary {
    background-color: #3498db;
    border-color: #3498db;
    color: white;
    font-size: 16px;
    font-weight: bold;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #2980b9;
    }
  }

  &.btn-link {
    background: none;
    border: none;
    color: #3498db;
    text-decoration: underline;
    font-size: 14px;
    padding: 0;
    cursor: pointer;

    &:hover {
      color: #2980b9;
    }
  }
}

.form-label {
  font-weight: 500;
}

input,
label {
  margin-bottom: 10px;
}

.services-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  gap: 10px;

  .service-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 10px;
    width: 225px;
    height: 60px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s, background-color 0.3s;
    cursor: pointer;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }

    &.selected {
      background-color: #7b29883f;
      border-color: #e352fa;
      box-shadow: 0 6px 12px #58206144;

      .checkmark {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #28a745;
        color: #fff;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        margin-left: 10px;
        animation: pop-in 0.3s forwards;
      }
    }

    .service-content {
      display: flex;
      align-items: center;
      gap: 10px;

      .service-icon {
        font-size: 20px;
        color: #3498db;
      }

      .service-title {
        font-size: 14px;
        font-weight: bold;
        color: #2c3e50;
        white-space: nowrap;
        overflow: hidden; 
        text-overflow: ellipsis;
      }
    }
  }

  @keyframes pop-in {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
}

</style>
