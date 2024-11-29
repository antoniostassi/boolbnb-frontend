<script>
import axios from 'axios';
import { api, store } from '../../store'

export default {
  data() {
    return {
      api,
      store,
      selectedPromotion: null, // Variabile promozione selezionata settata a null
      plans: [
        { name: "Standard", description: "Nessun costo aggiuntivo", color: "#E0E0E0" },
        { name: "Bronze", description: "€2.99 per 1 giorno", color: "#CD7F32" },
        { name: "Silver", description: "€5.99 per 3 giorni", color: "#C0C0C0" },
        { name: "Gold", description: "€9.99 per 6 giorni", color: "#FFD700" },
      ],
    };
  },
  mounted() {
    this.api.redirectIfNotAuth();
    this.api.redirectIfNotCreated();
  },
  methods: {
    choosePromotion(promotion) { // Al click sul pulsante di scelta promozione si esegue questa funzione
      this.selectedPromotion = promotion; // La variabile selectedPromotion viene riempita con la promotion scelta
      if (promotion == "Standard") { // Se la promozione è Standard, si esegue la funzione che crea l'apartment
        this.createApartment(); // Funzione di creazione apartment
      } else {
        console.log('Promotion scelta:', promotion) // Console.log di altre promozioni (Da gestire in seguito con redirect e checkout)
      }
    },
    createApartment() { // Funzione di creazione apartment
      const apartment = { // Oggetto apartment che richiama i dati dallo store e della promozione
        ...this.store.storedApartment, // Richiama i dati salvati precedentemente dalla Create salvati nello store
        promotions: this.selectedPromotion === 'Standard' ? null : this.selectedPromotion // Se la promotion scelta è Standard, setta il parametro promotions dell'apartment a null, altrimenti con la promozione selezionata. (Da modificare e gestire)
      };

      axios
        .post('http://localhost:8000/api/apartments', apartment) // Chiamata API che passa i dati in post dell'oggetto apartment
        .then((response) => {
            console.log(response.data);
            this.$router.push('/user/dashboard'); // Reindirizzamento a user/dashboard
          }
        )
        .catch((error) => {
          console.error('Errore durante la creazione', error) // In caso di errore
        })
    }
  },
};
</script>

<template>
  <div class="container promotions-choice-page my-5">
    <h1 class="text-center mb-4">Scegli una promozione per il tuo appartamento</h1>
    <p class="text-center text-muted mb-4">
      Ottimizza la visibilità con una delle nostre opzioni!
    </p>
    <div class="row g-3">
      <div
        v-for="(plan, index) in plans"
        :key="index"
        class="col-12 col-md-6 col-lg-3"
      >
        <div class="promotion-box d-flex flex-column justify-content-between align-items-center p-4 h-100" :style="{ borderColor: plan.color }">
          <h2 class="promotion-title text-uppercase fw-bold mb-3" :style="{ color: plan.color }">
            {{ plan.name }}
          </h2>
          <p class="promotion-description text-muted text-center flex-grow-1">{{ plan.description }}</p>
          <button
            class="btn promotion-button mt-3"
            :style="{ backgroundColor: plan.color, color: '#fff' }"
            @click="choosePromotion(plan.name)"
          >
            Scegli {{ plan.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>



<style lang="scss" scoped>
.promotions-choice-page {
  font-family: 'Arial', sans-serif;

  h1 {
    font-size: 2.5rem;
    color: #333;
  }

  p {
    font-size: 1.1rem;
    color: #555;
  }

  .promotion-box {
    border: 2px solid;
    border-radius: 10px;
    background-color: #fff;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-align: center;
    display: flex;
    flex-direction: column;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .promotion-title {
      font-size: 1.5rem;
    }

    .promotion-description {
      font-size: 1rem;
    }

    .promotion-button {
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 5px;
      font-weight: bold;
      text-transform: uppercase;
      transition: transform 0.3s ease, opacity 0.3s ease;

      &:hover {
        transform: scale(1.05);
        opacity: 0.9;
      }
    }
  }

  @media (max-width: 576px) {
    .promotion-box {
      padding: 20px 10px;
    }

    .promotion-title {
      font-size: 1.2rem;
    }

    .promotion-description {
      font-size: 0.9rem;
    }

    .promotion-button {
      padding: 8px;
    }
  }
}
</style>


