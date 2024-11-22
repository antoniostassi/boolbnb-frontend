<script>

export default {
  data() {
    return {
    };
  },
  components: {
  },
  methods: {
    createApartment() {
      
    }
  },
}
</script>

<template>
  <form @submit.prevent="createApartment">
    <label for="title">Titolo della struttura</label>
    <input type="text" name="title" required>

    <label for="rooms">Numero di stanze</label>
    <input type="number" name="rooms" required>

    <label for="beds">Numero di letti</label>
    <input type="number" name="beds" required>

    <label for="bathrooms">Numero di bagni</label>
    <input type="number" name="bathrooms" required>

    
    <label for="apartment_size">Metri quadrati</label>
    <input type="number" name="apartment_size" required>

    <label for="address">Indirizzo</label>
    <input type="text" name="address" required>

    <label for="image">Immagine</label>
    <input type="text" name="image" required>

    <button type="submit">
      Crea
    </button>

  </form>
</template>

<style>
</style>