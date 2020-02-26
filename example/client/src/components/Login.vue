<template>
  <div class="login">
    <form @submit.prevent="login" >
      <input v-model="email" placeholder="email"/>
      <button type="submit">login</button>
    </form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import client from '../apis/client'
import accessToken from '../apis/accessToken'
export default Vue.extend({
  name: 'Login',
  data() {
    return { email: '' }
  },
  methods: {
    login() {
      client.withAuth().get<{ access_token: string }>('/api/signup', { data: { email: this.email } }).then(v => {
        accessToken.set(v.data.access_token)
        this.$router.push({ path: 'organization' })
      })
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
