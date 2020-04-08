import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { ru } from 'vuetify/src/locale';

Vue.use(Vuetify);

export default new Vuetify({
    customProperties: true,
    icons: {
        iconfont: 'mdi',
    },
    theme: {
        themes: {
            light: {
                primary: '#0F4C81',
                secondary: '#658DC6',
            },
        },
    },
    options: {
        customProperties: true,
    },
    lang: {
        locales: { ru },
        current: 'ru',
    },
});
