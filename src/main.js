// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import fastClick from 'fastclick'
import './assets/css/reset.css'
import './assets/css/H5Reset.css'
import './assets/css/common.styl'
import inobounce from './assets/js/inobounce.min.js'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.prototype.$inobounce = inobounce;

// fastClick.attach(document.body);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',
  render: h => h(App)

})
