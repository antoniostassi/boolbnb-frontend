<script>
import axios from 'axios';
import { api } from '../store';

export default {
    data() {
        return {
            navbarLinks: [
                { name: "Strutture", href: "/apartments" },
                { name: "Piani promozionali", href: "/promotions" },
                { name: "Servizi", href: "/services" },
                { name: "Chi siamo", href: "/about" },
                { name: "Contatti", href: "/contacts" },
            ],
            lastScrollY: 0, // Memorizza l'ultima posizione di scroll
            hideHeader: false, // Stato che indica se l'header deve essere nascosto
            isLoggedIn: false, // Stato per verificare se l'utente è loggato
            showLoginForm: false, // Stato per mostrare/nascondere il form di login

            // Variabili per il form di login e registrazione
            isRegistration: false, // Stato per passare da login a registrazione
            userEmail: '', // Email per il login/registrazione
            userPassword: '', // Password per il login/registrazione
            userPasswordConfirm: '', // Conferma password per la registrazione
            userName: '', // Nome per la registrazione
            userFirstname: '', // Nome per la registrazione
            userLastname: '', // Cognome per la registrazione
            userDateOfBirth: '', // Data di nascita per la registrazione
            testoErrore: '', // Errore visualizzato in caso di fallimento login/registrazione
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
            try {
                api.getCSRF();
                axios.defaults.headers.common["X-XSRF-TOKEN"] = api.getCrsfTokenFromCookies();
                
                await axios.post('http://localhost:8000/login', {
                    email: this.userEmail,
                    password: this.userPassword,
                });
                this.isLoggedIn = true;
                this.resetForm();
                this.showLoginForm = false; // Chiudi il form di login al successo
                this.$router.push('/'); // Reindirizza alla home
            } catch (error) {
                this.testoErrore = error.response?.data?.message || 'Errore durante il login.';
            }
        },
        async userRegister() {
            // Rimuovi spazi extra dalle password
            const trimmedPassword = this.userPassword.trim();
            const trimmedPasswordConfirm = this.userPasswordConfirm.trim();

            // Controllo se le password corrispondono
            if (trimmedPassword !== trimmedPasswordConfirm) {
                this.testoErrore = 'Le password non corrispondono.';
                return;
            }

            try {
                await axios.get('http://localhost:8000/sanctum/csrf-cookie');
                await axios.post('http://localhost:8000/register', {
                    name: this.userName,
                    firstname: this.userFirstname,
                    lastname: this.userLastname,
                    date_of_birth: this.userDateOfBirth,
                    email: this.userEmail,
                    password: trimmedPassword,
                    password_confirmation: trimmedPasswordConfirm,
                });
                
                // Effettua il login automaticamente dopo la registrazione
                await this.userLogin();

            } catch (error) {
                this.testoErrore = error.response?.data?.message || 'Errore durante la registrazione.';
            }
        },
        async userLogout() {
            try {
                await axios.post('http://localhost:8000/logout');
                this.isLoggedIn = false;
                this.$router.push('/'); // Reindirizza alla home dopo il logout
            } catch (error) {
                console.error('Errore durante il logout:', error.response?.data?.message || error.message);
            }
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
            this.testoErrore = '';
        }
    },
};
</script>

