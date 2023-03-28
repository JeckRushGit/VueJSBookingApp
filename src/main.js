import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios";
import store from "@/store/store";
import session_expired_handler from "@/utilities/session_expired_handler";
import 'bootstrap/dist/css/bootstrap.css'
axios.defaults.baseURL = 'http://localhost:8082/demo1_war_exploded/'
axios.defaults.withCredentials = true
import VueClickAway from "vue3-click-away";

createApp(App).use(router).use(store).use(session_expired_handler).use(VueClickAway).mount('#app')

import 'bootstrap/dist/js/bootstrap.js'