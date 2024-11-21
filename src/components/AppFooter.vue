<script>

export default {
    data() {
        return {
            helpLinks: [
                { name: "Centro assistenza", href: "/help" },
                { name: "Servizi", href: "/services" },
                { name: "Chi siamo", href: "/about" },
                { name: "Contatti", href: "/contacts" },
            ],
            generalLinks: [
                { name: "Il tuo profilo", href: "/help" },
                { name: "Cerca strutture", href: "/apartments" },
                { name: "Privacy", href: "/privacy" },
                { name: "Termini del servizio", href: "/terms" },
            ],
        };
    },
    components: {
    },
    methods: {
    },
}
</script>

<template>
    <footer class="bg-gradient sticky-top">
        <nav class="container d-flex align-items-center justify-content-start py-3">
            <!-- Logo -->
            <div class="logo-container">
                <router-link to="/" class="d-flex align-items-center">
                    <img src="/img/BoolBnB Logo.png" alt="BoolBnB Logo" class="logo">
                </router-link>
            </div>

            <!-- Navbar -->
            <div class="navbar mx-5">
                <ul class="nav flex-column mx-5">
                    <li v-for="(link, index) in helpLinks" :key="index" class="nav-item fw-bold">
                        <router-link :to="link.href" class="nav-link">{{ link.name }}</router-link>
                    </li>
                </ul>
                <ul class="nav flex-column mx-5">
                    <li v-for="(link, index) in generalLinks" :key="index" class="nav-item fw-bold">
                        <router-link :to="link.href" class="nav-link">{{ link.name }}</router-link>
                    </li>
                </ul>
            </div>

        </nav>
    </footer>
</template>

<style lang="scss">
footer {
    background: linear-gradient(90deg, white 50%, rgba(240, 240, 240, 1) 100%);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;

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
                    font-size: 1rem;
                    font-weight: 400;
                    padding: 3px;
                    transition: color 0.3s, background-color 0.3s;

                    &:hover {
                        color: #ff69b4;
                        border-radius: 4px;
                    }
                }
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
                    color: #ff69b4;
                }
            }
        }
    }
}

</style>
