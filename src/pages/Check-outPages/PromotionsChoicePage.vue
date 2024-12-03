<script>
import axios from 'axios';
import { api, store } from '../../store';

export default {
    data() {
        return {
            api,
            store,
        };
    },
    mounted() {
        this.api.redirectIfNotCreated();
        this.api.getPromotions(); // Ottieni tutte le promozioni dal backend
    },
    methods: {
        choosePromotion(promotionId) { // Al click sul pulsante di scelta promozione si esegue questa funzione
            this.api.selectedPromotionId = promotionId; // La variabile selectedPromotionId viene riempita con l'ID della promozione scelta
            if (promotionId === null) { // Se la promozione è Standard, si esegue la funzione che crea l'apartment senza promozione
                this.api.createApartment(); // Funzione di creazione apartment
            } 
            else {
                this.store.storedApartment.append('promotions', this.api.selectedPromotionId)
            }
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
                    <router-link :to="{name: 'PromotionsCheckout'}" class="btn promotion-button mt-3" @click="choosePromotion(promotion.id) ">
                        Acquista {{ promotion.title }}
                    </router-link>
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
        <div v-show="store.APIError" class="fw-bold text-danger">Si è verificato un errore, verrai reindirizzato alla dashboard</div>
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
