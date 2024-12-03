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
            cardNumber: null,
            cardCVV: null,
            CardError: false,
        };
    },
    mounted(){
        this.api.redirectIfNotCreated();
        this.takeTodayDate();
    },
    methods:{
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
        Payment(){
            this.CardError = false;
            this.store.formSubmitted = true
            if(this.cardCVV.toString().length == 3 && this.cardNumber.toString().length == 16){
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
                    this.api.createApartment();
                    
                })
                .catch(error => {
                    console.log(error);
                });
            }
            else{
                this.CardError = true;
            }
        }
    }
}
</script>

<template>
<div class="container">
    <div class="row py-4" >
        <div class="col-12">
            <h3 class="fw-bold">
                Hai scelto: 
                <span v-if="api.selectedPromotionId == 3">Bronze</span>
                <span v-else-if="api.selectedPromotionId == 2">Silver</span>
                <span v-else="api.selectedPromotionId == 1">Gold</span>
            </h3>
            <div class="payment">
                <form @submit.prevent="Payment()" class="border rounded p-4">
                    <div class="py-2 pe-2">
                        <label for="name">Nome:</label>
                        <input id="name" class="form-control" type="text" disabled :value="api.user.firstname">
                    </div>
                    <div class="py-2 pe-2">
                        <label for="surname">Cognome:</label>
                        <input id="surname" class="form-control" type="text" disabled :value="api.user.lastname">
                    </div>
                    <div class="py-2 pe-2">
                        <label for="email">E-mail:</label>
                        <input id="email" class="form-control" type="email" disabled :value="api.user.email">
                    </div>
                    <div class="d-flex w-100 flex-wrap justify-content-between align-items-center">
                        <div class="col-12 col-md-6 pe-2">
                            <label for="card">Numero carta:</label>
                            <input id="card" class="form-control" type="number" v-model="cardNumber" placeholder="Inserisci il numero della tua carta..." required>
                        </div>
                        <div class="col-6 col-md-3 pe-2">
                            <label for="expiring_date">Data di scadenza:</label>
                            <input id="expiring_date" :min="today" :value="today" required class="form-control" type="date">
                        </div>
                        <div class="col-6 col-md-3 pe-2">
                            <label for="name">CVV:</label>
                            <input class="form-control" type="number" v-model="cardCVV" required>
                        </div>
                        <div v-show="store.APIError" class="text-danger fw-bold">Errore: si è verificato un errore inaspettato, verrai reindirizzato alla tua dashboard</div>
                        <div v-show="CardError" class="text-danger fw-bold">Errore: controlla i dati della carta</div>
                        <div class="col-12 pe-2 text-end py-2 fs-5 fw-bold">
                            Totale da pagare: <span class="price p-1 rounded">{{ api.promotions[api?.selectedPromotionId - 1]?.price }}€</span>
                        </div>
                    </div>
                    <div class="w-100 text-end">
                        <button class="btn text-white" :disabled="store.formSubmitted">Procedi al pagamento</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</template>
<style lang="scss" scoped>
@import '@/assets/scss/partials/variables.scss';
@import '@/assets/scss/partials/mixins.scss';
button{
    background-color: $color-violet;
    &:hover{
        background-color: $color-lightviolet;
    }
}
.price{
    background-color:rgb(132, 216, 132)
}
</style>

