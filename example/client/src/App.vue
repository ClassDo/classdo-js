<template>
  <div id="app">
    <div id="nav" v-if="!isLoginPage">
      <router-link to="/organization">Home</router-link> |
      <router-link to="/billing">Billing</router-link>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
  computed: {
    isLoginPage() {
      return this.$route.name === 'Login'
    }
  }

});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
