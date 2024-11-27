<script>
import { api, store } from '../../store';
import axios from 'axios';
import * as services from '@tomtom-international/web-sdk-services';

export default {
    data() {
        return {
            api, // Importo API dallo store
            store, // Importo store dallo store
            apartment : { // Oggetto apartment con dati vuoti
                services: [], // Array servizi vuota il quale all'interno verranno pushati i servizi che ha l'appartamento
                address: '', // Array indirizzo vuoto il quale all'interno verrà pushato l'indirizzo dell'appartamento (Dato da TomTom)
                latitude: null, // Latitudine dell'apartment settato a 0
                longitude: null, // Longitudine dell'apartment settato a 0
            },
            suggestions: [], // Array il quale all'interno verranno pushate i suggerimenti di indirizzo
            apiKey: 'Wuj8g5xvkgHJPaT4SjFEwshVAT3SbkVQ', // ApiKey di Gaetano (TomTom)
            showAllServices: false, // Controlla se mostrare tutti i servizi
        };
    },
    computed: {
        visibleServices() {
            // Mostra tutti i servizi o solo i primi 4
            return this.showAllServices ? this.api.services : this.api.services.slice(0, 4);
        },
    },
    mounted(){
        this.store.servicesEmpty = false; // Richiama servicesEmpty dallo store (leggi store)
    },
    methods: {
        toggleService(serviceId) {
            if (this.apartment.services.includes(serviceId)) {
                const index = this.apartment.services.indexOf(serviceId);
                this.apartment.services.splice(index, 1);
            } else {
                this.apartment.services.push(serviceId);
            }
        },
        showMoreServices() {
            this.showAllServices = !this.showAllServices; // Alterna tra mostrare più o meno servizi
        },
        delayOnAPI(){
            setTimeout(() => {
                this.store.formSubmitted = false; // Funzione per richiamare formSubmitted dallo store con un ritardo di 2 secondi
            }, 2000);
        },
        fetchSuggestions(query) { // Funzione che chiama i suggerimenti quando si inserisce l'indirizzo all'interno dell'input
            if (query.length < 3) { // Se la richiesta dell'indirizzo ha meno di 3 caratteri
                this.suggestions = []; // L'array dei suggerimenti si svuota e non vengono mostrati suggerimenti
                return;
            }

            services.services.fuzzySearch({ // Tramite services del pacchetto TomTom, si richiama questa funzione (Sempre di TomTom) per effettuare la ricerca che richiede questi parametri
                key: this.apiKey, // ApiKey di Gaetano dichiarata precedentemente
                query: query, // Indirizzo inserito dall'utente
                language: 'it-IT', // Lingua italiana dei suggerimenti
                limit: 10, // Limite di suggerimenti inseriti dentro l'array e quindi mostrati all'utente
                countrySet: ['IT'] // Gli indirizzi fanno parte solo dell'Italia (Limite settato per rendere più semplice la ricerca)
            })
            .then((response) => { // Risposta della chiamata API
                this.suggestions = response.results.map((result) => ({ // I suggerimenti dichiarati precedentemente (e vuoti) vengono riempiti con i parametri (Indirizzo e posizione) forniti dalla risposta della chiamata API verso TomTom
                    address: result.address.freeformAddress, // Indirizzo suggerito
                    position: result.position, // Posizione dell'indirizzo suggerito
                }));
            })
            .catch((error) => {
                console.error('Errore durante la ricerca:', error); // Nel caso ci fosse un errore, spunterà in console in rosso
            });
        },

        selectSuggestion(suggestion) { // Funzione quando si clicca su un suggerimento con argomento (suggerimento)
            this.apartment.address = suggestion.address; // L'indirizzo dell'appartamento viene riempito con l'indirizzo selezionato dai suggerimenti
            this.apartment.latitude = suggestion.position.lat; // La latitudine dell'appartamento viene riempito con la latitudine presa dalla posizione dell'indirizzo dell'appartamento selezionato
            this.apartment.longitude = suggestion.position.lng; // La longitudine dell'appartamento viene riempito con la longitudine presa dalla posizione dell'indirizzo dell'appartamento selezionato
            this.suggestions = []; // Una volta selezionato un indirizzo, l'array "Suggerimenti" si svuota e spariscono i suggerimenti
        },

        createApartment() { // Funzione per creare un appartamento
            this.store.formSubmitted = true; // formSubmitted dallo store diventa true, quindi viene inviato il form
            this.delayOnAPI(); // Si richiama il ritardo della funzione di 2 secondi
            this.store.servicesEmpty = false; // serviceEmpty dallo store viene dichiarato false in quanto esistono dei servizi
            if(this.apartment.services.length == 0){ // Nel caso non dovessero esistere servizi
                this.store.servicesEmpty = true; // serviceEmpty dallo store viene dichiarato true in quanto non esistono dei servizi
                return
            }
            axios
            .post('http://localhost:8000/api/apartments', { // Chiamata per pushare all'interno dell'apartment i dati richiesti
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
            .then((result) => { // Dopo la chiamata, se va a buon fine, appare un alert di successo e si viene reindirizzati alla dashboard
                console.log('Risultato:', result);
                alert('Appartamento creato con successo');
                this.api.getUserApartments();
                this.$router.push('/user/dashboard')
            })
            .catch((error) => { // Se va in errore in console apparirà l'errore
                console.log(error);
            })
        },
    },
}
</script>

<template>
    <div class="container my-5">
      <h1 class="text-center mb-4">Aggiungi un nuovo appartamento</h1>
      <form @submit.prevent="createApartment" class="p-4 border rounded shadow" validate>
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
            placeholder="Inserisci il titolo"
          />
        </div>
        <div class="row">
          <div class="col-md-3 mb-3">
            <label class="form-label" for="rooms">Numero di stanze <span class="text-danger">*</span></label>
            <input
              class="form-control"
              type="number"
              name="rooms"
              v-model="apartment.rooms"
              placeholder="Inserisci il numero di stanze"
              step="1"
              min="1"
              max="20"
              required
            />
          </div>
          <div class="col-md-3 mb-3">
            <label class="form-label" for="beds">Numero di letti <span class="text-danger">*</span></label>
            <input
              class="form-control"
              type="number"
              name="beds"
              v-model="apartment.beds"
              placeholder="Inserisci il numero di letti"
              step="1"
              min="1"
              max="20"
              required
            />
          </div>
          <div class="col-md-3 mb-3">
            <label class="form-label" for="bathrooms">Numero di bagni <span class="text-danger">*</span></label>
            <input
              class="form-control"
              type="number"
              v-model="apartment.bathrooms"
              placeholder="Inserisci il numero di bagni"
              min="1"
              step="1"
              max="10"
              name="bathrooms"
              required
            />
          </div>
          <div class="col-md-3 mb-3">
            <label class="form-label" for="apartment_size">Metri quadrati <span class="text-danger">*</span></label>
            <input
              class="form-control"
              type="number"
              name="apartment_size"
              v-model="apartment.apartment_size"
              placeholder="Inserisci i metri quadrati"
              min="7"
              step="1"
              max="500"
              required
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
            placeholder="Inserisci il link dell'immagine"
          />
        </div>
  
        <!-- Servizi -->
        <h3>Servizi</h3>
        <p v-show="store.servicesEmpty" class="fw-bold text-danger">Inserisci almeno un servizio!</p>
        <div class="row mb-3 services-container">
          <div
            class="service-badge"
            v-for="(service, index) in visibleServices"
            :key="index"
            :class="{ selected: apartment.services.includes(service.id) }"
            @click="toggleService(service.id)"
          >
            <div class="service-content">
              <div class="service-icon">
                <i class="fa-solid fa-mug-saucer"></i>
              </div>
              <span class="service-title">{{ service.title }}</span>
              <div v-if="apartment.services.includes(service.id)" class="checkmark">
                <i class="fa-solid fa-check"></i>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Bottone per mostrare più/meno servizi -->
        <button
          type="button"
          class="btn btn-success p-2 text-light mb-3"
          @click="showMoreServices"
        >
          {{ showAllServices ? "Mostra Meno" : "Mostra Tutti" }}
        </button>
  
        <p class="fw-bold my-2">NB: Inserisci almeno un servizio</p>
  
        <button class="btn btn-success w-100" :disabled="store.formSubmitted">Aggiungi Appartamento</button>
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