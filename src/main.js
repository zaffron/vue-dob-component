import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;

// Assets files
import './assets/app.scss'

new Vue({
  render: h => h(App),
}).$mount('#app');
