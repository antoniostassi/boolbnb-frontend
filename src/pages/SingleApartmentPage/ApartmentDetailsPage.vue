<script>
import axios from 'axios';
import tt from '@tomtom-international/web-sdk-maps';
import { markRaw } from 'vue';
import { store } from '../../store';

export default {
  data() {
    return {
        store, // Import dello store
        apartment: null, // Variabile apartment vuota
        map: null, // Variabile map vuota
        mapCenter: { // Oggetto vuoto con il centro della mappa
          lat: 0,  // Latitudine settata a 0 di default
          lng: 0 // Longitudine settata a 0 di default
        },
        showMessageError: false,
        blockButton: false,
        messageSent: false,
        sameEmail: false,
        contactForm: { // Oggetto vuoto del form di contatto del proprietario
          UserEmail: '', 
          UserName: '',
          UserSurname: '',
          message: '', 
        },
    };
  },
  props: {
    id: {   // Prop per il passaggio dell'ID dell'appartamento
        type: String, 
        required: true,
    },
  },
  mounted() {
    this.getApartment(); // Chiamo la funzione prima al "mount" della pagina
  },
  methods: {
    
    delayOnAPI(){
      setTimeout(() => {
          this.blockButton = false;
      }, 2000);
    },

    getApartment() {
      axios
        .get(`http://localhost:8000/api/apartments/${this.id}`) // Chiamata verso l'appartamento con l'ID selezionato
        .then((response) => {
          this.apartment = response.data[0]; // Pusho dentro la variabile apartment l'oggetto con i parametri dell'apartment

          if (this.apartment.latitude && this.apartment.longitude) { // Se esistono latitudine e longitudine dell'appartamento
            this.mapCenter = { // Pusha dentro mapCenter i seguenti valori
              lat: this.apartment.latitude, // Latitudine dell'appartamento
              lng: this.apartment.longitude, // Longitudine dell'appartamento
            };
            this.initializeMap(); // Successivamente, esegui la funzione di inizializzazione mappa
          }

          this.store.currentApartment = this.id; // CurrentApartment all'interno dello store viene riempito con l'ID dell'appartamento selezionato
        })
        .catch((error) => {
          console.error(error); // Nel caso dovesse andare in errore, in console uscirà questo errore
        });
    },
    initializeMap() {
      this.$nextTick(() => { // NextTick serve per fare eseguire la funzione subito dopo il caricamento dei dati, altrimenti faila
        this.map = markRaw( // MarkRaw è un elemento di Vue per rendere statico un elemento dinamico (Serve per far apparire la mappa)
          tt.map({
            key: 'Wuj8g5xvkgHJPaT4SjFEwshVAT3SbkVQ', // Api Key dell'account di Gaetano per accedere alla funzione
            container: 'map', // Il contenitore della mappa ha l'ID della mappa
            center: [this.mapCenter.lng, this.mapCenter.lat], // Il centro della mappa viene riempito con i valori di mapCenter
            zoom: 15, // Altezza dal quale vedremo la mappa al caricamento della pagina
          })
        );

        const customMarker = document.createElement('div'); // Creazione del marker modificato a nostro piacimento
        customMarker.style.backgroundImage =
          'url("https://cdn-icons-png.flaticon.com/512/684/684908.png")'; // Icona del marker presa da internet
        customMarker.style.backgroundSize = 'cover'; // Grandezza del background del marker
        customMarker.style.width = '40px'; // Larghezza del marker
        customMarker.style.height = '40px'; // Lunghezza del marker
        customMarker.style.borderRadius = '50%'; // Border-radius del marker

        markRaw( // MarkRaw è un elemento di Vue per rendere statico un elemento dinamico (Serve per far apparire il marker) 
          new tt.Marker({ element: customMarker })  // Creazione del marker con proprietà di CustomMarker definite sopra
            .setLngLat([this.mapCenter.lng, this.mapCenter.lat]) // Posizione nel quale il marker dovrà stare, definite dai dati di mapCenter
            .addTo(this.map) // Aggiunta del marker alla mappa
        );
      });
    },
    sendMessage() {

        this.showMessageError = false;
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
          // svuoto il form dopo il corretto invio
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
          this.showMessageError = true;
        })
        this.delayOnAPI();
    },
  },
};

</script>

<template>
    <div class="apartment-details p-3">
      <!-- Caricamento in corso, oppure appartamento non trovato -->
      <div v-if="apartment === null" class="loading">
        <p>
            Caricamento in corso o appartamento non trovato...
        </p> 
      </div>
  
      <!-- Dettagli dell'appartamento -->
      <div v-else class="details-container">
        <h1 class="apartment-title">
            {{ apartment.title }}
        </h1>
        <img :src="apartment.image" :alt="apartment.title" class="apartment-image w-100">
        <p class="apartment-description">
          <strong>Indirizzo:</strong> {{ apartment.address }} <br>
          <strong>N. Stanze:</strong> {{ apartment.rooms }} <br>
          <strong>Metri Quadrati:</strong> {{ apartment.apartment_size }} <br>
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
          <!-- Se nome e cognome nel db esistono (e non sono null), appare la dicitura Nome: Nome Cognome -->
          <p v-if="apartment.user?.firstname && apartment.user?.lastname">
            <strong>Nome:</strong> {{ apartment.user?.firstname }} {{ apartment.user.lastname }}
          </p>
          <!-- Se l'email esiste (ma è obbligatoria), appare la dicitura Email: Email proprietario -->
          <p v-if="apartment.user?.email">
            <strong>Email:</strong> {{ apartment.user?.email }}
          </p>
  
          <!-- Accordion con il form preso da Bootstrap -->
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
                    <p v-show="showMessageError" class="text-danger">Errore nell'invio del messaggio: controlla i campi inseriti o riprova più tardi</p>
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
        <!-- Se esiste l'appartamento, e latitudine e longitudine di mapCenter sono stati riempiti, appare la mappa -->
        <div v-if="apartment && mapCenter.lat && mapCenter.lng" class="map-section">
            <h2>Posizione dell'appartamento</h2>
            <!-- Container della mappa con ID = map per riprendere il container: map della creazione mappa nello script -->
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
