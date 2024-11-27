<script>
import axios from 'axios';
import { store, api } from '../../store';

export default {
  data() {
    return {
      store, api,
    };
  },
  mounted() {
    this.api.redirectIfNotAuth();
  },
  methods: {
    deleteApartment(apartmentId) {
      if (confirm("Sei sicuro di voler eliminare questo appartamento?")) {
        axios
          .delete(`http://localhost:8000/api/apartments/${apartmentId}`)
          .then(() => {
            this.api.getUserApartments();
          })
          .catch((error) => {
            console.error("Errore durante l'eliminazione dell'appartamento:", error);
          });
      }
    },
    editApartment(apartmentId) {
      this.store.currentApartment = apartmentId;
      this.$router.push({ name: "edit-apartment" });
    },
    createApartment() {
      this.$router.push({ name: "create-apartment" });
    },
  },
};
</script>

<template>
  <div class="dashboard-page">
    <div class="header">
      <h2 class="dashboard-title">I tuoi appartamenti</h2>
      <button @click="createApartment" class="create-button">
        Aggiungi appartamento
      </button>
    </div>

    <!-- Tabella -->
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Titolo</th>
            <th class="address-column">Indirizzo</th>
            <th class="text-center">Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(apartment, index) in this.api.user.apartments" :key="index">
            <td>{{ apartment.title }}</td>
            <td class="address-column">{{ apartment.address }}</td>
            <td class="actions">
              <router-link
                :to="{ name: 'apartments-details', params: { id: apartment.id } }"
                class="view-button"
              >
                <i class="fa-solid fa-eye"></i>
              </router-link>
              <button
                @click="editApartment(apartment.id)"
                class="edit-button"
              >
                <i class="fa-solid fa-pencil"></i>
              </button>
              <button
                @click="deleteApartment(apartment.id)"
                class="delete-button"
              >
                <i class="fa-solid fa-trash-can"></i>
              </button>
              <router-link :to="{ name:'profile-page' }" class="view-button bg-secondary" @click="store.messageFilter = apartment.title; store.apartmentIndex = index">
                <i class="fa-solid fa-envelope"></i>
              </router-link>
            </td>
          </tr>
          <tr v-if="!this.api.user?.apartments?.length">
            <td colspan="4" class="no-apartments">
              Nessun appartamento disponibile
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-page {
  font-family: 'Arial', sans-serif;
  padding: 20px;
  max-width: 1200px;
  margin: auto;
  background-color: #f9f9f9;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .dashboard-title {
      font-size: 2rem;
      color: #4a4a4a;

      @media (max-width: 576px) {
        font-size: 1.5rem;
      }
    }

    .create-button {
      padding: 10px 20px;
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: #388e3c;
      }
    }
  }

  .table-container {
    overflow:auto;
    max-height:500px;

    .table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);

      tr {
        display: flex;
        width: 100%; /* Imposta larghezza della riga */
        flex-wrap: nowrap; /* Evita che le celle vadano su più righe */
      }

      th,
      td {
        flex: 1; /* Tutte le celle hanno la stessa altezza */
        text-align: left;
        padding: 12px;
        border-bottom: 1px solid #ddd;
        color: #555;
        word-wrap: break-word; 
        font-weight: bold;
        background-color: #f4f4f4;
      }

      td {
        display: flex;
        align-items: center; /* Allinea verticalmente i contenuti */
      }

      tr:hover {
        background-color: #f9f9f9;
      }

      .address-column {
        @media (max-width: 992px) {
          display: none;
        }
      }

      .actions {
        justify-content: center; /* Centra i pulsanti */
        gap: 8px; /* Spaziatura tra i pulsanti */
      }
    }

    .no-apartments {
      text-align: center;
      padding: 20px;
      font-size: 1.2rem;
      color: #999;
    }
  }

  .promote-button, .view-button, .edit-button, .delete-button {
    padding: 6px 10px;
    font-size: 14px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.2s;
    display: flex;
    align-items: center;

    &:hover {
      transform: scale(1.05);
    }
  }

  .promote-button {
    background-color: #ff9800;
    color: white;

    &:hover {
      background-color: #e65100;
    }
  }

  .view-button {
    background-color: #2196f3;
    color: white;
    text-decoration: none;
    text-align: center;

    &:hover {
      background-color: #0d47a1;
    }
  }

  .edit-button {
    background-color: #ffeb3b;
    color: black;

    &:hover {
      background-color: #fbc02d;
    }
  }

  .delete-button {
    background-color: #f44336;
    color: white;

    &:hover {
      background-color: #b71c1c;
    }
  }
}
</style>
