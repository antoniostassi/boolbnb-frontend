<script>
import axios from 'axios';
import { store, api } from '../../store';

export default {
  data() {
    return {
      store, api,
    };
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
    navigateToEditApartment(apartmentId) {
      this.store.currentApartment = apartmentId;
      this.$router.push({ name: "edit-apartment", params: { id: apartmentId } });
    },
    navigateToCreateApartment() {
      this.$router.push({ name: "create-apartment" });
    },
  },
};
</script>

<template>
  <div class="dashboard-page">
    <div class="header">
      <h2 class="dashboard-title">I tuoi Appartamenti</h2>
      <button @click="navigateToCreateApartment" class="create-button">
        + Crea Nuovo
      </button>
    </div>

    <!-- Tabella -->
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Titolo</th>
            <th>Indirizzo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(apartment, index) in this.api.user.apartments" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ apartment.title }}</td>
            <td>{{ apartment.address }}</td>
            <td class="actions">
              <button class="promote-button">Promuovi</button>
              <router-link
                :to="{ name: 'apartments-details', params: { id: apartment.id } }"
                class="view-button"
              >
                Vedi
              </router-link>
              <button
                @click="navigateToEditApartment(apartment.id)"
                class="edit-button"
              >
                Modifica
              </button>
              <button
                @click="deleteApartment(apartment.id)"
                class="delete-button"
              >
                Elimina
              </button>
            </td>
          </tr>
          <tr v-if="!this.api.user.apartments.length">
            <td colspan="4" class="no-apartments">
              Non hai appartamenti disponibili.
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
    }

    .create-button {
      padding: 10px 20px;
      background-color: #4caf50;
      color: white;
      font-size: 1rem;
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

      th,
      td {
        text-align: left;
        padding: 12px;
        border-bottom: 1px solid #ddd;
        color: #555;
      }

      th {
        background-color: #f4f4f4;
        font-weight: bold;
        color: #333;
      }

      tr:hover {
        background-color: #f9f9f9;
      }

      .actions {
        display: flex;
        gap: 10px;
      }
    }

    .no-apartments {
      text-align: center;
      padding: 20px;
      font-size: 1.2rem;
      color: #999;
    }
  }

  .promote-button,
  .view-button,
  .edit-button,
  .delete-button {
    padding: 8px 12px;
    font-size: 0.9rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.2s;

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
