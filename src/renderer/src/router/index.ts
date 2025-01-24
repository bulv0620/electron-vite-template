import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '@renderer/views/HomeView.vue'
import AboutView from '@renderer/views/AboutView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
