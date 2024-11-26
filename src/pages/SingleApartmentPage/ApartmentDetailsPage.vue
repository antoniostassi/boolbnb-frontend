<script>
import axios from 'axios';
import tt from '@tomtom-international/web-sdk-maps';
import { markRaw } from 'vue';
import { store } from '../../store';

export default {
  data() {
    return {
      apartment: null,
      map: null,
      mapCenter: { lat: 0, lng: 0 },
      store,
      blockButton: false,
      messageSent: false,
      sameEmail: false,
      contactForm: {
        UserEmail: '',
        UserName: '',
        UserSurname: '',
        message: '',
      },
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
    
    delayOnAPI(){
      setTimeout(() => {
          this.blockButton = false;
      }, 2000);
    },

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
        })
        .catch((error) => {
          console.error(error);
        });
    },
    initializeMap() {
      this.$nextTick(() => {
        this.map = markRaw(
          tt.map({
            key: 'Wuj8g5xvkgHJPaT4SjFEwshVAT3SbkVQ',
            container: 'map',
            center: [this.mapCenter.lng, this.mapCenter.lat],
            zoom: 15,
          })
        );

        const customMarker = document.createElement('div');
        customMarker.style.backgroundImage =
          'url("https://cdn-icons-png.flaticon.com/512/684/684908.png")';
        customMarker.style.backgroundSize = 'cover';
        customMarker.style.width = '40px';
        customMarker.style.height = '40px';
        customMarker.style.borderRadius = '50%';

        markRaw(
          new tt.Marker({ element: customMarker })
            .setLngLat([this.mapCenter.lng, this.mapCenter.lat])
            .addTo(this.map)
        );
      });
    },
    sendMessage() {
        this.sameEmail = false;
        this.blockButton = true;
        if(this.apartment.user.email == this.contactForm.UserEmail){
          this.sameEmail = true;
          this.delayOnAPI();
          return
        }
        axios.post('http://localhost:8000/api/messages', {
          content: this.contactForm.message,
          user_email: this.contactForm.UserEmail,
          firstname: this.contactForm.UserName,
          lastname: this.contactForm.UserSurname,
          apartment_id: this.apartment.id
        })
        .then((result)=> {
          console.log('messaggio inviato', result);
          this.messageSent = true;
          this.contactForm.UserEmail = '',
          this.contactForm.UserName = '',
          this.contactForm.UserSurname = '',
          this.contactForm.message = '',
          setTimeout(() => {
          this.messageSent = false;
          }, 10000);
        })
        .catch((error)=> {
          console.log(error);
        })
        this.delayOnAPI();
    },
  },
};

</script>

<template>
    <div class="apartment-details p-3">
      <!-- Caricamento in corso -->
      <div v-if="apartment === null" class="loading">
        <p>Caricamento in corso o appartamento non trovato...</p>
      </div>
  
      <!-- Dettagli dell'appartamento -->
      <div v-else class="details-container">
        <h1 class="apartment-title">{{ apartment.title }}</h1>
        <img :src="apartment.image" :alt="apartment.title" class="apartment-image w-100">
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
  
          <!-- Accordion con il form -->
          <div class="accordion" id="contactAccordion">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingContact">
                <button
                  class="accordion-button collapsed btn-custom"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseContact"
                  aria-expanded="false"
                  aria-controls="collapseContact"
                >
                  Contatta il Proprietario
                </button>
              </h2>
              <div
                id="collapseContact"
                class="accordion-collapse collapse"
                aria-labelledby="headingContact"
                data-bs-parent="#contactAccordion"
              >
                <div class="accordion-body">
                  <form @submit.prevent="sendMessage">
                    <div class="mb-3">
                      <label for="email" class="form-label">La tua Email <span class="text-danger">*</span></label>
                      <input
                        type="email"
                        id="email"
                        v-model="contactForm.UserEmail"
                        class="form-control"
                        placeholder="Inserisci la tua email"
                        required
                      />
                    </div>
                    <div class="mb-3">
                      <label for="user_name" class="form-label">Nome</label>
                      <input
                        type="text"
                        id="user_name"
                        v-model="contactForm.UserName"
                        class="form-control"
                        placeholder="Inserisci il tuo nome"
                        minlength="3"
                        maxlength="64"
                      />
                    </div>
                    <div class="mb-3">
                      <label for="user_surname" class="form-label">Cognome</label>
                      <input
                        type="text"
                        id="user_surname"
                        v-model="contactForm.UserSurname"
                        class="form-control"
                        placeholder="Inserisci il tuo cognome"
                        minlength="3"
                        maxlength="64"
                      />
                    </div>
                    <div class="mb-3">
                      <label for="message" class="form-label">Messaggio <span class="text-danger">*</span></label>
                      <textarea
                        id="message"
                        v-model="contactForm.message"
                        class="form-control"
                        rows="4"
                        placeholder="Scrivi il tuo messaggio"
                        required
                        minlength="5"
                        maxlength="2048"
                      ></textarea>
                    </div>
                    <p v-show="sameEmail" class="text-danger fw-bold">Errore: Non puoi mandare una mail a te stesso</p>
                    <p v-show="messageSent" class="text-success fw-bold">Messaggio inviato correttamente.</p>
                    <p>I campi contrassegnati con <span class="text-danger">*</span> sono obbligatori.</p>
                    <button :disabled="blockButton" type="submit" class="btn btn-custom w-100">
                      Invia Messaggio
                    </button>
                    
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Mappa -->
        <div v-if="apartment && mapCenter.lat && mapCenter.lng" class="map-section">
          <h2>Posizione dell'appartamento</h2>
          <div id="map"></div>
        </div>
      </div>
    </div>
  </template>
  

<style lang="scss" scoped>
.apartment-details {
  font-family: 'Arial', sans-serif;
  margin: 20px auto;
  max-width: 800px;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.apartment-title {
  font-size: 2rem;
  color: #4A4A4A;
  text-align: center;
  margin-bottom: 20px;
}

.apartment-image {
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
}

.apartment-description {
  font-size: 1.1rem;
  color: #333;
  line-height: 1.5;
  margin-bottom: 20px;
}

.services {
  margin-bottom: 20px;
  h3 {
    font-size: 1.5rem;
    color: #4A90E2;
  }
  ul {
    list-style: none;
    padding: 0;
    li {
      background-color: #e8f4fa;
      margin: 5px 0;
      padding: 10px;
      border-radius: 5px;
      color: #333;
    }
  }
}

.owner-section {
  margin: 30px 0;
  padding: 20px;
  background-color: #fff3e6;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    h2 {
        font-size: 1.5rem;
        color: #F57C00;
        margin-bottom: 10px;
    }
}

.accordion-item {

    background-color: #E8F4FA;

    .accordion-button {
        font-weight: bold;
        transition: all 0.3s ease-in-out;
        background-color: #E8F4FA;
            &:hover {
                background-color: #E8F4FA;
            }
            &:not(.collapsed) {
                color: #E8F4FA;
                background-color: #e352fa;
                box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.125);
            }
        }

        .accordion-body {
        padding: 15px;
        background-color: #E8F4FA;
        border-radius: 5px;

        .btn-custom {
            background-color: #e352fa;
            color: white;
            font-weight: 700;
        }
        }
}


.map-section {
  margin: 20px 0;
  text-align: center;
  #map {
    height: 400px;
    width: 100%;
    border-radius: 10px;
    margin-top: 10px;
  }
}

</style>
