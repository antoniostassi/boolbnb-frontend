<script>
export default {
  data() {
    return {
      research:''
    }
  },
  props:{
    address: {
      type: String,
      required: true
    }
  },
  mounted() {
    setTimeout(() => {
      this.research = this.address // Popola il v-model con la prop ricevuta 
    }, 100);
  }
}
</script>

<template>
  <form class="search-bar d-flex align-items-center mx-auto mt-4">
      <input
      type="text"
      placeholder="Inserisci destinazione..."
      class="form-control search-input"
      v-model="research"
      />
  </form>
</template>

<style scoped lang="scss">
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
        border-radius: 50px;
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
        background: #e352fa;
        color: white;
        font-weight: bold;
        transition: background 0.3s ease, transform 0.2s;

        &:hover {
          background: #e352fa;
          transform: scale(1.05);
        }

        &:active {
          background: #e352fa;
        }
      }
    }
</style>