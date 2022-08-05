import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from "@/views/Dashboard";

const routes = [
  {
    path: '/',
    name: 'home',
    component: Dashboard
  },
  {
    path: '/monedas',
    name: 'Monedas',
    component: () => import('../views/Monedas.vue')
  },
  {
    path: '/alertas',
    name: 'Alertas',
    component: () => import('../views/Alertas.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
