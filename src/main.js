import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'bootstrap/dist/css/bootstrap.min.css'


// BootstrapVue
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// SCSS
import './assets/scss/layout.scss'


Vue.use(BootstrapVue)


//import Vue from 'vue'
import { BootstrapVueIcons } from 'bootstrap-vue'
import { IconsPlugin, ToastPlugin } from 'bootstrap-vue'

Vue.use(BootstrapVueIcons)
//Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(ToastPlugin) // 👈 QUAN TRỌNG


//import Vue from 'vue'





// jQuery + Bootstrap 4 JS (nếu bạn vẫn dùng)
import $ from 'jquery'
window.$ = $
window.jQuery = $

import Popper from 'popper.js'
window.Popper = Popper

import 'bootstrap/dist/js/bootstrap.min.js'

Vue.config.productionTip = false


/*khai báo RawLoader */
import RawLoader from "@/components/ComRawLoader.vue";//<--------------------------------------------add here
Vue.component('raw-loader',RawLoader)




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')