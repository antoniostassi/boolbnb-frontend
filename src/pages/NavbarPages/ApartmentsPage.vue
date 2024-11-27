<script>

import tt from '@tomtom-international/web-sdk-maps';

import axios from "axios";
import SingleApartment from "../../components/SingleApartment.vue";
import Paginator from "../../components/Paginator.vue"
import { store, api, tomtom } from '../../store'
import FilterComponent from "../../components/ApartmentsComponents/FilterComponent.vue";
import SearchComponent from "../../components/ApartmentsComponents/SearchComponent.vue";

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
      hiddenPaginate: false,
    };
  },
  components: {
    SingleApartment,
    Paginator,
    FilterComponent,
    SearchComponent
  },
  mounted() {

    //
    if (this.tomtom.position.lat){ // Se esiste una latitudine da cercare
      this.api.getAllApartments(); // Prendi TUTTI gli appartamenti senza paginazione
      this.hiddenPaginate = true;
      return
    }
    // Altrimenti prenti gli appartamenti paginated
    this.api.getApartments();
  },
  methods: {

    testingBound(lat, lng) {
      const center = new tt.LngLat(this.tomtom.position.lng, this.tomtom.position.lat); // Posizione della ricerca
      const radiusMeters = 20000; // 20 Kilometers
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
    }
  }
};
</script>

<template>
  <div class="container my-3">

    <div class="d-flex justify-content-center align-items-center">
      <SearchComponent/>
      <div class="btn btn-info" @click="tomtom.resetResearch()"> <i class="fa-solid fa-retweet"></i> </div>
    </div>
    
    <FilterComponent :filters="api.services" :ref="'filters'"/> 

    <!-- Lista degli appartamenti 
      :class="getSelectedFilters.length > 0 && checkFilter(getSelectedFilters, apartment) ? 'd-block' : 'd-none'"
     -->
    <div class="row d-flex flex-wrap m-0">
      <div
        v-for="(apartment, index) in api.apartments"
        :key="apartment.id"
        class="col-12 col-sm-6 col-lg-3 p-3 d-flex justify-content-center"
        :class="
          store.filterSelected.length != 0 && !checkFilter(store.filterSelected, apartment) ? 'd-none' : '',
          this.tomtom.position.lat && this.tomtom.position.lng && !testingBound(apartment.latitude, apartment.longitude) ? 'd-none': '' "
      >

      <!-- {{ console.log(apartment) }} -->
        <div class="apartment-card-wrapper w-100">
          <SingleApartment :apartment="apartment" :index="index" />
        </div>
      </div>
    </div>
    <Paginator :class="hiddenPaginate ? 'd-none' : ''" />
    
  </div>
</template>

<style lang="scss" scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;

}
.row {
  margin: 30px 0;

}
</style>
