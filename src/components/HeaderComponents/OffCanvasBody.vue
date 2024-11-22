<script>

import { store } from '../../store'

export default {
  data() {
    return {
        store
      };
  },
  components: {
  },
  methods: {
  },
}
</script>

<template>
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
                        <li v-for="(link, index) in store.navbarLinks" :key="index" class="nav-item">
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