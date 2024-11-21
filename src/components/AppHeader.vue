<script>
export default {
    data() {
        return {
            navbarLinks: [
                { name: "Strutture", href: "/apartments" },
                { name: "Servizi", href: "/services" },
                { name: "Chi siamo", href: "/about" },
                { name: "Contatti", href: "/contacts" },
            ],
        };
    },
};
</script>


<template>
    <header class="bg-gradient sticky-top">
        <nav class="container d-flex align-items-center justify-content-between py-3">
            <!-- Logo -->
            <div class="logo-container">
                <router-link to="/" class="d-flex align-items-center">
                    <img src="/img/BoolBnB Logo.png" alt="BoolBnB Logo" class="logo">
                </router-link>
            </div>

            <!-- Navbar -->
            <div class="navbar">
                <ul class="nav">
                    <li v-for="(link, index) in navbarLinks" :key="index" class="nav-item">
                        <router-link :to="link.href" class="nav-link">{{ link.name }}</router-link>
                    </li>
                </ul>
            </div>

            <!-- Profile Menu -->
            <div class="dropdown profile-menu">
                <a
                    href="#"
                    class="d-flex align-items-center"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <img src="https://tecdn.b-cdn.net/img/new/avatars/2.jpg" alt="User Avatar" class="rounded-circle avatar">
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                </ul>
            </div>
        </nav>
    </header>
</template>



<style lang="scss">
header {
    background: linear-gradient(90deg, white 100%, rgba(240, 240, 240, 1) 100%);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(4px);

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
                    font-weight: 500;
                    padding: 0.5rem 1rem;
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