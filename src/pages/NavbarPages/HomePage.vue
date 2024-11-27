<script>
import axios from "axios";
import SingleApartment from "../../components/SingleApartment.vue";
import SearchComponent from "../../components/ApartmentsComponents/SearchComponent.vue";
import * as services from "@tomtom-international/web-sdk-services";
import { tomtom } from "../../store";

export default {
  data() {
    return {
      apartments: [],
      promotedApartments: [],
      tomtom,
    };
  },
  components: {
    SingleApartment,
    SearchComponent
  },
  mounted() {
      this.getApartments(); // Prende tutti gli appartamenti e filtra gli Sponsorizzati.
  },

  methods: {
    getApartments() {
      axios
        .get("http://localhost:8000/api/apartments?all=true")
        .then((response) => {
          this.apartments = response.data;

          // Filtra gli appartamenti con promozioni attive
          const promoted = this.apartments.filter(
            (apartment) =>
              apartment.promotions && apartment.promotions.length > 0
          );

          // Assegna un'immagine casuale a ogni appartamento
          this.promotedApartments = promoted.map((apartment) => {
            apartment.image = `https://picsum.photos/seed/${apartment.id}/400/300`;
            return apartment;
          });

          // Mescola casualmente e prendi i primi 3
          this.promotedApartments = this.promotedApartments
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
        })
        .catch((error) => {
          console.error("Errore nel caricamento degli appartamenti:", error);
        });
    },

  },
};
</script>

<template>
    <div>
      <section class="hero">
        <div class="container text-center">
          <h1 class="main-title">Trova la tua prossima struttura</h1>
          <p class="subtitle">Scopri le migliori strutture in pochi click.</p>
  
          <!-- Form di ricerca -->
          <SearchComponent/>
  
          <!-- Card sponsorizzate -->
          <div class="row d-flex justify-content-center align-items-center my-5">
            <SingleApartment
              v-for="(apartment, index) in promotedApartments"
              :key="apartment.id"
              :apartment="apartment"
              :index="index"
              class="col-12 col-lg-3 col-md-6 my-3"
            />
          </div>
        </div>
      </section>
    </div>
  </template>
  

<style lang="scss">
.hero {
  background-image: url(../../public/img/homepage-main-photo.jpg);
  background-size: cover;
  background-position: center;
  min-height: 75vh;
  padding: 4rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;

  .container {
    max-width: 1200px;

    .main-title {
      font-size: 3rem;
      font-weight: bold;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
    }

    .subtitle {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
    }
  }
}

</style>


  
