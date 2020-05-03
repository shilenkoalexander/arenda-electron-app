<template>
    <v-container fluid :class="{'pa-0': noGutters}">
        <v-row justify="center" :class="{'pa-0': noGutters}">
            <v-col :xs="xs" :lg="lg" :xl="xl">
                <v-card
                    :class="{
                        'pa-0': noGutters,
                        'elevation-0' : noElevation || transparent,
                        'transparent': transparent
                    }"
                >
                    <slot></slot>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class CenteredCard extends Vue {
        @Prop({
            type: String,
            default: '12',
        })
        xs!: string;

        @Prop({
            type: String,
            default: null,
        })
        lg!: string | null;

        @Prop({
            type: String,
            default: null,
        })
        xl!: string | null;

        @Prop({
            type: Boolean,
            default: false,
        })
        noGutters!: boolean;

        @Prop({
            type: Boolean,
            default: false,
        })
        noElevation!: boolean;

        @Prop({
            type: Boolean,
            default: false,
        })
        transparent!: boolean;
    }
</script>

<style scoped>
    .transparent {
        background-color: transparent;
    }
</style>
