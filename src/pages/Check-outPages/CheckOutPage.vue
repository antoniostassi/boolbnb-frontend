<script>
import dropin from 'braintree-web-drop-in';
import axios from 'axios';
import { store, api } from '../../store.js';

export default {
    data() {
        return {
            store,
            api,
            dropinInstance: null, // istanza della Drop-in UI, inizialmente null
            loading: false, // stato di caricamento del pulsante
            promotionPrice: null, // variabile di promotionPrice settata a null
        }
    },
    mounted() {
        // recupera l'importo dalla query string di PromotionsChoicePage.vue
        this.promotionPrice = this.$route.query.price;
        // quando il componente è montato, inizializza la Drop-in UI
        this.initializeDropin();
    },
    methods: {
        initializeDropin() {
            axios 
                .get('http://localhost:8000/api/payment/token')
                .then((response) => {
                    const token = response.data.token;

                    dropin.create(
                        {
                            authorization: token,
                            container: "#dropin-container"
                        }
                    ),
                    (error, instance) => { 
                        if (!error) {
                            this.dropinInstance = instance;
                        } else {
                            console.error("Errore durante la creazione della Drop-in UI:", error);
                        }
                    }
                })
                .catch((error) => {
                    console.error(error);
                })
        },
        submitPayment() {
            // imposta lo stato di caricamento a true
            this.loading = true;

            // controlla che la Drop-in UI sia pronta
            if (this.dropinInstance) {
                // richiedi il metodo di pagamento selezionato dall'utente
                this.dropinInstance.requestPaymentMethod((err, payload) => {
                if (!err) {
                    // effettua una chiamata API per processare il pagamento
                    axios
                    .post('http://localhost:8000/api/payment/process', {
                        payment_method_nonce: payload.nonce, // nonce generato dalla Drop-in UI
                        amount: this.promotionPrice, // importo da pagare
                    })
                    .then((response) => {
                        if (response.data.success) {
                        // mostra un messaggio di successo
                        alert("Pagamento completato con successo!");
                        // reindirizza l'utente alla dashboard
                        this.$router.push("/user/dashboard");
                        } else {
                        // mostra un messaggio di errore
                        alert("Pagamento fallito: " + response.data.error);
                        }
                    })
                    .catch((error) => {
                        console.error("Errore durante il pagamento:", error);
                    })
                    .finally(() => {
                        // ripristina lo stato di caricamento
                        this.loading = false;
                    });
                } else {
                    console.error("Errore durante la richiesta del metodo di pagamento:", err);
                    this.loading = false;
                }
                });
            } else {
                console.error("La Drop-in UI non è stata inizializzata.");
                this.loading = false;
            }
        },
    }
}
</script>

<template>
    <div class="checkout-page">
        <h1 class="text-center">
            Effettua il tuo pagamento
        </h1>
        <p class="text-center">
            Importo da pagare: €{{ promotionPrice }}
        </p>
        <div id="dropin-container"></div>

        <button @click="submitPayment" :disabled="loading" class="btn btn-primary mt-3">
            Conferma e Paga
        </button>
    </div>
</template>

<style lang="scss" scoped>
    .checkout-page {
        text-align: center;
        margin: 0 auto;
    }
</style>