<script>
export default {
  data() {
    return {
      plans: [
        {
          name: "Bronze",
          duration: "1 giorno",
          color: "#CD7F32",
        },
        {
          name: "Silver",
          duration: "3 giorni",
          color: "#C0C0C0",
        },
        {
          name: "Gold",
          duration: "6 giorni",
          color: "#FFD700",
        },
      ],
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
      >
        <h2 :style="{ color: plan.color }">{{ plan.name }}</h2>
        <p class="duration">Durata: {{ plan.duration }}</p>
        <ul class="features">
          <li>Visibilità avanzata negli annunci</li>
          <li>Priorità nella ricerca</li>
        </ul>
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
  min-height: 650px;

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
