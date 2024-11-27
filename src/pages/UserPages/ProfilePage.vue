<script>
import axios from 'axios';
import { api, store } from '../../store'

export default {
  data() {
    return {
      api,
      store
    };
  },
  components: {
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
        <div v-for="(apartment, index) in api.user.apartments" :key="index" class="border p-3 rounded" v-show="apartment.messages.length != 0">
          <p>{{ apartment.title }}:</p>
          <div v-for="message, i in apartment.messages" :key="i">
            <p>{{ message.content }}</p>
            <hr>
          </div>
        </div>
    </div>
</template>

<style>
</style>