import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'

import SmartTable from 'vuejs-smart-table'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(CoreuiVue)
app.use(SmartTable)
app.provide('icons', icons)
app.component('CIcon', CIcon)

app.mount('#app')
