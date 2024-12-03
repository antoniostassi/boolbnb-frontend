<script>
import { api, store } from "../../store";

export default {
    data() {
        return {
            api, // Accesso all'API globale
            store, // Accesso allo store globale
            selectedApartment: null, // Salva l'appartamento selezionato
        };
    },
    mounted() {
        // Reindirizza l'utente se non è autenticato
        this.api.redirectIfNotAuth();
        this.api.getUserApartments();
    },
    computed: {
        hasMessages() {
            // Controlla se esiste almeno un messaggio tra tutti gli appartamenti
            return this.api.user?.apartments?.some(
                (apartment) => apartment.messages.length > 0
            );
        },
        filteredApartments() {
            // Filtra gli appartamenti che hanno messaggi e corrispondono al filtro di ricerca
            return this.api.user?.apartments?.filter(
                (apartment) =>
                    apartment.messages.length > 0 && // Include solo gli appartamenti che hanno almeno un messaggio
                    apartment.title
                        .toLowerCase() // Converte il titolo tutto in minuscolo per non renderlo case-sensitive
                        .includes(this.store.messageFilter.toLowerCase()) // Controlla se il titolo contiene il testo scritto nel campo di ricerca
            );
        },
        filteredMessages() {
            // Filtra i messaggi dell'appartamento selezionato in base al filtro email o nome
            if (!this.selectedApartment) return []; // Se non c'è un appartamento selezionato, restituisce un array vuoto
            const filter = this.store.emailFilter?.toLowerCase() || ""; // Converte l'email tutto in minuscolo per non renderla case-sensitive
            return this.selectedApartment.messages.filter(
                (message) =>
                    message.user_email.toLowerCase().includes(filter) || // Controlla l'email
                    (message.firstname.toLowerCase().includes(filter) || false) || // Controlla il nome
                    (message.lastname.toLowerCase().includes(filter) || false) // Controlla il cognome
            );
        },
    },
    methods: {
        selectApartment(apartment) {
            // Se l'utente clicca sull'appartamento già selezionato, chiudi la sezione messaggi
            if (this.selectedApartment === apartment) {
                this.selectedApartment = null; // Deseleziona l'appartamento
            } else {
                this.selectedApartment = apartment; // Seleziona un nuovo appartamento
            }
        },
    },
};
</script>

<template>
    <div class="container py-5">
        <div class="row">
            <!-- Colonna sinistra: Dati utente e lista appartamenti -->
            <div class="col-12 col-lg-4 border-end">
                <h1 class="text-center pb-3">
                    Benvenuto
                    <span v-if="api.user.firstname">{{ api.user.firstname }}</span>
                </h1>
                <!-- Lista dei dati utente -->
                <ul class="list-unstyled">
                    <li><strong>Email:</strong> {{ api.user?.email }}</li>
                    <li><strong>Numero di appartamenti:</strong> {{ filteredApartments.length }}</li>
                    <li v-if="api.user.firstname"><strong>Nome:</strong> {{ api.user?.firstname }}</li>
                    <li v-if="api.user.lastname"><strong>Cognome:</strong> {{ api.user?.lastname }}</li>
                    <li v-if="api.user.name"><strong>Nome utente:</strong> {{ api.user?.name }}</li>
                </ul>

                <!-- Barra di ricerca per appartamenti -->
                <div class="input-group py-3">
                    <span class="input-group-text">Cerca un appartamento...</span>
                    <input
                        type="text"
                        v-model="store.messageFilter"
                        class="form-control"
                        placeholder="Scrivi qui..."
                    />
                </div>

                <!-- Elenco appartamenti -->
                <div class="list-group message-container">
                    <button
                        v-for="apartment in filteredApartments"
                        :key="apartment.id"
                        class="list-group-item list-group-item-action"
                        :class="{ active: selectedApartment === apartment }"
                        @click="selectApartment(apartment)"
                    >
                        {{ apartment.title }}
                    </button>
                </div>
                <p v-if="filteredApartments.length === 0" class="text-center fst-italic mt-3">
                    Nessun appartamento con messaggi trovato.
                </p>
            </div>

            <!-- Colonna destra: Messaggi -->
            <div class="col-12 col-lg-8">
                <h1 class="text-center">Messaggi ricevuti</h1>
                <p class="fst-italic text-center">
                    Rispondi ai messaggi inviando una mail tramite la tua casella di posta personale.
                </p>

                <!-- Nessun appartamento selezionato -->
                <div v-if="!selectedApartment || selectedApartment.messages.length === 0" class="text-center">
                    <p v-if="!selectedApartment">Seleziona un appartamento per vedere i messaggi.</p>
                    <p v-else>Nessun messaggio per questo appartamento.</p>
                </div>

                <!-- Messaggi dell'appartamento selezionato -->
                <div v-else>
                    <h3 class="text-center">{{ selectedApartment.title }}</h3>
                    <!-- Barra di ricerca email -->
                    <div class="input-group py-3 mx-auto" style="width: 50%;">
                        <span class="input-group-text">Cerca una mail</span>
                        <input
                            type="text"
                            v-model="store.emailFilter"
                            class="form-control"
                            placeholder="Scrivi qui..."
                        />
                    </div>
                    <!-- Lista messaggi -->
                    <div class="overflow-auto border rounded p-3" style="max-height: 500px;">
                        <div
                            v-for="(message, index) in filteredMessages"
                            :key="index"
                            class="card mb-3"
                        >
                            <div class="card-body">
                                <p v-if="message.firstname || message.lastname" class="mb-1">
                                    <strong>Mittente:</strong>
                                    {{ message.firstname || '' }} {{ message.lastname || '' }}
                                </p>
                                <p class="mb-1">
                                    <strong>Email del mittente:</strong>
                                    {{ message.user_email }}
                                    
                                </p>
                                <p class="mt-3">{{ message.content }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container{
    min-height:77vh;
}
.border-end {
    border-right: 1px solid #e0e0e0 !important; /* Separazione visiva */
}

.list-group-item {
    cursor: pointer; /* Mostra il cursore a mano */
    transition: all 0.3s ease-in-out; /* Transizione per hover */
}

.message-container {
  max-height: 400px;
  overflow-y: auto;
}

.list-group-item.active {
    background-color: #007bff; /* Colore di selezione */
    color: white; /* Testo in bianco */
    font-weight: bold; /* Evidenziazione */
}

.card {
    border: 1px solid #e0e0e0; /* Bordo per i messaggi */
    border-radius: 5px; /* Angoli arrotondati */
    background-color: #f9f9f9; /* Sfondo chiaro */
}
</style>

