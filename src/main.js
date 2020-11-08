import Vue from 'vue'
import App from './App.vue'

import theoneUi from './components'
import test from './example'

import axios from "axios"
Vue.use(theoneUi)
Vue.use(test)
Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  render: h => h(App),
}).$mount('#app')
