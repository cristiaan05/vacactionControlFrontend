import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from '../src/router/index'
import store from '../src/store/index'
import Axios from 'axios'
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css'

Vue.use(VueMaterial);

Vue.prototype.$http = Axios;
Vue.config.productionTip = false
const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}


new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
