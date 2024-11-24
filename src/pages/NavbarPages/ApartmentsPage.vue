<script>
import axios from "axios";
import SingleApartment from "../../components/SingleApartment.vue";

export default {
  data() {
    return {
      paginationClick: false,
      apartments: [], // Lista degli appartamenti
      pagination: {
        currentPage: 1, // Pagina corrente
        firstPage:1,
        lastPage: 0, // Numero totale di pagine
        total: 0, // Numero totale di appartamenti
        prevPage:'',
        nextPage:'',
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
    refreshButtons(){
      setTimeout(() => {
        this.paginationClick = false
      }, 2000);
    },
    getApartments(page = 1) {
      this.paginationClick = true;
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
            total: response.data.total,
            prevPage: response.data.current_page - 1,
            nextPage: response.data.current_page + 1,
          };

        })
        .catch((error) => {
          console.error("Errore nel caricamento degli appartamenti:", error);
        });
      this.refreshButtons();
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
        class="col-12 col-sm-6 col-lg-3 p-3 d-flex justify-content-center"
      >
      <div class="apartment-card-wrapper w-100">
        <SingleApartment :apartment="apartment" :index="index" />
      </div>
        
      </div>
    </div>

    <!-- Paginazione -->
    <div class="d-flex justify-content-center">
      <div class="pagination">
        <!-- 0) button prima pagina -->
        <button class="page-item" :disabled="pagination.currentPage == 1 || paginationClick" @click="getApartments(pagination.currentPage = 1)">
          <a href="#main-container" class="page-link" :class="pagination.currentPage == 1 ? 'disabled':''"><<</a> 
        </button>
        <!-- 0) -->
        <!-- 0.1) si vedono solo sull'ultima pagina -->
        <button class="page-item" v-show="pagination.currentPage == pagination.lastPage" :disabled="paginationClick"  @click="getApartments(pagination.currentPage = pagination.prevPage - 3)">
          <a href="#main-container" class="page-link">{{ pagination.currentPage - 4 }}</a>
        </button>
        <button  class="page-item" v-show="pagination.currentPage == pagination.lastPage" :disabled="paginationClick" @click="getApartments(pagination.currentPage = pagination.prevPage - 2)">
          <a href="#main-container" class="page-link">{{ pagination.currentPage - 3 }}</a>
        </button>
        <!-- 0.1) -->

       
        <button class="page-item" v-show="pagination.prevPage > 0 && pagination.prevPage - 1 != 0" :disabled="paginationClick" @click="getApartments(pagination.currentPage = pagination.prevPage - 1)">
          <a href="#main-container" class="page-link">{{ pagination.prevPage - 1 }}</a>
        </button>

        <!-- 2) se è 0 non viene mostrato in pagina -->
        <button class="page-item" :disabled="paginationClick" v-show="pagination.prevPage > 0" @click="getApartments(pagination.currentPage = pagination.prevPage)">
          <a href="#main-container" class="page-link">{{ pagination.prevPage }}</a>
        </button>
        <!-- 2) -->
        <!-- 3) current page -->
        <button disabled class="page-item">
          <a href="#main-container" class="page-link bg-primary text-white" >{{ pagination.currentPage }}</a>
        </button>
        <!-- 3) -->
        <!-- 4) non viene mostrato se siamo sull'ultima pagina -->
        <button class="page-item" v-show="pagination.currentPage != pagination.lastPage" :disabled="pagination.currentPage == pagination.lastPage || paginationClick"  @click="getApartments(pagination.currentPage = pagination.nextPage)">
          <a href="#main-container" class="page-link" :class="pagination.currentPage == pagination.lastPage ? 'disabled':''">{{ pagination.nextPage }}</a>
        </button>
        <button  class="page-item" v-show="pagination.currentPage != pagination.lastPage && pagination.currentPage != pagination.lastPage - 1" :disabled="pagination.currentPage == pagination.lastPage || paginationClick" @click="getApartments(pagination.currentPage = pagination.nextPage + 1)">
          <a href="#main-container" class="page-link" :class="pagination.currentPage == pagination.lastPage ? 'disabled':''">{{ pagination.currentPage + 2 }}</a>
        </button>
        <!-- 4) -->
        <!-- 5) si vedono solo sulla prima pagina -->
        <button class="page-item" v-show="pagination.currentPage == 1" :disabled="pagination.currentPage == pagination.lastPage || paginationClick"  @click="getApartments(pagination.currentPage = pagination.nextPage + 2)">
          <a href="#main-container" class="page-link" :class="pagination.currentPage == pagination.lastPage ? 'disabled':''">{{ pagination.currentPage + 3 }}</a>
        </button>
        <button  class="page-item" v-show="pagination.currentPage == 1" :disabled="pagination.currentPage == pagination.lastPage || paginationClick" @click="getApartments(pagination.currentPage = pagination.nextPage + 3)">
          <a href="#main-container" class="page-link" :class="pagination.currentPage == pagination.lastPage ? 'disabled':''">{{ pagination.currentPage + 4 }}</a>
        </button>
        <!-- 5) -->


        <!-- button ultima pagina -->
        <button class="page-item" :disabled="pagination.currentPage == pagination.lastPage || paginationClick" @click="getApartments(pagination.currentPage = pagination.lastPage); console.log(paginationClick)">
          <a href="#main-container" class="page-link" :class="pagination.currentPage == pagination.lastPage ? 'disabled':''">>></a>
        </button>
        <!--  -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
button {
  padding:0;

}

.page-item {
  border:none;

}

.container {
  max-width: 1400px;
  margin: 0 auto;

}

.row {
  margin: 30px 0;

}

</style>
