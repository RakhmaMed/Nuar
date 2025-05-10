import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Board from '../components/Board.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/board/:roomId',
      name: 'board',
      component: Board,
      props: true
    },
    // Add a catch-all route to redirect to home
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
});

export default router; 