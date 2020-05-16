import Vue from 'vue';
import VueRouter from 'vue-router';
import Component from 'vue-class-component';

Vue.use(VueRouter);

Component.registerHooks([
    'beforeRouteEnter',
    'beforeRouteUpdate',
    'beforeRouteLeave',
]);

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "contacts_page" */ '../views/contracts/AddContractPage.vue'),
    },
    {
        path: '/contracts',
        name: 'contracts',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "contracts_page" */ '../views/contracts/Contracts.vue'),
    },
    {
        path: '/contracts/add',
        name: 'contract-add',
        component: () => import(/* webpackChunkName: "contract_add_page" */ '../views/contracts/AddContractPage.vue'),
    },
    {
        path: '/contract/:id',
        name: 'contract',
        component: () => import(/* webpackChunkName: "contract_page" */ '../views/contracts/ContractPage.vue'),
    },
    {
        path: '/objects/new',
        name: 'objects-new',
        component: () => import(/* webpackChunkName: "object_new_page" */ '../views/contracts/AddObjectPage.vue'),
    },
    {
        path: '/objects/new/edit',
        name: 'objects-new-edit',
        component: () => import(/* webpackChunkName: "object_new_edit_page" */ '../views/contracts/AddObjectPage.vue'),
    },
    {
        path: '/objects/edit/:id',
        name: 'objects-edit',
        component: () => import(/* webpackChunkName: "object_edit_page" */ '../views/contracts/EditObjectPage.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
