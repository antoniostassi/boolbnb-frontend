<script>
export default {
  data() {
    return {
      plans: [
        {
          name: "Standard",
          price: "Gratuito",
          duration: "Illimitato",
          features: ["Visibilità base negli annunci", "Nessun costo aggiuntivo"],
          color: "#E0E0E0",
        },
        {
          name: "Bronze",
          price: "€ 2.99",
          duration: "1 giorno",
          features: ["Visibilità avanzata negli annunci", "Priorità nella ricerca"],
          color: "#CD7F32",
        },
        {
          name: "Silver",
          price: "€ 5.99",
          duration: "3 giorni",
          features: ["Visibilità premium negli annunci", "Maggiore priorità nella ricerca"],
          color: "#C0C0C0",
        },
        {
          name: "Gold",
          price: "€ 9.99",
          duration: "6 giorni",
          features: ["Massima visibilità", "Annunci in cima alla ricerca", "Badge esclusivo"],
          color: "#FFD700",
        },
      ],
    };
  },
};
</script>

<template>
  <div class="promotions-page">
    <h1 class="title">Scegli il tuo piano promozionale</h1>
    <p class="subtitle">Ottimizza la visibilità del tuo annuncio con uno dei nostri piani!</p>
    <div class="plans-container">
      <div
        v-for="(plan, index) in plans"
        :key="index"
        class="plan-card"
        :style="{ borderColor: plan.color }"
      >
        <h2 :style="{ color: plan.color }">{{ plan.name }}</h2>
        <p class="price">{{ plan.price }}</p>
        <p class="duration">Durata: {{ plan.duration }}</p>
        <ul class="features">
          <li v-for="(feature, i) in plan.features" :key="i">
            {{ feature }}
          </li>
        </ul>
        <div class="button-wrapper">
          <button class="choose-button" :disabled="plan.name == standard" :style="{ backgroundColor: plan.color }">
            Scegli {{ plan.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.promotions-page {
  font-family: 'Arial', sans-serif;
  text-align: center;
  padding: 20px;
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

    .price {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 10px 0;
      color: #333;
    }

    .duration {
      font-size: 1rem;
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

    .button-wrapper {
      margin-top: 15px; 
      height: 50px; 
      display: flex;
      align-items: center;
    }

    .choose-button {
      padding: 10px 15px;
      font-size: 1rem;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s, transform 0.3s;
      width: 100%;

      &:hover {
        transform: scale(1.05);
        background-color: lighten(#FFD700, 10%);
      }
    }
  }
}

</style>
