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
  <section>
    <div class="container d-flex flex-column justify-content-center align-items-center text-center">
      <h1 class="main-title">Trova la tua prossima struttura</h1>
      <p class="subtitle">Scopri le migliori strutture in pochi click.</p>
      <form class="search-bar d-flex align-items-center">
        <input
          type="text"
          placeholder="Inserisci destinazione o nome struttura"
          class="form-control search-input"
        />
        <button type="submit" class="btn search-button">Cerca</button>
      </form>
    </div>
  </section>
</template>



<style lang="scss">
section {
  background-image: url(../../public/img/homepage-main-photo.jpg);
  background-size: cover;
  background-position: center;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;

  .container {
    max-width: 800px;
    text-align: center;
    color: white;

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
        border-radius: 50px 0 0 50px; /* Arrotondato solo a sinistra */
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
        border-radius: 0 50px 50px 0; /* Arrotondato solo a destra */
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        background: #ff69b4; /* Colore personalizzato del logo */
        color: white;
        font-weight: bold;
        transition: background 0.3s ease, transform 0.2s;

        &:hover {
          background: #e057a3; /* Una tonalità leggermente più scura */
          transform: scale(1.05); /* Leggera crescita al passaggio */
        }

        &:active {
          background: #c84a91; /* Tonalità più scura al click */
        }
      }
    }
  }
}


</style>