import { createApp } from 'vue'

import App from './App.vue'
import 'bootstrap-icons/font/bootstrap-icons.css'
import'bootstrap/dist/css/bootstrap.min.css'
import'bootstrap/dist/js/bootstrap.bundle.min.js'

import 'bootstrap/dist/js/bootstrap.bundle.js'
import 'bootstrap/dist/js/bootstrap.js'
import { router } from './routers/router'
createApp(App).use(router).mount('#app')