<script>
import axios from "axios";
import SingleApartment from "../../components/SingleApartment.vue";
import * as services from "@tomtom-international/web-sdk-services";
import { api } from "../../store";

export default {
  data() {
    return {
      apartments: [],
      promotedApartments: [],
      searchAddress: "",
      suggestions: [],
      apiKey: "Wuj8g5xvkgHJPaT4SjFEwshVAT3SbkVQ",
    };
  },
  components: {
    SingleApartment,
  },
  mounted() {
        this.getApartments();
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
    fetchSuggestions(query) {
      if (query.length < 3) {
        this.suggestions = [];
        return;
      }
      services.services
        .fuzzySearch({
          key: this.apiKey,
          query,
          language: "it-IT",
          limit: 10,
          countrySet: ["IT"],
        })
        .then((response) => {
          this.suggestions = response.results.map((result) => ({
            
            address: result.address.freeformAddress,
            position: result.position,
          }
        ));
        })
        .catch((error) => {
          console.error("Errore durante la ricerca delle città:", error);
        });
    },
    selectSuggestion(suggestion) {
      this.searchAddress = suggestion.address;
      this.searchPosition = suggestion.position;
      this.suggestions = [];
    },
    searchApartments() {
      console.log(this.searchPosition);
      // Naviga alla pagina degli appartamenti con il filtro
      this.$router.push({
        path: "/apartments",
        query: {
          address: this.searchAddress.trim() || null,
          lat: this.searchPosition.lat,
          lng: this.searchPosition.lng
        },
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
          <form
            class="search-bar d-flex align-items-center mx-auto flex-wrap"
            @submit.prevent="searchApartments"
          >
            <!-- Input città -->
            <div class="position-relative flex-grow-1 me-2">
              <input
                v-model="searchAddress"
                type="text"
                placeholder="Inserisci un indirizzo o una città"
                class="form-control search-input"
                @input="fetchSuggestions(searchAddress)"
                autocomplete="off"
              />
              <ul v-if="suggestions.length" class="suggestions-list">
                <li
                  v-for="(suggestion, index) in suggestions"
                  :key="index"
                  @click="selectSuggestion(suggestion)"
                >
                  {{ suggestion.address }}
                </li>
              </ul>
            </div>
            <!-- Button Cerca -->
            <button type="submit" class="btn search-button">
              Cerca
            </button>
          </form>
  
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

    .search-bar {
      width: 100%;
      max-width: 700px;
      display: flex;
      align-items: center;
      background: #e352fa;
      border-radius: 50px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

      .search-input {
        flex-grow: 1;
        border: none;
        border-radius: 50px 0 0 50px;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        outline: none;
        color: #333;

        &::placeholder {
          color: #999;
        }
      }

      .suggestions-list {
        position: absolute;
        background: white;
        z-index: 10;
        list-style: none;
        padding: 0;
        margin: 0;
        border: 1px solid #ddd;
        width: 100%;
        max-height: 150px;
        overflow-y: auto;
        border-radius: 5px;

        li {
          padding: 10px;
          cursor: pointer;
          color: black;
          text-align: start;
          

          &:hover {
            background: #eee;
          }
        }
      }

      .search-button {
        border: none;
        border-radius: 50px;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        background: #e352fa;
        color: white;
        font-weight: bold;
        transition: background 0.3s ease, transform 0.2s;
      }
    }
  }
}

</style>


  
