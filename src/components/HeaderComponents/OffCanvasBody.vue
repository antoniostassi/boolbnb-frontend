<script>
import axios from 'axios';
import { store, api } from '../../store'
export default {
  data() {
    return {
        store,
        api
      };
  },
  components: {
  },
  methods: {
    closeCanvas(){
        document.getElementById("close-canvas").click()
    }
  },
  
}
</script>

<template>
  <div class="offcanvas offcanvas-end w-100" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
            <div class="offcanvas-header">
                <h5 class="text-center ms-3" id="offcanvasRightLabel">
                    Menù |
                </h5>
                <h5 v-if="!this.api.isLoggedIn" class="text-center ms-1" id="offcanvasRightLabel">
                    <button @click="store.showLoginForm = true; store.isRegistration = false ; closeCanvas(); this.api.loginError = false;" class="btn offcanvas-btn-outline-primary">Accedi</button>
                    <button @click="store.showLoginForm = true; store.isRegistration = true; closeCanvas(); this.api.registrationError = false; " class="btn offcanvas-btn-primary">Registrati</button>
                </h5>
                <h5 v-else class="text-center ms-1" id="offcanvasRightLabel">
                    Benvenuto {{ api.user.firstname + ' ' + api.user.lastname }}
                </h5>
                <button type="button" id="close-canvas" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <!-- CORPO DELL'OFFCANVAS IN MOBILE DEVICES -->

                <div class="logo-container">
                    <router-link to="/" class="d-flex align-items-center" @click="closeCanvas()">
                        <img src="/img/BoolBnB Logo.png" alt="BoolBnB Logo" class="logo ms-3" />
                    </router-link>
                </div>
                
                <!-- Navbar -->
                <div class="navbar d-flex flex-column align-items-start">
                    <ul class="nav flex-column fs-5">
                        <li class="nav-item">
                            <router-link @click="closeCanvas()"
                                v-if="this.api.isLoggedIn"
                                :to="{ name: 'profile-page' }"
                                class="nav-link">
                                    Profilo
                            </router-link>
                        </li>
                        <li v-if="this.api.isLoggedIn" class="nav-item">
                            <router-link :to="{ name: 'your-apartments' }" class="nav-link" @click="closeCanvas()">
                                Le tue strutture
                            </router-link>
                        </li>
                        <li v-if="this.api.isLoggedIn" class="nav-item">
                            <a class="nav-link" href="#" @click="api.userLogout($router); closeCanvas()" >
                                Logout
                            </a>
                        </li>
                        <hr>
                        <li v-for="(link, index) in store.navbarLinks" :key="index" class="nav-item">
                            <router-link @click="closeCanvas()" :to="link.href" class="nav-link">{{ link.name }}</router-link>
                        </li>
                    </ul>
                    
                </div>
            </div>
        </div>

</template>

<style lang="scss">
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