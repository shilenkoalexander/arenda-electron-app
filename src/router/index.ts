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
        path: '/contract/:id',
        name: 'contract',
        component: () => import(/* webpackChunkName: "contract_page" */ '../views/ContractPage.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
