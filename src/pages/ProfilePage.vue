<script>
import axios from 'axios';
import { api, store } from '../store'

export default {
  data() {
    return {
      api,
      store
    };
  },
  components: {
  },
  mounted() {
    this.api.getUserData();
  },
  methods: {
    
  },
}
</script>

<template>
    <div class="container">
        <h1 class="text-center py-3">
            Benvenuto 
            <span v-show="api.user.firstname != null">
              {{ api.user.firstname }}
            </span>
        </h1>
    </div>
</template>

<style>
</style>