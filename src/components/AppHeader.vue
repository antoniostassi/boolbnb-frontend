<script>
import axios from 'axios';
import OffCanvasBody from './HeaderComponents/OffCanvasBody.vue';
import { store, api } from '../store'

export default {
    components: { 
        OffCanvasBody 
    },
    data() {
        return {
            store,
            api,
            lastScrollY: 0, // Memorizza l'ultima posizione di scroll
            hideHeader: false, // Stato che indica se l'header deve essere nascosto
            userEmail: '', // Email per il login/registrazione
            userPassword: '', // Password per il login/registrazione
            userPasswordConfirm: '', // Conferma password per la registrazione
            userName: '', // Nome per la registrazione
            userFirstname: '', // Nome per la registrazione
            userLastname: '', // Cognome per la registrazione
            userDateOfBirth: '', // Data di nascita per la registrazione
            errorText: '', // Errore visualizzato in caso di fallimento login/registrazione
        };
    },
    mounted() {
        // Aggiungi il listener per lo scroll
        window.addEventListener("scroll", this.handleScroll);
    },
    beforeDestroy() {
        // Rimuovi il listener quando il componente viene distrutto
        window.removeEventListener("scroll", this.handleScroll);
    },
    methods: {
        
        handleScroll() {
            const currentScrollY = window.scrollY;

            if (currentScrollY > this.lastScrollY && currentScrollY > 50) {
                this.hideHeader = true;
            } else {
                this.hideHeader = false;
            }

            this.lastScrollY = currentScrollY;
        },
        async userLogin() {
            this.api.loginError = false;
            this.store.formSubmitted = true;
            // controlla se i campi sono stati riempiti
            await axios.post('http://localhost:8000/login', {  
                email: this.userEmail,
                password: this.userPassword
            })
            .then((response) => {
                this.api.isLoggedIn = true;
                this.api.getCSRF();
                this.api.getUserData();
                this.resetForm();
                this.store.showLoginForm = false; // Chiudi il form di login al successo
                // this.$router.push('/'); // Reindirizza alla home
                
            }).catch((error) =>{
                this.api.loginError = true;
                this.testoErrore = error.response?.data?.message || 'Errore durante il login.';
            });
            setTimeout(() => {
                this.store.formSubmitted = false;
            }, 2000);
        },
        async userRegister() {
            this.api.registrationError = false;
            this.store.formSubmitted = true;
            // Rimuovi spazi extra dalle password
            const trimmedPassword = this.userPassword.trim();
            const trimmedPasswordConfirm = this.userPasswordConfirm.trim();
            // Controllo se le password corrispondono
            if (trimmedPassword !== trimmedPasswordConfirm) {
                this.errorText = 'Le password non corrispondono.';
                setTimeout(() => {
                    this.store.formSubmitted = false;
                }, 2000);
                return;
            }
            try {
                await axios.get('http://localhost:8000/sanctum/csrf-cookie');
                await axios.post('http://localhost:8000/register', {
                    name: this.userName,
                    firstname: this.userFirstname,
                    lastname: this.userLastname,
                    dob: this.userDateOfBirth,
                    email: this.userEmail,
                    password: trimmedPassword,
                    password_confirmation: trimmedPasswordConfirm,
                });
                // Effettua il login automaticamente dopo la registrazione
                await this.userLogin();

            } catch (error) {
                this.testoErrore = error.response?.data?.message;
            }
            setTimeout(() => {
                this.store.formSubmitted = false;
            }, 2000);
        },
        
        resetForm() {
            // Resetta i dati del form
            this.userEmail = '';
            this.userPassword = '';
            this.userPasswordConfirm = '';
            this.userName = '';
            this.userFirstname = '';
            this.userLastname = '';
            this.userDateOfBirth = '';
            this.errorText = '';
        }
    },
};
</script>

