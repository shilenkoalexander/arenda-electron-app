import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "contacts_page" */ '../views/contracts/AddContract.vue'),
  },
  {
    path: '/contacts',
    name: 'contacts',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "contacts_page" */ '../views/contracts/Contracts.vue'),
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import(/* webpackChunkName: "contacts_page" */ '../views/contracts/ContractPage.vue'),
  },
  {
    path: '/object/add',
    name: 'object-add',
    component: () => import(/* webpackChunkName: "object_add_page" */ '../views/contracts/AddObject.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
