import Vue from 'vue'
import App from './app/App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import store from './store/auth-store'
import './assets/css/sanitize.css'
import './assets/css/main.css'
import './assets/css/all.css'
import 'slick-carousel/slick/slick'
import 'moment/moment'
import 'jquery/dist/jquery'
import 'jquery-ui/ui/jquery-1-7'
import Notifications from 'vue-notification'
import velocity from 'velocity-animate'
import vue_jquery from 'vue-jquery'
// import '@fortawesome/fontawesome-free/css/all.css'
// import '@fortawesome/fontawesome-free/js/all.js'

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(Notifications, {velocity});
Vue.use(vue_jquery);
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

