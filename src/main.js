import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'

import SmartTable from 'vuejs-smart-table'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faInfo, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'

library.add(faInfo, faPenToSquare, faTrashCan)

const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.use(CoreuiVue)
app.use(SmartTable)
app.provide('icons', icons)
app.component('CIcon', CIcon)

app.mount('#app')
