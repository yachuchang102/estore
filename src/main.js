import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import 'bootstrap'
import { ValidationProvider, extend, localize, ValidationObserver } from 'vee-validate'
import TW from 'vee-validate/dist/locale/zh_TW.json'
import { required, email } from 'vee-validate/dist/rules'// 按需求導入規則

import App from './App.vue'
import router from './router'
import './bus'
import currencyFilter from './filters/currency'
import dateFilter from './filters/date'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

Vue.component('Loading', Loading)
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
Vue.filter('currency', currencyFilter)
Vue.filter('date', dateFilter)

extend('secret', {
  validate: value => value === 'example',
  message: 'This is not the magic word'
})
extend('required', required)
extend('email', email)

localize('zh_TW', TW)

axios.defaults.withCredentials = true
// eslint-disable-next-line vars-on-top
var VueScrollTo = require('vue-scrollto')
// scrollto設定
Vue.use(VueScrollTo, {
  container: 'body',
  duration: 2500,
  easing: 'ease-in-out',
  offset: 0,
  force: true,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true
})

router.beforeEach((to, from, next) => {
  console.log(to, from, next)
  if (to.meta.requiresAuth) {
    const api = `${process.env.VUE_APP_API}/api/user/check`
    axios.post(api).then((response) => {
      console.log(response.data)
      if (response.data.success) {
        next()
      } else {
        next({
          path: '/login'
        })
      }
    })
  } else {
    next()
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