<template>
    <div>
        <header id="main-container" class="bg-gradient sticky-top" :class="{ 'hide-header': hideHeader }">
            <nav class="container d-flex align-items-center justify-content-between py-3">
                <!-- Logo -->
                <div class="logo-container">
                    <router-link to="/" class="d-flex align-items-center">
                        <img src="/img/Guestly Logo.png" alt="Guestly Logo" class="logo ms-3" />
                    </router-link>
                </div>

                <!-- Navbar -->
                <div class="navbar d-none d-lg-block">
                    <ul class="nav">
                        <li v-for="(link, index) in store.navbarLinks" :key="index" class="nav-item">
                            <router-link :to="link.href" class="nav-link">
                                {{ link.name }}
                            </router-link>
                        </li>
                    </ul>
                </div>

                
                <button class="d-lg-none btn border border-black ms-auto" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                    <img src="/icons/hamburgerMenu.svg" height="32" alt="Menù">
                </button>

                

                <!-- Auth Controls -->
                <div>
                    <!-- Se l'utente NON è loggato -->
                    <div v-if="!this.api.isLoggedIn" class="auth-buttons d-flex gap-2 d-none d-lg-block">
                        <button @click="store.showLoginForm = true; store.isRegistration = false; this.api.loginError = false;" class="btn btn-outline-primary">Accedi</button>
                        <button @click="store.showLoginForm = true; store.isRegistration = true ; this.api.registrationError = false;" class="btn btn-primary">Registrati</button>
                    </div>

                    <!-- Se l'utente è loggato -->
                    <div v-else class="dropdown profile-menu d-none d-lg-inline-block">
                        <div href="#" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                            <div class="avatar fw-bold fs-5">{{ api.user.firstname[0]}}</div>
                        </div>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                            <router-link
                                :to="{ name: 'profile-page' }"
                                class="dropdown-item">
                                    Profilo
                            </router-link>

                            <router-link :to="{ name: 'your-apartments' }" class="dropdown-item">
                                Le tue strutture
                            </router-link>
                            <li>
                                <a class="dropdown-item" href="#" @click="api.userLogout($router);">
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>       
        
        <OffCanvasBody/>

        <!-- Overlay Login/Register Form -->
        <div v-if="store.showLoginForm" class="overlay">
            <div class="overlay-content">
                <div class="card login-card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">{{ store.isRegistration ? 'Registrazione' : 'Login' }}</h5>
                        <button type="button" class="btn-close" aria-label="Close" @click="store.showLoginForm = false; resetForm()"></button>
                    </div>
                    <div class="card-body">
                        <form  @submit.prevent="store.isRegistration ? userRegister() : userLogin()">
                            <!-- Sezione Registrazione -->
                            <div v-if="store.isRegistration">
                                <div class="mb-2">
                                    <label for="name" class="form-label">Username <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="name" name="name" placeholder="Inserisci il tuo username" v-model="userName" minlength="3" maxlength="255" required autocomplete="name">
                                </div>
                                <div class="mb-2">
                                    <label for="firstname" class="form-label">Nome <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control"  id="firstname"  name="firstname" placeholder="Inserisci il tuo nome" v-model="userFirstname" minlength="3" maxlength="40" required autocomplete="firstname">
                                </div>
                                <div class="mb-2">
                                    <label for="lastname" class="form-label">Cognome <span class="text-danger">*</span></label>
                                    <input type="text"  class="form-control" id="lastname" name="lastname" placeholder="Inserisci il tuo cognome" v-model="userLastname"  required minlength="3" maxlength="40" autocomplete="lastname">
                                </div>
                                <div class="mb-2">
                                    <label for="dateOfBirth" class="form-label">Data di nascita <span class="text-danger">*</span></label>
                                    <input type="date" class="form-control"  id="dateOfBirth"  name="dateOfBirth" v-model="userDateOfBirth" required autocomplete="dateOfBirth">
                                </div>
                                <div class="mb-2">
                                    <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
                                    <input type="email" class="form-control"  id="email"  name="email" placeholder="Inserisci la tua email" v-model="userEmail" required minlength="5" maxlength="255" autocomplete="email">
                                </div>
                                
                                <div class="mb-2">
                                    <label for="password" class="form-label">Password <span class="text-danger">*</span></label>
                                    <input type="password" 
                                    class="form-control" id="password" name="password" placeholder="Inserisci la tua password" v-model="userPassword" required minlength="8" maxlength="50" autocomplete="password">
                                </div>
                                <div class="mb-2">
                                    <label for="passwordConfirm" class="form-label">Conferma Password <span class="text-danger">*</span></label>
                                    <input type="password" class="form-control"  id="passwordConfirm" name="passwordConfirm" placeholder="Conferma la tua password" v-model="userPasswordConfirm" required minlength="8" maxlength="50" autocomplete="passwordConfirm">
                                </div>
                                <p class="mb-0">I campi contrassegnati con <span class="text-danger">*</span> sono obbligatori</p>
                                <p class="text-danger fw-bold mb-0">{{ testoErrore }}</p>
                            </div>

                            <!-- Sezione Login -->
                            <div v-else>
                                <div class="mb-2">
                                    <label for="email" class="form-label">Email</label>
                                    <input type="email" class="form-control" name="email" id="email" placeholder="Inserisci la tua email" v-model="userEmail" required autocomplete="email">
                                </div>
                                <div class="mb-2">
                                    <label for="password" class="form-label">Password </label>
                                    <input  type="password" class="form-control" name="password" id="password" placeholder="Inserisci la tua password" v-model="userPassword" required autocomplete="password">
                                </div>
                                <p v-show="this.api.loginError" class="text-danger fw-bold">Email o password errata</p>
                            </div>
                            <span class="text-danger">{{ errorText }}</span>

                            <!-- Cambia tra Login e Registrazione -->
                            <div>
                                <span v-if="store.isRegistration">
                                    Sei già registrato? <a href="#" @click="store.isRegistration = false; resetForm()">Accedi</a>
                                </span>
                                <span v-else>
                                    Non sei ancora registrato? <a href="#" @click="store.isRegistration = true; resetForm()">Registrati</a>
                                </span>
                            </div>
                            <div class="card-footer d-flex justify-content-end">
                                <button type="button" class="btn btn-secondary me-2" @click="store.showLoginForm = false; resetForm()">Chiudi</button>
                                <button type="submit" class="btn btn-primary" :disabled="store.formSubmitted">{{ store.isRegistration ? 'Registrati' : 'Accedi' }}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    header {
        font-family: "Baumans", system-ui !important;
        background: linear-gradient(90deg, white 100%, rgba(240, 240, 240, 1) 100%);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(4px);
        position: sticky;
        top: 0;
        z-index: 1000;
        transition: transform 0.3s ease-in-out;

        &.hide-header {
            transform: translateY(-100%);
        }

        .logo-container {
            .logo {
                max-height: 40px;
                transform: scale(1.5);
                transition: transform 0.3s ease;

                &:hover {
                    transform: scale(1.8);
                }
            }
        }

        .navbar {
            .nav {
                display: flex;
                gap: 1rem;

                .nav-item {
                    .nav-link {
                        color: black;
                        font-size: 20px;
                        font-weight: 500;
                        padding: 0.5rem 0.5rem;
                        transition: color 0.3s, background-color 0.3s;

                        &:hover {
                            color: #360000;
                            border-radius: 4px;
                        }
                    }
                }
            }
        }

        .auth-buttons {
            .btn-outline-primary {
                color: #360000;
                border: 2px solid #360000;
                transition: all 0.3s;
                margin: 0 10px;

                &:hover {
                    background: #360000;
                    color: white;
                }
            }

            .btn-primary {
                background: #360000;
                border: 2px solid #360000;
                color: white;
                transition: all 0.3s;

                &:hover {
                    background: #e057a3;
                    border-color: #e057a3;
                }
            }
        }

        
        #dropdownMenuButton{
            height: 35px;
            width: 35px;
            border-radius:50%;
            border:1px solid black;
            position:relative;
            cursor:pointer;
            transition: transform .1s linear;
            .avatar {
                position: absolute;
                top:50%;
                left:50%;
                transform:translate(-50%, -50%)
            }
            &:hover{
                transform: scale(110%);
            }
        }
        .profile-menu {
            

            .dropdown-menu {
                border-radius: 0.5rem;

                .dropdown-item {
                    font-size: 0.9rem;
                    color: #333;

                    &:hover {
                        color: #360000;
                    }
                }
            }
        }
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8); // Dark overlay background
        z-index: 1050;
        display: flex;
        align-items: center;
        justify-content: center;

        .overlay-content {
            width: 100%;
            max-width: 500px; // Increased size
            padding: 30px;
        }

        .login-card {
            background: white;
            border-radius: 1rem; // More rounded corners for a modern look
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3); // Increased shadow for depth
            padding: 20px;
        }
    }
</style>
