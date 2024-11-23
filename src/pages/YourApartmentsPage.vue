<script>
import axios from 'axios';
import { store, api } from '../store';

export default {
  data() {
    return {
      store, api,
    };
  },

  methods: {
    // Metodo per eliminare un appartamento
    deleteApartment(apartmentId) {
      if (confirm("Sei sicuro di voler eliminare questo appartamento?")) {
        axios
          .delete(`http://localhost:8000/api/apartments/${apartmentId}`)
          .then(() => {
            // Aggiorna la lista degli appartamenti dopo l'eliminazione
            this.api.getUserApartments();
          })
          .catch((error) => {
            console.error("Errore durante l'eliminazione dell'appartamento:", error);
          });
      }
    },
    // Metodo per navigare alla pagina di modifica
    navigateToEditApartment(apartmentId) {
      this.store.currentApartment = apartmentId;
      this.$router.push({ name: "edit-apartment", params: { id: apartmentId } });
    },
    // Metodo per creare un nuovo appartamento
    navigateToCreateApartment() {
      this.$router.push({ name: "create-apartment" });
    },
  },
};
</script>

<template>
  <div>
    <h2>Appartamenti dell'utente</h2>

    <!-- Pulsante per creare un nuovo appartamento -->
    <button @click="navigateToCreateApartment" class="btn btn-success btn-sm">
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
        <tr v-for="(apartment, index) in this.api.user.apartments" :key="index">
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
              @click="navigateToEditApartment(apartment.id)"
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
