<script>

export default {
    data() {
        return {
            
        };
    },
    components: {
    },
    methods: {
    },
}
</script>

<template>
    <footer class="bg-gradient">
        
        <nav class="container d-flex align-items-start justify-content-evenly py-4">
            <!-- Logo -->
            <div class="logo-container d-none d-sm-block">
                <router-link to="/" class="d-flex align-items-center">
                    <img src="/img/BoolBnB Logo.png" alt="BoolBnB Logo" class="logo">
                </router-link>
            </div>            
        </nav>

        <div class="footer-bottom text-center py-3">
            <hr class="divider" />
            <p class="mb-0">&copy; 2024 BoolBnB. Tutti i diritti riservati.</p>
        </div>
    </footer>
</template>


<style lang="scss">
    footer {
        font-family: "Baumans", system-ui, sans-serif;
        background: linear-gradient(90deg, white 50%, rgba(240, 240, 240, 1) 100%);
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);

        .logo-container {
            .logo {
                max-height: 50px;
                transition: transform 0.3s ease-in-out;

                &:hover {
                    transform: scale(1.3);
                }
            }
        }

        .navbar {
            display: flex;

            .nav {
                .nav-item {
                    .nav-link {
                        color: black;
                        font-size: 14px;
                        font-weight: 500;
                        padding: 5px 0;
                        transition: color 0.3s ease-in-out, transform 0.3s ease-in-out;

                        &:hover {
                            color: #ff69b4;
                            transform: translateX(25px); 
                        }
                    }
                }
            }
        }

        .footer-bottom {
            text-align: center;
            color: #333;

            .divider {
                border: none;
                border-top: 1px solid rgba(0, 0, 0, 0.1);
                margin: 0 auto 1rem auto;
                max-width: 80%;
            }

            p {
                font-size: 12px;
                color: #555;
            }
        }
    }

</style>
