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
        component: () => import(/* webpackChunkName: "contacts_page" */ '../views/Home.vue'),
    },
    {
        path: '/contracts/add',
        name: 'contract-add',
        component: () => import(/* webpackChunkName: "contract_add_page" */ '../views/AddContractPage.vue'),
    },
    {
        path: '/contract/:id',
        name: 'contract',
        component: () => import(/* webpackChunkName: "contract_page" */ '../views/ContractPage.vue'),
    },
    {
        path: '/objects/new',
        name: 'objects-new',
        component: () => import(/* webpackChunkName: "object_new_page" */ '../views/AddObjectPage.vue'),
    },
    {
        path: '/objects/new/edit',
        name: 'objects-new-edit',
        component: () => import(/* webpackChunkName: "object_new_edit_page" */ '../views/AddObjectPage.vue'),
    },
    {
        path: '/objects/edit/:id',
        name: 'objects-edit',
        component: () => import(/* webpackChunkName: "object_edit_page" */ '../views/EditObjectPage.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
