<script>
import axios from 'axios';
import { api } from '../../store';

export default {
    data() {
        return {
            userEmail: '',
            userPassword: '',
            loggedIn: false,
            testoErrore: ''
        };
    },
    components: {},
    mounted() {
        console.log("Hellow");
    },
    methods: {
        async userLogin() {
            await axios.get('http://localhost:8000/sanctum/csrf-cookie');

            await axios.post('http://localhost:8000/login', {  
                email: this.userEmail,
                password: this.userPassword
            })
            .then((response) => {
                this.$router.replace('/');
                document.querySelector('button.btn-close').click();
                
            }).catch((error) =>{
                this.testoErrore = error.response.data.message;
            });
        },

    },
};
</script>

<template>
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#loginDialog">
        Open Dialog
    </button>
    <!-- Bootstrap Dialog (Modal) -->
    <div class="modal fade" id="loginDialog" tabindex="-1" aria-labelledby="loginDialogLabel">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title" id="loginDialogLabel">Login</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <!-- Modal Body -->
        <div class="modal-body">

        <!-- Login Form-->
          <form>

            <div class="mb-3">
              <label for="email" class="form-label">Email address</label>
              <input type="email" class="form-control" id="email" placeholder="Enter your email" required v-model="userEmail">
            </div>
            
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control" id="password" placeholder="Enter your password" required v-model="userPassword">
            </div>
            <span class="text-danger">{{ testoErrore }}</span>
          </form>

        </div>
        <!-- Modal Footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary"  @click="userLogin">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>
