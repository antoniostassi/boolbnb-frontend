<script>

import tt from '@tomtom-international/web-sdk-maps';

import axios from "axios";
import SingleApartment from "../../components/SingleApartment.vue";
import { store, api, tomtom } from '../../store'
import FilterComponent from "../../components/ApartmentsComponents/FilterComponent.vue";
import SearchComponent from "../../components/ApartmentsComponents/SearchComponent.vue";
import AdditionalFilterComponent from '../../components/ApartmentsComponents/AdditionalFilterComponent.vue';

export default {
  data() {
    return {
      apartments: [], // Lista degli appartamenti
      api, store, tomtom,
      pagination: {
        currentPage: 1, // Pagina corrente
        firstPage:1,
        lastPage: 0, // Numero totale di pagine
        total: 0, // Numero totale di appartamenti
        prevPage:'',
        nextPage:'',
      },
      hideHeader: false,
    };
  },
  components: {
    SingleApartment,
    FilterComponent,
    SearchComponent,
    AdditionalFilterComponent
  },
  mounted() {
      // Aggiungi il listener per lo scroll
      window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
      // Rimuovi il listener quando il componente viene distrutto
      window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    testingBound(lat, lng) {
      const center = new tt.LngLat(this.tomtom.position.lng, this.tomtom.position.lat); // Posizione della ricerca
      const radiusMeters = tomtom.rangeFilter * 1000; // la variabile viene presa dall'input range e moltiplicata * 1000
      const boundingBox = center.toBounds(radiusMeters); // Creo il raggio di comparazione per le coordinate da confrontare.
      const coordsToCheck = new tt.LngLat(lng, lat); // Coordinata da controllare
      if(boundingBox.contains(coordsToCheck)) { 
        return true;
      };

      return false;
    },
    
    checkFilter(services, apartment) {
      //console.log(apartment);
      let aServices = apartment.services.map(function(element){
        return element.id; // Prendo soltanto gli ID dell'array Services.
      });
      //console.log(apartment.title+' : '+this.containsAny(services, aServices));
      return this.containsAny(services, aServices);
    },
    containsAny(activeServices, apartmentServices) {
      return apartmentServices.some(service => { // Il .some serve a sostituire il ciclo forEach, che altrimenti non verrebbe interrotto dal return true.
        if (activeServices.includes(service)) {
          console.log("Filtro presente: " + service);
          return true; // Interrompe e restituisce true
        }
        return false; // Se arriva qui vuol dire che nessun servizio dell'appartamento è presente tra i filtri selezionati.
      });
    },
    additionalFiltersCheck(beds, rooms){
      if(beds >= this.store.additionalFilters.beds && rooms >= this.store.additionalFilters.rooms){
        return true
      }
      return false
    },
    handleScroll() {
        const currentScrollY = window.scrollY;
        if (currentScrollY > this.lastScrollY && currentScrollY > 50) {
            this.hideHeader = true;
        } else {
            this.hideHeader = false;
        }

        this.lastScrollY = currentScrollY;
    },

  }
};
</script>

<template>
  <section>
    <a href="#main-container" class="go-up" 
    :class=" { 'hide-arrow' : !hideHeader }">
        <span class="inner-go-up"><i class="fa-solid fa-arrow-up fw-bold"></i></span>
    </a>
    <div class="container my-3">
      <SearchComponent :class="{ 'hide-header': hideHeader }"/>
      <div class="sticky-lg-top filters pt-2">
        <FilterComponent :filters="api.services" :ref="'filters'"/> 
        <AdditionalFilterComponent />
        <hr style="display:block; width:96%; margin: 0 auto;">
      </div>
      
      <!-- Lista degli appartamenti 
        :class="getSelectedFilters.length > 0 && checkFilter(getSelectedFilters, apartment) ? 'd-block' : 'd-none'"
      -->
      <div class="row d-flex flex-wrap m-0">
        <div
          v-for="(apartment, index) in api.apartments"
          :key="apartment.id"
          class="col-12 col-sm-6 col-lg-3 p-3 d-flex justify-content-center"
          :class="
            tomtom.filterStarted == true && store.filterSelected.length != 0 && !checkFilter(store.filterSelected, apartment) ? 'd-none' : '',
            tomtom.filterStarted == true && tomtom.position.lat && tomtom.position.lng && !testingBound(apartment.latitude, apartment.longitude) ? 'd-none': '',
            additionalFiltersCheck(apartment.beds, apartment.rooms)? '' : 'd-none'"
        >
        <!-- {{ console.log(apartment) }} -->
          <div class="apartment-card-wrapper w-100">
            <SingleApartment :apartment="apartment" :index="index" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
    section{
      position:relative;
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;

    }
    .go-up{
      display:inline-block;
      font-size:1.2rem;
      color:white;
      text-decoration:none;
      width:40px;
      height:40px;
      border-radius:50%;
      position:fixed;
      bottom:10px;
      right:50px;
      z-index:3;
      background-color: #360000;
      cursor:pointer;
      transition: transform .1s linear;
      &:hover{
        transform:scale(105%)
      }
      .inner-go-up{
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%, -50%);
      }
    }
    .filters{
      //position:sticky;
      top:0;
      z-index:2;
      background-color:white;
    }
    
    .hide-header {
      transform: translateY(-200%);
    }

    .hide-arrow {
      transform: translateX(300%);
    }
</style>
