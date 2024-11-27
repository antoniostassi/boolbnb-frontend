<script>
import { tomtom } from '../../store';

export default {
  data() {
    return {
      tomtom,
    }
  }
}
</script>

<template>

    <form class="search-bar d-flex align-items-center mx-auto flex-wrap" @submit.prevent="searchApartments"> 
      <!-- All'invio del form, cambia la rotta verso la lista di tutti gli appartamenti, filtrandoli per indirizzo.-->
    <div class="position-relative flex-grow-1 me-2">
      <!-- Input logic -->
      <input v-model="this.tomtom.address" type="text" placeholder="Inserisci un indirizzo o una città" class="form-control search-input rounded-5 border"
        @input="this.tomtom.fetchSuggestions(this.tomtom.address)" autocomplete="off"/>

      <ul v-if="this.tomtom.suggestions.length" class="suggestions-list">
        <li v-for="(suggestion, index) in this.tomtom.suggestions" :key="index" @click="this.tomtom.selectSuggestion(suggestion)">
            {{ suggestion.address }}
        </li>
      </ul>

    </div>
  </form>
 
</template>

<style scoped lang="scss">
.search-bar {
      width: 100%;
      max-width: 700px;
      display: flex;
      align-items: center;

      .search-input {
        flex-grow: 1;
        border: none;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        outline: none;
        color: #333;

        &::placeholder {
          color: #999;
        }
      }

      .suggestions-list {
        position: absolute;
        z-index: 10;
        list-style: none;
        padding: 0;
        background-color: white;
        margin: 0;
        width: 100%;
        max-height: 150px;
        overflow-y: auto;
        border-radius: 5px;

        li {
          padding: 10px;
          cursor: pointer;
          color: black;
          text-align: start;
          

          &:hover {
            background: #eee;
          }
        }
      }
    }
</style>