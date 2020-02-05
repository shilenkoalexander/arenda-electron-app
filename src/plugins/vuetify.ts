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
                primary: '#150734',
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
