<script>
import axios from "axios";
import SingleApartment from "../components/SingleApartment.vue";

export default {
  data() {
    return {
      apartments: [], // Lista degli appartamenti
      pagination: {
        currentPage: 1, // Pagina corrente
        lastPage: 0, // Numero totale di pagine
        total: 0 // Numero totale di appartamenti
      },
    };
  },
  components: {
    SingleApartment,
  },
  mounted() {
    this.getApartments(); // Carica gli appartamenti alla prima renderizzazione
  },
  methods: {
    getApartments(page = 1) {
      axios
        .get(`http://localhost:8000/api/apartments?page=${page}`)
        .then((response) => {
          console.log("Risposta API:", response.data);

          // Aggiorna gli appartamenti aggiungendo un'immagine Picsum generata e filtrando l'indirizzo
          this.apartments = response.data.data.map((apartment) => {
            
            return {
              id: apartment.id,
              title: apartment.title,
              address: apartment.address,
              apartment_size: apartment.apartment_size,
              rooms: apartment.rooms,
              image: `https://picsum.photos/seed/${apartment.id}/400/400`
            };
          });

          // Aggiorna la paginazione con i dati restituiti dall'API
          this.pagination = {
            currentPage: response.data.current_page,
            lastPage: response.data.last_page,
            total: response.data.total
          };
        })
        .catch((error) => {
          console.error("Errore nel caricamento degli appartamenti:", error);
        });
    },
  }
};
</script>

<template>
  <div class="container my-3">
    <!-- Lista degli appartamenti -->
    <div class="row d-flex flex-wrap">
      <div
        v-for="(apartment, index) in apartments"
        :key="apartment.id"
        class="col-12 col-sm-6 col-lg-3 p-3 m-auto d-flex justify-content-center"
      >
      <div class="apartment-card-wrapper">
        <SingleApartment :apartment="apartment" :index="index" />
      </div>
        
      </div>
    </div>

    <!-- Paginazione -->
    <div class="pagination">
      <button 
        @click="getApartments(pagination.currentPage - 1)" 
        :disabled="pagination.currentPage === 1"
        class="pagination-button"
      >
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <span class="pagination-info">
        Pagina {{ pagination.currentPage }} di {{ pagination.lastPage }}
      </span>
      <button 
        @click="getApartments(pagination.currentPage + 1)" 
        :disabled="pagination.currentPage === pagination.lastPage"
        class="pagination-button"
      >
        <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<style lang="scss">
.container {
  max-width: 1400px; // Ingrandisci il container per dare più spazio alle card
  margin: 0 auto; // Centra il container
}

.row {
  margin: 30px 0;
}



.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;

  .pagination-button {
    padding: 10px;
    border: 2px solid #E352FA; // Colore viola per il bordo
    border-radius: 50%;
    background: none;
    color: #E352FA; // Colore viola per il testo e le frecce
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;

    &:hover {
      background-color: #E352FA;
      color: #fff;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
      color: #aaa;
      border-color: #aaa;
    }

    i {
      font-size: 1.2rem;
    }
  }

  .pagination-info {
    font-size: 1.1rem;
    font-weight: bold;
    color: #333;
  }
}
</style>
