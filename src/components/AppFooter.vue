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
        
        <nav class="container d-flex align-items-start justify-content-evenly">
            <!-- Logo -->
            <div class="logo-container mt-4">
                <router-link to="/" class="d-flex align-items-center">
                    <img src="/img/Guestly_Logo.png" alt="Guestly Logo" class="logo">
                </router-link>
            </div>            
        </nav>
        <div class="footer-bottom text-center">
            <p class="mb-0 mt-2">&copy; 2024 Guestly. Tutti i diritti riservati.</p>
        </div>
    </footer>
</template>


<style lang="scss">
    footer {
        
        font-family: "Baumans", system-ui, sans-serif;
        background: linear-gradient(90deg, white 50%, rgba(240, 240, 240, 1) 100%);
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
        min-height:15vh;
        .logo-container {
            .logo {
                max-height: 50px;
                transition: transform 0.3s ease-in-out;
                &:hover {
                    transform: scale(1.1);
                }
            }
        }

        .footer-bottom {
            text-align: center;
            color: #333;

            p {
                font-size: 12px;
                color: #555;
            }
        }
    }

</style>
