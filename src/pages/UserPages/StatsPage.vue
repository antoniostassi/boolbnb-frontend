<script>
// Importa API, Chart.js e moment.js
import { api } from '../../store';
import { Chart, registerables } from 'chart.js';
import moment from 'moment';

moment.updateLocale('it', {
  months: 'Gen_Feb_Mar_Apr_Mag_Giu_Lug_Ago_Set_Ott_Nov_Dic'.split('_'),
});

// Registra Chart.js
Chart.register(...registerables);

export default {
  props: {
    // Proprietà 'id' per identificare l'appartamento
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      chart: null, // Riferimento al grafico
      openedMessageIndex: null, // Index per tenere traccia del messaggio aperto nell'accordion
    };
  },
  async mounted() {
    // Carica i dettagli dell'appartamento dal componente Store e crea il grafico
    this.$nextTick(() => {
      this.renderChart();
    });
  },
  computed: {
    // Computed property per ottenere l'appartamento selezionato dallo store
    selectedApartment() {
      return api.user.apartments.find((apartment) => apartment.id === parseInt(this.id));
    },
    // Ottiene il numero di visualizzazioni per ogni mese degli ultimi 12 mesi
    visualizationsByMonth() {
      const visualizationsByMonth = Array(12).fill(0);

      if (this.selectedApartment && this.selectedApartment.visualizations) {
        this.selectedApartment.visualizations.forEach((visualization) => {
          const monthDiff = moment().diff(moment(visualization.visit_date), 'months');
          if (monthDiff < 12) {
            visualizationsByMonth[11 - monthDiff]++;
          }
        });
      }

      return visualizationsByMonth;
    },
    // Computed property per ottenere l'ultima promozione
    lastPromotion() {
      const lastPromotion = this.selectedApartment.promotions[this.selectedApartment.promotions.length - 1];

      if (this.selectedApartment.promotions.length == 0) { return null };
      return {
        start_date: moment(lastPromotion?.pivot?.start_date).format('DD MMMM YYYY'),
        end_date: moment(lastPromotion?.pivot?.end_date).format('DD MMMM YYYY'),
      }; 
    },
  },
  methods: {
    // Metodo per creare il grafico
    renderChart() {
      const ctx = document.getElementById('viewsChart').getContext('2d');
      const gradient = ctx.createLinearGradient(224, 72, 255, 400);
      gradient.addColorStop(0, 'rgba(224, 72, 255, 1)');
      gradient.addColorStop(1, 'rgba(224, 72, 255, 0)');

      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: moment.months(),
          datasets: [
            {
              label: 'Numero di Visualizzazioni',
              data: this.visualizationsByMonth,
              fill: true,
              backgroundColor: gradient,
              borderColor: 'rgba(224, 72, 255, 1)',
              borderWidth: 2,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true, position: 'top' },
            title: { display: true, text: 'Visualizzazioni negli Ultimi 12 Mesi' },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Numero di Visualizzazioni' },
            },
            x: {
              title: { display: true, text: '2024' },
            },
          },
        },
      });
    },
    // Metodo per gestire l'apertura dell'accordion per il messaggio
    toggleMessage(index) {
      this.openedMessageIndex = this.openedMessageIndex === index ? null : index;
    },
  },
};
</script>

<template>
  <div class="stats-page">
    <div class="container">
      <div class="row g-4">
        <!-- Colonna Sinistra: Dati dell'Appartamento -->
        <div class="col-12 col-lg-6">
          <div class="left-column p-4 h-100">
            <h2 class="mb-4">{{ selectedApartment.title }}</h2>
            <p class="mb-2"><strong>Indirizzo:</strong> {{ selectedApartment.address }}</p>
            <p class="mb-2"><strong>Stanze:</strong> {{ selectedApartment.rooms }}</p>
            <p class="mb-2"><strong>Metri quadrati:</strong> {{ selectedApartment.apartment_size }}</p>
            <p class="mb-2"><strong>Letti:</strong> {{ selectedApartment.beds }}</p>
            <div class="mb-4">
              <strong>Servizi:</strong>
              <ul class="list-group list-group-flush mt-2">
                <li v-for="(service, index) in selectedApartment.services" :key="index" class="list-group-item">
                  {{ service.title }}
                </li>
              </ul>
            </div>
            <div v-if="lastPromotion" class="mt-4">
              
              <strong>Data di inizio sponsorizzazione:</strong> {{ lastPromotion.start_date }} <br>
              <strong>Data di fine sponsorizzazione:</strong> {{ lastPromotion.end_date }}
            </div>
          </div>
        </div>

        <!-- Colonna Destra: Statistiche e Messaggi -->
        <div class="col-12 col-lg-6">
          <div class="right-column d-flex flex-column h-100">
            <!-- Statistiche dell'appartamento -->
            <div class="stats p-4 mb-4">
              <h3 class="mb-3">Statistiche dell'Appartamento</h3>
              <canvas id="viewsChart"></canvas>
            </div>

            <!-- Messaggi relativi all'appartamento -->
            <div class="messages p-4">
              <h3 class="mb-3">Messaggi Ricevuti</h3>
              <div v-if="selectedApartment.messages.length" class="accordion" id="messagesAccordion">
                <div v-for="(message, index) in selectedApartment.messages" :key="index" class="accordion-item mb-3">
                  <h2 class="accordion-header" :id="'heading' + index">
                    <button
                      class="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      :data-bs-target="'#collapse' + index"
                      aria-expanded="false"
                      :aria-controls="'collapse' + index"
                      @click="toggleMessage(index)"
                    >
                      {{ message.firstname }} {{ message.lastname }}
                    </button>
                  </h2>
                  <div
                    :id="'collapse' + index"
                    class="accordion-collapse collapse"
                    :class="{ show: openedMessageIndex === index }"
                    :aria-labelledby="'heading' + index"
                    data-bs-parent="#messagesAccordion"
                  >
                    <div class="accordion-body">
                      <p><strong>Email:</strong> {{ message.user_email }}</p>
                      <p>{{ message.content }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else class="text-muted mt-3">Nessun messaggio ricevuto.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/partials/variables.scss';
@import '@/assets/scss/partials/mixins.scss';
// comment
.stats-page {
  min-height:77vh;
  .container {
    max-width: 1200px;
    margin: auto;
    padding: 20px;
    background-color: #f9f9f9;

    .left-column,
    .right-column > .stats,
    .right-column > .messages {
      background: white;
      border-radius: 8px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    }

    .right-column {
      .stats {
        flex-grow: 1;
      }
      .messages {
        flex-grow: 2;
      }
    }

    h2 {
      font-size: 24px;
      font-weight: bold;
    }

    h3 {
      font-size: 20px;
      font-weight: bold;
    }

    .accordion-button {
      font-weight: bold;
      padding: 12px 16px;
    }

    .accordion-body {
      background-color: #f8f9fa;
      padding: 16px;
    }

    .list-group-item {
      padding: 10px 15px;
      border: none;
      border-bottom: 1px solid #ddd;
    }

    .loading {
      font-size: 18px;
      color: #919191;
    }
  }
}
</style>
