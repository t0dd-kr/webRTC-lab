import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [{
    path: '/',
    component: () => import('@/pages/Index.vue')
  }, {
    path: '/room/:id',
    component: () => import('@/pages/Room.vue')
  }]
})

export default router