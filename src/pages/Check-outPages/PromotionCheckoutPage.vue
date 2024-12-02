<script>
import axios from 'axios';
import { api, store } from '../../store';
export default {
    data() {
        return {
            api,
            store,
            selectedPromotionId: null, // ID della promozione selezionata
            today: null
        };
    },
    mounted(){
        // this.api.redirectIfNotCreated();
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
                console.log('Appartamento creato con successo')
            })
            .catch(error => {
                console.log(error);
            });
        }
    }
}
</script>

<template>
<div class="container">
    <div class="row py-4" >
        <div class="col-12">
            <h3 class="fw-bold">
                Hai scelto
                <span v-if="api.selectedPromotionId == 3">Bronze</span>
                <span v-else-if="api.selectedPromotionId == 2">Silver</span>
                <span v-else="api.selectedPromotionId == 1">Gold</span>
            </h3>
            <div class="payment">
                <form @submit.prevent="Payment()">
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
                        <input class="form-control" type="number" min="3" maxlength="3" required>
                    </div>
                    <button>Procedi al pagamento</button>
                </form>
            </div>
        </div>
    </div>
</div>
</template>
<style lang="scss" scoped>
@import '@/assets/scss/partials/variables.scss';
@import '@/assets/scss/partials/mixins.scss';

</style>

