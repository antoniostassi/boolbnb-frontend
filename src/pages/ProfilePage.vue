<script>
import axios from 'axios';


export default {
  data() {
    return {

    };
  },
  components: {
  },
  methods: {
    // getData() {
    //   axios
    //     .get('http://localhost:8000/api/user')
    // }
  },
}
</script>

<template>
    <div class="container">
        <h1 class="text-center">
            Benvenuto {{ user.firstName + '' + user.lastName }}
        </h1>
    </div>
</template>

<style>
</style>