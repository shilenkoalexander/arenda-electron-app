<template>
    <v-container fluid>
        <v-row justify="center">
            <v-col :cols="cols">
                <v-card>
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
            default: "10",
        })
        cols!: string;
    }
</script>

<style scoped>

</style>
