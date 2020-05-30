<template>
    <v-app class="app">
        <v-content class="back">
            <v-fade-transition mode="out-in">
                <router-view :key="$route.path"/>
            </v-fade-transition>
        </v-content>
    </v-app>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        name: 'App',

        components: {
        },

        data: () => ({

        }),
    });
</script>

<style lang="scss">
    .app {
        font-family: "Roboto", monospace;
    }

    html {
        overflow-y: auto!important;
    }

    .v-menu__content {
        .v-list-item__title {
            font-size: 1rem !important;
            font-weight: normal !important;
        }
    }

    .back {
        background-color: #F9F9F9;
    }
</style>
