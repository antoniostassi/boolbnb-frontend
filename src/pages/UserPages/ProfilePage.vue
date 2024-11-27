<script>
import { api, store } from "../../store";

export default {
  data() {
    return {
      api,
      store,
    };
  },
};
</script>

<template>
  <div class="container py-5">
    <div class="row">
      <!-- Colonna sinistra: Dati utente -->
      <div class="col-12 col-lg-4 border-end pe-4">
        <h1 class="text-center pb-3">
          Benvenuto
          <!-- Se l'utente ha inserito il nome uscirà la scritta "Benvenuto NomeUtente" -->
          <span v-show="api.user.firstname != null">{{ api.user.firstname }}</span> 
        </h1>
        <!-- Lista dei dati dell'utente -->
        <ul class="list-unstyled text-justify">
          <li><strong>Email:</strong> {{ api.user.email }}</li>
          <li><strong>Numero di appartamenti:</strong> {{ api.user.apartments.length }}</li>
          <li v-if="api.user.firstname"><strong>Nome:</strong> {{ api.user.firstname }}</li>
          <li v-if="api.user.lastname"><strong>Cognome:</strong> {{ api.user.lastname }}</li>
          <li v-if="api.user.name"><strong>Nome utente:</strong> {{ api.user.name }}</li>

        </ul>
      </div>

      <!-- Colonna dei messaggi ricevuti -->
      <div class="col-12 col-lg-8 ps-4">
        <h1 class="text-center">Messaggi ricevuti</h1>
        <p class="pb-3 fst-italic">
          Rispondi ai messaggi inviando una mail tramite la tua casella di posta personale.
        </p>
        <p class="pt-3 fw-bold">
          Clicca sull'appartamento per leggere i messaggi ricevuti.
        </p>
        <!-- Contenitore scrollabile -->
        <div class="accordion-container overflow-auto border rounded p-3" style="max-height: 400px;">
          <div class="accordion" id="apartmentMessagesAccordion">
            <div
              v-for="(apartment, index) in api.user.apartments"
              :key="index"
              v-show="apartment.messages.length > 0"
              class="accordion-item"
            >
              <!-- Header dell'accordion -->
              <h2 class="accordion-header" :id="'heading' + index">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="'#collapse' + index"
                  aria-expanded="false"
                  :aria-controls="'collapse' + index"
                >
                  {{ apartment.title }}
                </button>
              </h2>

              <!-- Body dell'accordion -->
              <div
                :id="'collapse' + index"
                class="accordion-collapse collapse"
                :aria-labelledby="'heading' + index"
                data-bs-parent="#apartmentMessagesAccordion"
              >
                <div class="accordion-body">
                  <div
                    class="message-box overflow-auto"
                    style="max-height: 200px;"
                  >
                    <div
                      v-for="(message, i) in apartment.messages"
                      :key="i"
                      class="card mb-3"
                    >
                      <div class="card-body">
                        <p>{{ message.content }}</p>
                        <br />
                        <p>
                          <strong>Email del mittente:</strong>
                          {{ message.user_email }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.border-end {
  border-right: 1px solid #e0e0e0 !important;
}

.accordion-container {
  background-color: #f9f9f9;
}

.accordion-button {
  background-color: #979797bd;
  color: #fff;
  font-weight: bold;
  margin: 1px 0;
}

.accordion-button:not(.collapsed) {
  color: #fff;
  background-color: #979797bd;
}

.card {
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.message-box {
  max-height: 200px;
  overflow-y: auto;
}
</style>

