<script>
import axios from "axios";
import SingleApartment from "../../components/SingleApartment.vue";
import Paginator from "../../components/Paginator.vue"
import { store, api } from '../../store'

export default {
  data() {
    return {
      store,
      api
    };
  },
  components: {
    SingleApartment,
    Paginator,
  },
  mounted() {
    this.api.getApartments(); // Carica gli appartamenti alla prima renderizzazione
  },
  methods: {
  }
};
</script>

<template>
  <div class="container my-3">
    <!-- Lista degli appartamenti -->
    <div class="row d-flex flex-wrap">
      <div
        v-for="(apartment, index) in api.apartments"
        :key="apartment.id"
        class="col-12 col-sm-6 col-lg-3 p-3 d-flex justify-content-center"
      >
      <div class="apartment-card-wrapper w-100">
        <SingleApartment :apartment="apartment" :index="index" />
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
