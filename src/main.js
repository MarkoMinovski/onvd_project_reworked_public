import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { VueFire, VueFireAuth } from "vuefire";
import {firebaseAppInstance} from "./firebase.js";

const app = createApp(App)

app.use(VueFire, {
    firebaseApp: firebaseAppInstance,
    modules: [
        VueFireAuth(),
    ],
})


app.mount('#app')