<template>
    <div>
        <header class="bg-gradient sticky-top" :class="{ 'hide-header': hideHeader }">
            <nav class="container d-flex align-items-center justify-content-between py-3">
                <!-- Logo -->
                <div class="logo-container">
                    <router-link to="/" class="d-flex align-items-center">
                        <img src="/img/BoolBnB Logo.png" alt="BoolBnB Logo" class="logo ms-3" />
                    </router-link>
                </div>

                <!-- Navbar -->
                <div class="navbar d-none d-lg-block">
                    <ul class="nav">
                        <li v-for="(link, index) in navbarLinks" :key="index" class="nav-item">
                            <router-link :to="link.href" class="nav-link">{{ link.name }}</router-link>
                        </li>
                    </ul>
                </div>

                
                <button class="d-lg-none btn border border-black ms-auto" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                    <img src="/icons/hamburgerMenu.svg" height="32" alt="Menù">
                </button>

                

                <!-- Auth Controls -->
                <div>
                    <!-- Se l'utente NON è loggato -->
                    <div v-if="!isLoggedIn" class="auth-buttons d-flex gap-2 d-none d-lg-block">
                        <button @click="showLoginForm = true; isRegistration = false" class="btn btn-outline-primary">Accedi</button>
                        <button @click="showLoginForm = true; isRegistration = true" class="btn btn-primary">Registrati</button>
                    </div>

                    <!-- Se l'utente è loggato -->
                    <div v-else class="dropdown profile-menu">
                        <a
                            href="#"
                            class="d-flex align-items-center"
                            id="dropdownMenuButton"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <img src="https://tecdn.b-cdn.net/img/new/avatars/2.jpg" alt="User Avatar" class="rounded-circle avatar" />
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                            <li><a class="dropdown-item" href="#">Profilo</a></li>
                            <li><a class="dropdown-item" href="#">Impostazioni</a></li>
                            <li><a class="dropdown-item" href="#" @click="userLogout">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>       
        
        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
            <div class="offcanvas-header">
                <h5 class="text-center ms-3" id="offcanvasRightLabel">
                    Menù |
                </h5>
                <h5 v-if="!isLoggedIn" class="text-center ms-1" id="offcanvasRightLabel">
                    <button @click="showLoginForm = true; isRegistration = false" class="btn offcanvas-btn-outline-primary">Accedi</button>
                    <button @click="showLoginForm = true; isRegistration = true" class="btn offcanvas-btn-primary">Registrati</button>
                </h5>
                <h5 v-else class="text-center ms-1" id="offcanvasRightLabel">
                    Benvenuto <!-- {{ user.FirstName + '' + user.LastName }} -->
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <!-- CORPO DELL'OFFCANVAS IN MOBILE DEVICES -->

                <div class="logo-container">
                    <router-link to="/" class="d-flex align-items-center">
                        <img src="/img/BoolBnB Logo.png" alt="BoolBnB Logo" class="logo ms-3" />
                    </router-link>
                </div>
                
                <!-- Navbar -->
                <div class="navbar">
                    <ul class="nav flex-column fs-5">
                        <li v-for="(link, index) in navbarLinks" :key="index" class="nav-item">
                            <router-link :to="link.href" class="nav-link">{{ link.name }}</router-link>
                        </li>
                    </ul>
                    <ul v-if="isLoggedIn" class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                        <li>
                            <a class="dropdown-item" href="#">
                                Profilo
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#">
                                Impostazioni
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#" @click="userLogout">
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Overlay Login/Register Form -->
        <div v-if="showLoginForm" class="overlay">
            <div class="overlay-content">
                <div class="card login-card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">{{ isRegistration ? 'Registrazione' : 'Login' }}</h5>
                        <button type="button" class="btn-close" aria-label="Close" @click="showLoginForm = false"></button>
                    </div>
                    <div class="card-body">
                        <form>
                            <!-- Sezione Registrazione -->
                            <div v-if="isRegistration">
                                <div class="mb-3">
                                    <label for="name" class="form-label">Username</label>
                                    <input type="text" class="form-control" id="name" placeholder="Inserisci il tuo username" v-model="userName" required>
                                </div>
                                <div class="mb-3">
                                    <label for="firstname" class="form-label">Nome</label>
                                    <input type="text" class="form-control" id="firstname" placeholder="Inserisci il tuo nome" v-model="userFirstname" required>
                                </div>
                                <div class="mb-3">
                                    <label for="lastname" class="form-label">Cognome</label>
                                    <input type="text" class="form-control" id="lastname" placeholder="Inserisci il tuo cognome" v-model="userLastname" required>
                                </div>
                                <div class="mb-3">
                                    <label for="dateOfBirth" class="form-label">Data di nascita</label>
                                    <input type="date" class="form-control" id="dateOfBirth" v-model="userDateOfBirth" required>
                                </div>
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="email" placeholder="Inserisci la tua email" v-model="userEmail" required>
                                </div>
                                <div class="mb-3">
                                    <label for="password" class="form-label">Password</label>
                                    <input type="password" class="form-control" id="password" placeholder="Inserisci la tua password" v-model="userPassword" required>
                                </div>
                                <div class="mb-3">
                                    <label for="passwordConfirm" class="form-label">Conferma Password</label>
                                    <input type="password" class="form-control" id="passwordConfirm" placeholder="Conferma la tua password" v-model="userPasswordConfirm" required>
                                </div>
                            </div>

                            <!-- Sezione Login -->
                            <div v-else>
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="email" placeholder="Inserisci la tua email" v-model="userEmail" required>
                                </div>
                                <div class="mb-3">
                                    <label for="password" class="form-label">Password</label>
                                    <input type="password" class="form-control" id="password" placeholder="Inserisci la tua password" v-model="userPassword" required>
                                </div>
                            </div>
                            <span class="text-danger">{{ testoErrore }}</span>

                            <!-- Cambia tra Login e Registrazione -->
                            <div>
                                <span v-if="isRegistration">
                                    Sei già registrato? <a href="#" @click="isRegistration = false">Accedi</a>
                                </span>
                                <span v-else>
                                    Non sei ancora registrato? <a href="#" @click="isRegistration = true">Registrati</a>
                                </span>
                            </div>
                            <div class="card-footer d-flex justify-content-end">
                                <button type="button" class="btn btn-secondary me-2" @click="showLoginForm = false">Chiudi</button>
                                <button type="button" class="btn btn-primary" @click="isRegistration ? userRegister() : userLogin()">{{ isRegistration ? 'Registrati' : 'Accedi' }}</button>
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
                            color: #E352FA;
                            border-radius: 4px;
                        }
                    }
                }
            }
        }

        .auth-buttons {
            .btn-outline-primary {
                color: #E352FA;
                border: 2px solid #E352FA;
                transition: all 0.3s;
                margin: 0 10px;

                &:hover {
                    background: #E352FA;
                    color: white;
                }
            }

            .btn-primary {
                background: #E352FA;
                border: 2px solid #E352FA;
                color: white;
                transition: all 0.3s;

                &:hover {
                    background: #e057a3;
                    border-color: #e057a3;
                }
            }
        }

        

        .profile-menu {
            .avatar {
                height: 35px;
                width: 35px;
                transition: transform 0.3s;

                &:hover {
                    transform: scale(1.1);
                }
            }

            .dropdown-menu {
                border-radius: 0.5rem;

                .dropdown-item {
                    font-size: 0.9rem;
                    color: #333;

                    &:hover {
                        color: #E352FA;
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

    .offcanvas-header {
        .offcanvas-btn-outline-primary {
                color: #E352FA;
                border: 2px solid #E352FA;
                transition: all 0.3s;
                margin: 0 10px;

                &:hover {
                    background: #E352FA;
                    color: white;
                }
            }

            .offcanvas-btn-primary {
                background: #E352FA ;
                border: 2px solid #E352FA;
                color: white;
                transition: all 0.3s;

                &:hover {
                    background: #e057a3;
                    border-color: #e057a3;
                }
            }
    }

    .offcanvas-body {
            .logo-container {

                display: flex;
                justify-content: center;

                .logo {
                    max-height: 75px;
                    margin: 20px;
                    transform: scale(1.5);
                    transition: transform 0.3s ease;

                    &:hover {
                        transform: scale(1.6);
                    }
                }
            }

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
                            color: #E352FA;
                            border-radius: 4px;
                        }
                    }
                }
            }

        }
</style>
