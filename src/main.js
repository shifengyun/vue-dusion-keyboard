import Vue from 'vue'
import App from './App.vue'
import VueDusionKeyboard from '../lib/index.js'
// // import  'animate.css'
// import VueDusionKeyboard from 'vue-dusion-keyboard'



Vue.use(VueDusionKeyboard)

new Vue({
  el: '#app',
  render: h => h(App)
})
