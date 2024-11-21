<script>

export default {
    data() {
        return {
            navbarLinks: [
                { name: "Home", href: "/" },
                { name: "Apartments", href: "/apartments" },
                { name: "Services", href: "/services" },
                { name: "About", href: "/about" },
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
    <header>
        <nav>
            <div class="container mx-auto py-5 flex h-full items-center justify-between">
                <div class="logo-container">
                    <router-link to="/" class="nav-link single-nav-link">
                        <img src="/img/BoolBnB Logo.png" alt="BoolBnB" title="BoolBnB" class="logo">
                    </router-link>
                </div>
                <div class="navbar">
                    <ul class="navbar-nav nav-links flex h-full items-center justify-center">
                        <li v-for="(link, index) in navbarLinks" :key="index" class="nav-item mx-6">
                            <router-link :to="link.href" class="nav-link single-nav-link">{{ link.name }}</router-link>
                        </li>
                    </ul>
                </div>
                <div class="profile-menu relative">
                    <a
                        class="hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out"
                        href="#"
                        id="dropdownMenuButton2"
                        role="button"
                        aria-expanded="false">
                        <img
                            src="https://tecdn.b-cdn.net/img/new/avatars/2.jpg"
                            class="rounded-full"
                            style="height: 35px; width: 35px"
                            alt="User Avatar"
                            loading="lazy" />
                    </a>
                    <ul
                        class="absolute right-0 mt-2 min-w-max list-none rounded-lg bg-white shadow-lg text-sm text-neutral-700">
                        <li><a class="dropdown-item" href="#">Action</a></li>
                        <li><a class="dropdown-item" href="#">Another action</a></li>
                        <li><a class="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>


<style lang="css">
    .container {
        max-width: 1200px;
        margin: 0 auto;
    }

    header {
        background: linear-gradient(90deg, rgba(255, 255, 255, 1) 50%, rgba(240, 240, 240, 1) 100%);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        padding: 7.5px 0;
        position: sticky;
        top: 0;
        z-index: 1000;
    }

    .logo-container .logo {
        max-height: 50px;
        transform: scale(1.5);
        transition: transform 0.3s ease;
    }

    .logo-container:hover .logo {
        transform: scale(2);
    }

    .navbar ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
    }

    .navbar-nav li {
        display: inline-block;
    }

    .navbar-nav a {
        color: black;
        text-decoration: none;
        font-size: 18px;
        font-weight: 500;
        padding: 10px 20px;
        border-radius: 4px;
        transition: all 0.3s ease;
    }

    .navbar-nav a:hover {
        color: #ff69b4;
        background-color: rgba(0, 0, 0, 0.05);
    }

    .profile-menu ul {
        margin-top: 0;
        display: none; 
    }

    .profile-menu:hover ul, .profile-menu ul:hover {
        display: block; 
    }

    .profile-menu ul li {
        padding: 10px 20px;
    }

    .profile-menu ul li a {
        color: black;
        text-decoration: none;
        transition: all 0.2s ease;
    }

    .profile-menu ul li a:hover {
        color: #ff69b4;
    }

    

</style>