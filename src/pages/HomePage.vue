<script>
import axios from "axios";
import SingleApartment from "../components/SingleApartment.vue";

export default {
    
    data() {
        return {
            apartments: [],
            promotedApartments: [],
        };
    },
    components: {
        SingleApartment,
    },
    methods: {
        getApartments() {
        axios
            .get("http://localhost:8000/api/apartment")
            .then((response) => {
                this.apartments = response.data;
                // console.log(response);

                // Filtra gli appartamenti con promozioni attive
                const promoted = this.apartments.filter(
                    (apartment) => apartment.promotions && apartment.promotions.length > 0
                );

                // Ho fatto generare un'immagine causale in quanto non funzionano le img del DB *

                // Assegna un'immagine casuale a ogni appartamento
                this.promotedApartments = promoted.map((apartment) => {
                    apartment.image = `https://picsum.photos/seed/${apartment.id}/400/300`; // * Commenta questo per vedere img del database
                    return apartment;
                });

                // Mescola casualmente e prendi i primi 3
                this.promotedApartments = this.promotedApartments
                    .sort(() => Math.random())
                    .slice(0, 3);
            })
            .catch((error) => {
                console.log("Errore nel caricamento degli appartamenti:", error);
            });
        },
    },
    created() {
        this.getApartments();
    },
};
</script>

<template>
    <div>
      <!-- Hero Section con sfondo e barra di ricerca -->
        <section class="hero">
            <div class="container text-center">
            <h1 class="main-title">Trova la tua prossima struttura</h1>
            <p class="subtitle">Scopri le migliori strutture in pochi click.</p>
                <form class="search-bar d-flex align-items-center mx-auto">
                    <input
                    type="text"
                    placeholder="Inserisci destinazione o nome struttura"
                    class="form-control search-input"
                    />
                    <button type="submit" class="btn search-button">Cerca</button>
                </form>
            </div>
        </section>
  

        <section class="promoted-section py-5">
            <div class="container flex-column">
                <h2 class="promoted-title text-center mb-4">Sponsorizzati</h2>
                <div class="cards-container d-flex justify-content-center flex-wrap">
                    <SingleApartment
                    v-for="(apartment, index) in promotedApartments"
                    :key="apartment.id"
                    :apartment="apartment"
                    :index="index"
                    />
                </div>
            </div>
        </section>
    </div>
</template>

<style lang="scss">

.hero {
  background-image: url(../../public/img/homepage-main-photo.jpg);
  background-size: cover;
  background-position: center;
  height: 75vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;

    .container {
        max-width: 800px;

        .main-title {
            font-size: 3rem;
            font-weight: bold;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
        }

        .subtitle {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);
        }

        .search-bar {
            width: 100%;
            max-width: 700px;
            display: flex;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 50px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

            .search-input {
                flex: 1;
                border: none;
                border-radius: 50px 0 0 50px;
                padding: 0.75rem 1rem;
                font-size: 1rem;
                outline: none;
                color: #333;

                &::placeholder {
                color: #999;
                }
            }

            .search-button {
                border: none;
                border-radius: 0 50px 50px 0;
                padding: 0.75rem 1.5rem;
                font-size: 1rem;
                background: #E352FA;
                color: white;
                font-weight: bold;
                transition: background 0.3s ease, transform 0.2s;

                &:hover {
                    background: #E352FA;
                    transform: scale(1.05);
                }

                &:active {
                    background: #E352FA;
                }
            }
        }
    }
}

.promoted-section {
  background: #f8f9fa;
  background-image: url(/img/card-background-section.jpg);
  background-size: cover;
  background-position: center;

    .promoted-title {
        font-size: 2.5rem;
        font-weight: bold;
        color: white;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7), 0 0 15px rgba(130, 82, 250, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        margin: 0 auto;
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUpTitle 1s ease forwards;

    
    &::after {
        content: "";
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 40%;
        height: 3px;
        background: linear-gradient(90deg, #ff69b4, #8a2be2);
        border-radius: 10px;
        opacity: 0;
        animation: fadeInLine 1s ease forwards 0.5s;
    }

    @keyframes fadeInUpTitle {
        0% {
            opacity: 0;
            transform: translateY(20px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeInLine {
        0% {
            opacity: 0;
            width: 0;
        }
        100% {
            opacity: 1;
            width: 20%;
        }
    }
}

    .cards-container {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 2rem;
    }

    .card {
        width: 18rem;
        border: none;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease, box-shadow 0.3s ease;

        img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            transition: transform 0.3s ease;
        }

        .card-body {
            background: #fff;
            padding: 1rem;

            .card-title {
                font-size: 1.25rem;
                font-weight: bold;
            }

            .card-text {
                font-size: 1rem;
                color: #666;
                margin-bottom: 1rem;
            }

            .btn {
                background-color: #e352fa;
                border: none;
                color: #fff;
                font-weight: bold;

            &:hover {
                background-color: #ff69b4;
                }
            }
        }

        &:hover {
            transform: translateY(-20px); 
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); 

            img {
                transform: scale(1.05);
            }
        }
    }
}


</style>