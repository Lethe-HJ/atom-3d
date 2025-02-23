import { createRouter, createWebHistory } from 'vue-router'
import InstanceMesh from '../views/InstanceMesh.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'InstanceMesh',
      component: InstanceMesh,
    },
    {
      path: '/LiFePO4',
      name: 'LiFePO4',
      component: () => import('../views/LiFePO4.vue'),
    },
  ],
})

export default router
