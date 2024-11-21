<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';

export default {
  data() {
    return {
    };
  },
  components: {
    AppHeader,
    AppFooter,
  },
  methods: {
  },
}
</script>

<template>
    <AppHeader/>
    <router-view></router-view>
    <AppFooter/>
</template>

<style src="./style.css">
</style>

