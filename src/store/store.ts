import store from 'vuex';
import Vue from 'vue';
import AddContractModule from './add-contract-module';

Vue.use(store);

export default new store.Store({
    state: {},
    modules: {
        addContract: AddContractModule,
    },
});
