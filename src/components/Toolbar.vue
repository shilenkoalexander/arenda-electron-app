<template>
    <v-app-bar
            app
            color="primary"
    >
        <div>
            <v-btn
                    v-for="(button, index) in buttons"
                    :key="index"
                    :to="button.action"
                    text
                    tile
                    color="secondary"
                    class="ml-3 white--text"
            >
                {{ button.text }}
            </v-btn>
        </div>
        <v-spacer/>
        <v-btn icon color="secondary" class="mr-2" small>
            <v-icon size="25px">
                mdi-settings
            </v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { MenuItem } from '@/types/common';

    @Component
export default class Toolbar extends Vue {
    public buttons: MenuItem[] = [
        {
            text: 'Договоры',
            action: '/contracts',
        },
        {
            text: 'Договор',
            action: '/contract',
        },
        {
            text: 'DEV',
            action: '/',
        },
    ];
}
</script>

<style scoped>
</style>
