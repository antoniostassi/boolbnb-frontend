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
    <main>
      <router-view></router-view>
    </main>
    
    <AppFooter/>
</template>

<style>
  main {
    min-height: 650px;
  }
</style>

