import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Login from './components/Login.vue'
import Organization from './components/Organization.vue'
import Billing from './components/Billing.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: () => '/login' },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/organization', component: Organization, name: 'Organization' },
    { path: '/billing', component: Billing, name: 'Billing' },
  ],
  mode: 'history'
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
