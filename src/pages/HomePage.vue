<script>
import axios from "axios";
import SingleApartment from "../components/SingleApartment.vue";

export default {
  data() {
    return {
      apartments: [],
      promotedApartments: [],
    };
  },
  components: {
    SingleApartment,
  },
  methods: {
    getApartments() {
      axios
        .get("http://localhost:8000/api/apartments?all=true")
        .then((response) => {
          this.apartments = response.data.data || [];
          console.log("Appartamenti:", this.apartments);

          // Filtra gli appartamenti con promozioni attive
          const promoted = this.apartments.filter(
            (apartment) =>
              apartment.promotions && apartment.promotions.length > 0
          );
          console.log("Appartamenti promossi:", promoted);

          // Assegna un'immagine casuale a ogni appartamento
          this.promotedApartments = promoted.map((apartment) => {
            apartment.image = `https://picsum.photos/seed/${apartment.id}/400/300`;
            return apartment;
          });

          // Mescola casualmente e prendi i primi 3
          this.promotedApartments = this.promotedApartments
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
          console.log("Appartamenti promossi selezionati:", this.promotedApartments);
        })
        .catch((error) => {
          console.error("Errore nel caricamento degli appartamenti:", error);
        });
    },
  },
  mounted() {
    this.getApartments();
  },
};
</script>



<template>
    <div>
      <!-- Hero Section con sfondo, barra di ricerca e card -->
      <section class="hero">
        <div class="container text-center">
          <h1 class="main-title">Trova la tua prossima struttura</h1>
          <p class="subtitle">Scopri le migliori strutture in pochi click.</p>
          <form class="search-bar d-flex align-items-center mx-auto">
            <input
              type="text"
              placeholder="Inserisci destinazione o nome struttura"
              class="form-control search-input"
            />
            <button type="submit" class="btn search-button">Cerca</button>
          </form>
  
          <!-- Card sponsorizzate -->
          <div class="cards-row d-flex justify-content-center align-items-center mt-5">
            <SingleApartment
              v-for="(apartment, index) in promotedApartments"
              :key="apartment.id"
              :apartment="apartment"
              :index="index"
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
    max-width: 800px;

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
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

      .search-input {
        flex: 1;
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

      .search-button {
        border: none;
        border-radius: 0 50px 50px 0;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        background: #e352fa;
        color: white;
        font-weight: bold;
        transition: background 0.3s ease, transform 0.2s;

        &:hover {
          background: #e352fa;
          transform: scale(1.05);
        }

        &:active {
          background: #e352fa;
        }
      }
    }

    .cards-row {
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap; /* Mantieni tutte le card sulla stessa riga */
      gap: 1.5rem;
      margin-top: 2rem;

      @media (max-width: 992px) {
        flex-wrap: wrap; /* Su schermi più piccoli di 992px, le card si dispongono su più righe */
        justify-content: center;
        gap: 2rem; /* Aumenta lo spazio tra le card */
      }

      .card {
        width: 18rem;
        border: none;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease, box-shadow 0.3s ease;

        img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .card-body {
          background: #fff;
          padding: 1rem;

          .card-title {
            font-size: 1.25rem;
            font-weight: bold;
          }

          .card-text {
            font-size: 1rem;
            color: #666;
            margin-bottom: 1rem;
          }

          .btn {
            background-color: #e352fa;
            border: none;
            color: #fff;
            font-weight: bold;

            &:hover {
              background-color: #ff69b4;
            }
          }
        }

        &:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

          img {
            transform: scale(1.05);
          }
        }
      }
    }
  }
}
</style>


  