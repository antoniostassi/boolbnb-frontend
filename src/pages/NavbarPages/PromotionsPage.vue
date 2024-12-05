<script>

import { api, store } from '../../store';

export default {
  data() {
    return {
      plans: [
        {
          name: "Gold",
          duration: "6 giorni",
          color: "#FFD700",
        },
        {
          name: "Silver",
          duration: "3 giorni",
          color: "#C0C0C0",
        },
        {
          name: "Bronze",
          duration: "1 giorno",
          color: "#CD7F32",
        },
      ],

      selectedPromotion: 0,
      api, store
    };
  },
};
</script>

<template>
  <div class="promotions-page d-flex justify-content-center align-items-center flex-column">
    <h1 class="title mb-4">I nostri piani promozionali</h1>
    <p class="subtitle">Ottimizza la visibilità del tuo annuncio con uno dei nostri piani dimostrativi!</p>
    <div class="plans-container">
      <div
        v-for="(plan, index) in plans"
        :key="index"
        class="plan-card"
        :style="{ borderColor: plan.color }"
        @click="selectedPromotion = index+1"
      >
        <h2 :style="{ color: plan.color }">{{ plan.name }}</h2>
        <p class="duration">Durata: {{ plan.duration }}</p>
        <ul class="features">
          <li>Visibilità avanzata negli annunci</li>
          <li>Priorità nella ricerca</li>
        </ul>
      </div>
    </div>
    
    <div class="container mt-5">
      <h2 class="mb-4" v-if="selectedPromotion != 0">Acquista la promozione: <span :style="{ color: plans[selectedPromotion-1].color}">{{ plans[selectedPromotion-1].name }}</span></h2>
      <table class="table" :class="selectedPromotion != 0 ? 'd-table' : 'd-none'">
        <thead>
          <tr>
            <th scope="col">Appartamento</th>
            <th scope="col">Azione</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="apartment, index in api.user.apartments" :key="index">
            <td>{{apartment.title}}</td>
            <td>
              <div class="btn btn-success px-2 py-0" @click="api.selectedPromotionId = selectedPromotion; store.isBuyingAfter = true; api.toUpdateApartmentId = apartment.id; $router.push('/apartments/create/checkout');">Acquista Promozione</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    

  </div>
</template>

<style lang="scss" scoped>
.promotions-page {
  min-height:77vh;
  font-family: 'Arial', sans-serif;
  text-align: center;
  background-color: #f9f9f9;
  .title {
    font-size: 2.5rem;
    color: #333;
    margin-bottom: 10px;
  }

  .subtitle {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 30px;
  }

  .plans-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }

  .plan-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 300px;
    padding: 20px;
    background-color: white;
    border: 3px solid;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    text-align: center;

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    h2 {
      font-size: 1.8rem;
      margin-bottom: 10px;
    }

    .duration {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 15px;
    }

    .features {
      list-style: none;
      padding: 0;
      margin: 15px 0;
      font-size: 1rem;
      color: #555;
      height: 80px; // Fissa l'altezza della lista
      li {
        margin: 5px 0;
      }
    }
  }
}
</style>
