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
        path: '/contracts',
        name: 'contracts',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "contacts_page" */ '../views/contracts/Contracts.vue'),
    },
    {
        path: '/contract/:id',
        name: 'contract',
        component: () => import(/* webpackChunkName: "contacts_page" */ '../views/contracts/ContractPage.vue'),
    },
    {
        path: '/object/add',
        name: 'object-add',
        component: () => import(/* webpackChunkName: "object_add_page" */ '../views/contracts/AddEditObject.vue'),
    },
    {
        path: '/object/edit',
        name: 'object-edit',
        component: () => import(/* webpackChunkName: "object_add_page" */ '../views/contracts/AddEditObject.vue'),
    },
    {
        path: '/contract/add',
        name: 'contract-add',
        component: () => import(/* webpackChunkName: "contacts_page" */ '../views/contracts/AddContract.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
