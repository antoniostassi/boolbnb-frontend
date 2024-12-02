<script>
import axios from 'axios';
import { api, store } from '../../store';

export default {
    data() {
        return {
            api,
            store,
            selectedPromotionId: null, // ID della promozione selezionata
            today: null,
            showPayment: false,
        };
    },
    mounted() {
        // this.api.redirectIfNotCreated();
        this.api.getPromotions(); // Ottieni tutte le promozioni dal backend
        this.takeTodayDate();
    },
    methods: {

        takeTodayDate(){
            const date = new Date();
            let day = ''
            let month = ''
            if(date.getDate() < 10){
                day = '0' + date.getDate();
            }
            else{
               day = date.getDate();
            }
            if(date.getMonth() < 10){
                month = '0' + date.getMonth();
            }
            else{
               month = date.getMonth();
            }
            const year = date.getFullYear(); 
            this.today = `${year}-${month}-${day}`;
        },
        choosePromotion(promotionId) { // Al click sul pulsante di scelta promozione si esegue questa funzione
            this.selectedPromotionId = promotionId; // La variabile selectedPromotionId viene riempita con l'ID della promozione scelta
            if (promotionId === null) { // Se la promozione è Standard, si esegue la funzione che crea l'apartment senza promozione
                this.createApartment(); // Funzione di creazione apartment
            } 
            else {
                this.store.storedApartment.append('promotions', this.selectedPromotionId)
                this.store.storedApartment.append('promotion_days', this.api.promotions.duration_time )
            // braintree payment
            axios.post('https://payments.sandbox.braintree-api.com/graphql',
            {
                query: `query { ping }` 
            },
            {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sandbox_9qq3yksf_58rry6f7bkwwx3gq', 
                'Braintree-Version': '2023-01-01' 
            },
            withCredentials: false
            })
            .then(response => {
                this.createApartment();
            })
            .catch(error => {
                console.log(error);
            });
            }
        },
        createApartment() { // Funzione di creazione apartment
            axios
                .post('http://localhost:8000/api/apartments', 
                this.store.storedApartment,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }) // Chiamata API che passa i dati in post dell'oggetto apartment
                .then((response) => {
                    console.log(response.data);
                    this.store.createdApartmentCheck = true;
                    setTimeout(() => {
                    this.store.createdApartmentCheck = false;
                    }, 5000);
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
            <div
                v-for="(promotion, index) in api.promotions.filter(promotion => promotion.id === 3 || promotion.id === 2 || promotion.id === 1)"
                :key="index"
                class="col-12 col-md-6 col-lg-3"
            >
                <div class="promotion-box d-flex flex-column justify-content-between align-items-center p-4 h-100" 
                    :class="{'bronze': promotion.id === 3, 'silver': promotion.id === 2, 'gold': promotion.id === 1}">
                    <h2 class="promotion-title text-uppercase fw-bold mb-3">
                        {{ promotion.title }}
                    </h2>
                    <p class="promotion-description text-muted text-center flex-grow-1">
                        {{ promotion.description }}
                    </p>
                    <p class="promotion-price fw-bold">
                        Prezzo: €{{ promotion.price }}
                    </p>
                    <button class="btn promotion-button mt-3" @click="showPayment = true; selectedPromotionId = promotion.id">
                        Acquista {{ promotion.title }}
                    </button>
                </div>
            </div>
            <!-- Aggiungi l'opzione per la promozione standard -->
            <div class="col-12 col-md-6 col-lg-3">
                <div class="promotion-box d-flex flex-column justify-content-between align-items-center p-4 h-100 standard">
                    <h2 class="promotion-title text-uppercase fw-bold mb-3">
                        Standard
                    </h2>
                    <p class="promotion-description text-muted text-center flex-grow-1">Nessun costo aggiuntivo</p>
                    <button class="btn promotion-button mt-3" @click="choosePromotion(null)">
                        Scegli Standard
                    </button>
                </div>
            </div>
        </div>
        <!-- checkout -->
        <div class="row py-4" v-show="selectedPromotionId">
            <div class="col-12">
                <button @click="console.log(store.storedApartment)">test</button>
                <h3 class="fw-bold">
                    Hai scelto
                    <span v-if="selectedPromotionId == 3">Bronze</span>
                    <span v-else-if="selectedPromotionId == 2">Silver</span>
                    <span v-else="selectedPromotionId == 1">Gold</span>
                </h3>
                <div class="payment">
                    <div class="py-2">
                        <label for="name">Nome:</label>
                        <input id="name" class="form-control" type="text" disabled :value="api.user.firstname">
                    </div>
                    <div class="py-2">
                        <label for="surname">Cognome:</label>
                        <input id="surname" class="form-control" type="text" disabled :value="api.user.lastname">
                    </div>
                    <div class="py-2">
                        <label for="email">E-mail:</label>
                        <input id="email" class="form-control" type="email" disabled :value="api.user.email">
                    </div>
                    <div class="py-2">
                        <label for="card">Numero carta:</label>
                        <input id="card" class="form-control" type="number" minlength="16" maxlength="16" placeholder="Inserisci il numero della tua carta..." required>
                    </div>
                    <div class="py-2">
                        <label for="expiring_date">Data di scadenza:</label>
                        <input id="expiring_date" :min="today" :value="today" required class="form-control" type="date">
                    </div>
                    <div class="py-2">
                        <label for="name">CVV:</label>
                        <input class="form-control" type="number" minlength="3" maxlength="3" required>
                    </div>
                    <button @click=choosePromotion(selectedPromotionId)>Procedi al pagamento</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/partials/variables.scss';
@import '@/assets/scss/partials/mixins.scss';

.promotions-choice-page {
    font-family: 'Arial', sans-serif;
    h1 {
        font-size: $font-size-xl;
        color: $color-primary-dark;
    }
    p {
        font-size: $font-size-md;
        color: $color-secondary-dark;
    }
    .promotion-box {
        @include border-box($border-radius-md, 2px solid $color-border);
        background-color: $color-white;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        text-align: center;
        display: flex;
        flex-direction: column;
        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .promotion-title {
            font-size: $font-size-lg;
        }
        .promotion-description {
            font-size: $font-size-md;
        }
        .promotion-price {
            font-size: $font-size-lg;
            color: $color-primary-dark;
        }
        .promotion-button {
            width: 100%;
            padding: $spacing-sm;
            border: none;
            border-radius: $border-radius-sm;
            font-weight: bold;
            text-transform: uppercase;
            transition: transform 0.3s ease, opacity 0.3s ease;
            &:hover {
                transform: scale(1.05);
                opacity: 0.9;
            }
        }
    }
    .standard {
        border-color: $color-standard;
        .promotion-title {
            color: $color-standard;
        }
        .promotion-button {
            background-color: $color-standard;
            color: $color-white;
        }
    }
    .bronze {
        border-color: $color-bronze;
        .promotion-title {
            color: $color-bronze;
        }
        .promotion-button {
            background-color: $color-bronze;
            color: $color-white;
        }
    }
    .silver {
        border-color: $color-silver;
        .promotion-title {
            color: $color-silver;
        }
        .promotion-button {
            background-color: $color-silver;
            color: $color-white;
        }
    }
    .gold {
        border-color: $color-gold;
        .promotion-title {
            color: $color-gold;
        }
        .promotion-button {
            background-color: $color-gold;
            color: $color-white;
        }
    }
    @media (max-width: 576px) {
        .promotion-box {
            padding: $spacing-xs;
        }
        .promotion-title {
            font-size: $font-size-sm;
        }
        .promotion-description {
            font-size: $font-size-sm;
        }
        .promotion-button {
            padding: $spacing-xs;
        }
    }
}
</style>
