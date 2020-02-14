<template>
    <v-app class="app">
        <Toolbar/>
        <v-content>
            <v-fade-transition mode="out-in">
                <router-view/>
            </v-fade-transition>
        </v-content>
    </v-app>
</template>

<script lang="ts">
    import Vue from 'vue';
    import HelloWorld from './components/HelloWorld.vue';
    import Toolbar from '@/components/Toolbar.vue';

    export default Vue.extend({
        name: 'App',

        components: {
            Toolbar,
            HelloWorld,
        },

        data: () => ({
            //
        }),
    });
</script>

<style>
    .app {
        font-family: "Roboto", monospace;
    }
</style>
