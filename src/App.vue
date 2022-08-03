<template>
  <div id="app" class="p-6 min-h-screen">
    <Header />
    <router-view></router-view>
  </div>
</template>

<script>
import Header from 'Components/Header.vue';

export default {
  name: 'App',
  components: {
    Header
  }
};
</script>

<style>
  @import './styles/style.css';
</style>
