<script>
import axios from 'axios';
import { api, store } from '../../store';

export default {
  data() {
    return {
      api,
      store,
      selectedPromotionId: null, // ID della promozione selezionata
    };
  },
  mounted() {
    this.api.redirectIfNotCreated();
    this.api.getPromotions(); // Ottieni tutte le promozioni dal backend
  },
  methods: {
    choosePromotion(promotionId) { // Al click sul pulsante di scelta promozione si esegue questa funzione
      this.selectedPromotionId = promotionId; // La variabile selectedPromotionId viene riempita con l'ID della promozione scelta
      if (promotionId === null) { // Se la promozione è Standard, si esegue la funzione che crea l'apartment senza promozione
        this.createApartment(); // Funzione di creazione apartment
      } else {
        console.log('Promotion scelta con ID:', promotionId); // Console.log di altre promozioni (Da gestire in seguito con redirect e checkout)
      }
    },
    createApartment() { // Funzione di creazione apartment
      const formData = this.store.storedApartment; // Ottieni i dati dell'appartamento salvati nello store
      formData.append('promotion_id', this.selectedPromotionId); // Aggiungi l'ID della promozione selezionata
      axios
        .post('http://localhost:8000/api/apartments', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }) // Chiamata API che passa i dati in post dell'oggetto apartment
        .then((response) => {
          console.log(response.data);
          this.$router.push('/user/dashboard'); // Reindirizzamento a user/dashboard
          this.api.getUserApartments();
        })
        .catch((error) => {
          console.error('Errore durante la creazione', error); // In caso di errore
        });
    },
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
        <div class="col-12 col-md-6 col-lg-3">
          <div class="promotion-box d-flex flex-column justify-content-between align-items-center p-4 h-100" style="border-color: #E0E0E0">
            <h2 class="promotion-title text-uppercase fw-bold mb-3" style="color: #E0E0E0">
              Standard
            </h2>
            <p class="promotion-description text-muted text-center flex-grow-1">Nessun costo aggiuntivo</p>
            <button
              class="btn promotion-button mt-3"
              style="background-color: #E0E0E0; color: #fff"
              @click="choosePromotion(null)"
            >
              Scegli Standard
            </button>
          </div>
        </div>
      <div
        v-for="(promotion, index) in api.promotions"
        :key="index"
        class="col-12 col-md-6 col-lg-3"
      >
        <div class="promotion-box d-flex flex-column justify-content-between align-items-center p-4 h-100" :style="{ borderColor: promotion.color }">
          <h2 class="promotion-title text-uppercase fw-bold mb-3" :style="{ color: promotion.color }">
            {{ promotion.title }}
          </h2>
          <p class="promotion-description text-muted text-center flex-grow-1">{{ promotion.description }}</p>
          <button
            class="btn promotion-button mt-3"
            :style="{ backgroundColor: promotion.color, color: '#fff' }"
            @click="choosePromotion(promotion.id)"
          >
            Scegli {{ promotion.title }}
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
