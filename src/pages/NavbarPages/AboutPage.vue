<script>
export default {
  data() {
    return {
      creators: [
        {
          name: "Alessandro Sclafani",
          role: "Full Stack Web Developer",
          description:
            "Appassionato di sviluppo di soluzioni complete, dal backend al frontend.",
          linkedin: "https://www.linkedin.com/in/alescla/"
        },
        {
          name: "Antonio Stassi",
          role: "Full Stack Web Developer",
          description:
            "Esperto nello sviluppo di API e integrazione di database con interfacce moderne.",
          linkedin: "https://www.linkedin.com/in/antonio-stassi-3316a8338/"
        },
        {
          name: "Gaetano Venuto",
          role: "Full Stack Web Developer",
          description:
            "Specializzato nello sviluppo di applicazioni interattive con Vue.js e Laravel.",
          linkedin: "https://www.linkedin.com/in/gaetanovenuto/"
        }
      ]
    };
  }
};
</script>

<template>
  <div class="d-flex flex-column">
    <header class="text-center bg-primary text-white py-3 animate__fadeInDown">
      <h1 class="display-5">Meet the Creators</h1>
    </header>
    <main class="flex-grow-1 bg-light py-4">
      <div class="container">
        <div class="row justify-content-center">
          <div
            v-for="(creator, index) in creators"
            :key="index"
            class="col-lg-3 col-md-5 col-sm-10 mb-4"
          >
            <div class="card border-0 shadow h-100 animate__fadeInUp">
              <div class="card-body text-center">
                <h2 class="h5 mb-2">{{ creator.name }}</h2>
                <p class="text-primary font-weight-bold mb-2">{{ creator.role }}</p>
                <p class="text-muted">{{ creator.description }}</p>
                <a
                  :href="creator.linkedin"
                  target="_blank"
                  class="btn btn-outline-primary btn-sm mt-3"
                >
                  View LinkedIn Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer class="footer bg-dark text-white py-2 text-center">
      <p class="mb-0">
        &copy; {{ new Date().getFullYear() }} BoolBnB. All rights reserved.
      </p>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/scss/partials/variables.scss';
@import '@/assets/scss/partials/mixins.scss';
@import 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';

/* Sfondo e header */
header {
  background: linear-gradient(135deg, $color-violet, $color-violet);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Stile principale delle card */
.card {
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.card-body {
  padding: 20px;
}

.card h2 {
  font-size: 18px;
}

.card p {
  font-size: 14px;
}

.btn {
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 13px;
}

/* Stile del footer */
.footer {
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  width: 100%;
  bottom: 0;
  font-size: 14px;
}

/* Animazioni con SCSS */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Applica le animazioni */
.animate__fadeInUp {
  animation: fadeInUp 1s ease-in-out;
}

.animate__fadeInDown {
  animation: fadeInDown 1s ease-in-out;
}
</style>
