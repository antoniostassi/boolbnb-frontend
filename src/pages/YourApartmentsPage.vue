<script>
import axios from 'axios';
import { store } from '../store';

export default {
  data() {
    return {
      store,
      apartments: [], // Elenco degli appartamenti
      userId: null, // ID dell'utente
    };
  },
  mounted() {
    this.getUser()
  },
  methods: {
    // Metodo per ottenere gli appartamenti
    async getUser(){
       await axios.get('http://localhost:8000/api/user')
        .then((response)=>{
          console.log(response.data.id)
          this.userId = response.data.id
          this.getApartments(this.userId)
        })
    },
    getApartments(userId) {
      axios
        .get(`http://localhost:8000/api/apartments?user_id=` + this.userId)
        .then((response) => {
          this.apartments = response.data;
        })
        .catch((error) => {
          console.error("Errore nel caricamento degli appartamenti:", error);
        });
    },
    // Metodo per eliminare un appartamento
    deleteApartment(apartmentId) {
      if (confirm("Sei sicuro di voler eliminare questo appartamento?")) {
        axios
          .delete(`http://localhost:8000/api/apartments/${apartmentId}`)
          .then(() => {
            // Aggiorna la lista degli appartamenti dopo l'eliminazione
            this.apartments = this.apartments.filter(
              (apartment) => apartment.id !== apartmentId
            );
          })
          .catch((error) => {
            console.error("Errore durante l'eliminazione dell'appartamento:", error);
          });
      }
    },
    // Metodo per navigare alla pagina di modifica
    editApartment(apartmentId) {
      this.store.currentApartment = apartmentId;
      this.$router.push({ name: "edit-apartment", params: { id: apartmentId } });
    },
    // Metodo per creare un nuovo appartamento
    createApartment() {
      this.$router.push({ name: "create-apartment" });
    },
  },
};
</script>

<template>
  <div>
    <h2>Appartamenti dell'utente</h2>

    <!-- Pulsante per creare un nuovo appartamento -->
    <button @click="createApartment" class="btn btn-success btn-sm">
      + Crea
    </button>

    <!-- Tabella degli appartamenti -->
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Titolo della struttura</th>
          <th scope="col">Indirizzo della struttura</th>
          <th scope="col">Azioni</th>
        </tr>
      </thead>
      <tbody>
        <!-- Itera sugli appartamenti -->
        <tr v-for="(apartment, index) in apartments" :key="index">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ apartment.title }}</td>
          <td>{{ apartment.address }}</td>
          <td>
            <!-- Pulsante per vedere i dettagli -->
            <button class="btn btn-success btn-sm me-3">Promuovi</button>
            <router-link
              :to="{ name: 'apartments-details', params: { id: apartment.id } }"
              class="btn btn-primary btn-sm me-3"
            >
              Vedi
            </router-link>
            <!-- Pulsante per modificare -->
            <button
              @click="editApartment(apartment.id)"
              class="btn btn-secondary btn-sm me-3"
            >
              Modifica
            </button>
            <!-- Pulsante per eliminare -->
            <button
              @click="deleteApartment(apartment.id)"
              class="btn btn-danger btn-sm me-3"
            >
              Elimina
            </button>
          </td>
        </tr>
        <!-- Messaggio se non ci sono appartamenti -->
        
      </tbody>
    </table>
    
  </div>
</template>

<style>
    .table {
    margin-top: 20px;
    }
</style>
