<script>
import axios from "axios";
import SingleApartment from "../../components/SingleApartment.vue";
import Paginator from "../../components/Paginator.vue"
import { store, api } from '../../store'
import FilterComponent from "../../components/ApartmentsComponents/FilterComponent.vue";
import SearchComponent from "../../components/ApartmentsComponents/SearchComponent.vue";

export default {
  data() {
    return {
      apartments: [], // Lista degli appartamenti
      api, store,
      pagination: {
        currentPage: 1, // Pagina corrente
        firstPage:1,
        lastPage: 0, // Numero totale di pagine
        total: 0, // Numero totale di appartamenti
        prevPage:'',
        nextPage:'',
      },
      researchAddress: ''
    };
  },
  components: {
    SingleApartment,
    Paginator,
    FilterComponent,
    SearchComponent
  },
  mounted() {
    if(this.$route.query.address) {
      this.researchAddress = this.$route.query.address;
      console.log(this.researchAddress);
    }

    //
    this.api.getApartments(); // Carica gli appartamenti alla prima renderizzazione
  },
  methods: {

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
    <SearchComponent :address="researchAddress"/>
    <FilterComponent :filters="api.services" :ref="'filters'"/>
    <!-- Lista degli appartamenti 
      :class="getSelectedFilters.length > 0 && checkFilter(getSelectedFilters, apartment) ? 'd-block' : 'd-none'"
     -->
    <div class="row d-flex flex-wrap m-0">
      <div
        v-for="(apartment, index) in api.apartments"
        :key="apartment.id"
        class="col-12 col-sm-6 col-lg-3 p-3 d-flex justify-content-center"
        :class="store.filterSelected.length != 0 && !checkFilter(store.filterSelected, apartment) ? 'd-none' : ''"
      >
      <!-- {{ console.log(apartment) }} -->
      <div class="apartment-card-wrapper w-100">
        <SingleApartment :apartment="apartment" :index="index" @click="console.log(store.selectedFilters)" />
      </div>
      </div>
    </div>
    <Paginator />
    
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
