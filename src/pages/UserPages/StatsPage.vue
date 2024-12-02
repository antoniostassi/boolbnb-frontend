<script>
import { api } from '../../store';
import { Chart, registerables } from 'chart.js';
import moment from 'moment';

Chart.register(...registerables);

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedApartment: null,
      selectedMessageIndex: null,
      chart: null,
    };
  },
  async mounted() {
    await this.loadApartmentDetails();
    if (this.selectedApartment) {
      api.storeVisualization(this.selectedApartment.id);
      this.renderChart();
    }
  },
  methods: {
    async loadApartmentDetails() {
      this.selectedApartment = await api.user.apartments.find(
        (apartment) => apartment.id === parseInt(this.id)
      );
    },
    toggleMessage(index) {
      this.selectedMessageIndex = this.selectedMessageIndex === index ? null : index;
    },
    getVisualizationsByDay() {
      // Crea un array con 31 posizioni per ogni giorno di dicembre
      const visualizationsByDay = Array(31).fill(0);

      // Scorriamo le visualizzazioni e incrementiamo il contatore per il giorno corrispondente
      if (this.selectedApartment && this.selectedApartment.visualizations) {
        this.selectedApartment.visualizations.forEach((visualization) => {
          const date = moment(visualization.date); // Considera che 'visualization.date' è in formato ISO
          if (date.month() === 11) { // Dicembre è il mese 11 (gennaio è 0)
            const day = date.date();
            visualizationsByDay[day - 1]++;
          }
        });
      }

      return visualizationsByDay;
    },
    renderChart() {
      const ctx = document.getElementById('viewsChart').getContext('2d');

      // Creazione del gradiente lineare come nell'esempio di Chart.js
      const gradient = ctx.createLinearGradient(224, 72, 255, 400);
      gradient.addColorStop(0, 'rgba(224, 72, 255, 1)');
      gradient.addColorStop(1, 'rgba(224, 72, 255, 0)');

      const visualizationsByDay = this.getVisualizationsByDay();

      const data = {
        labels: Array.from({ length: 31 }, (_, i) => `Dicembre ${i + 1}`), // Etichette per ogni giorno di dicembre
        datasets: [
          {
            label: 'Numero di Visualizzazioni',
            data: visualizationsByDay, // Dati reali delle visualizzazioni per ciascun giorno di dicembre
            fill: true,
            backgroundColor: gradient,
            borderColor: 'rgba(224, 72, 255, 1)',
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      };

      // Creazione del grafico a linea con le opzioni avanzate
      this.chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            title: {
              display: true,
              text: 'Visualizzazioni dell\'Appartamento nel Mese di Dicembre',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Numero di Visualizzazioni',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Dicembre',
              },
            },
          },
        },
      });
    },
  },
  computed: {
    apartmentViewCount() {
      // Calcola il numero totale di visualizzazioni per l'appartamento selezionato
      if (this.selectedApartment && this.selectedApartment.visualizations) {
        return this.selectedApartment.visualizations.length;
      }
      return 0;
    },
  },
};
</script>

<template>
  <div class="stats-page">
    <div class="container">
      <!-- Colonna Sinistra: Dati dell'Appartamento -->
      <div class="left-column" v-if="selectedApartment">
        <h2>{{ selectedApartment.title }}</h2>
        <p><strong>Indirizzo:</strong> {{ selectedApartment.address }}</p>
        <p><strong>Stanze:</strong> {{ selectedApartment.rooms }}</p>
        <p><strong>Metri quadrati:</strong> {{ selectedApartment.apartment_size }}</p>
        <p><strong>Letti:</strong> {{ selectedApartment.beds }}</p>
        <p><strong>Servizi:</strong></p>
        <ul>
          <li v-for="(service, index) in selectedApartment.services" :key="index">{{ service.title }}</li>
        </ul>
      </div>
      <div v-else class="loading">
        <p>Caricamento dati dell'appartamento...</p>
      </div>

      <!-- Colonna Destra: Statistiche e Messaggi -->
      <div class="right-column">
        <!-- Statistiche dell'appartamento -->
        <div class="stats" v-if="selectedApartment">
          <h3>Statistiche dell'Appartamento</h3>
          <canvas id="viewsChart"></canvas>
        </div>

        <!-- Messaggi relativi all'appartamento -->
        <div class="messages" v-if="selectedApartment">
          <h3>Messaggi Ricevuti</h3>
          <ul v-if="selectedApartment.messages.length">
            <li v-for="(message, index) in selectedApartment.messages" :key="index" class="message-item">
              <div @click="toggleMessage(index)" class="message-header">
                <strong>{{ message.firstname }} {{ message.lastname }}</strong>
              </div>
              <div v-if="selectedMessageIndex === index" class="message-content">
                <p><strong>Email:</strong> {{ message.user_email }}</p>
                <p>{{ message.content }}</p>
              </div>
            </li>
          </ul>
          <p v-else>Nessun messaggio ricevuto.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/partials/variables.scss';
@import '@/assets/scss/partials/mixins.scss';

.stats-page {
  .container {
    display: flex;
    gap: 20px;
    padding: 20px;
    max-width: 1200px;
    margin: auto;
    background-color: #f9f9f9;

    .left-column {
      flex: 2;
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    }

    .right-column {
      flex: 3;
      display: flex;
      flex-direction: column;
      gap: 20px;

      .stats,
      .messages {
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
      }

      h3 {
        font-size: 1.5rem;
        color: #333;
        margin-bottom: 10px;
      }
    }
  }

  ul {
    list-style: none;
    padding: 0;

    .message-item {
      margin-bottom: 10px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #f0f0f0;
      }

      .message-header {
        font-size: 1.2rem;
        color: $color-violet;
      }

      .message-content {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #ccc;
      }
    }
  }

  .loading {
    font-size: 1.2rem;
    color: #999;
  }
}
</style>
