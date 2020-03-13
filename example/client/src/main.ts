import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Organization from './components/Organization.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    { path: '/organization', component: Organization }
  ],
  mode: 'history'
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
