<template>
    <v-container fluid class="pa-0">
        <v-row class="pa-0">
            <v-col cols="4" class="pb-0 pt-1">
                <p class="mb-0 grey--text">{{text}}:</p>
            </v-col>
            <v-col class="pb-0 pt-1">
                <p class="mb-0">{{value}}</p>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class ContractInfoItem extends Vue {
        @Prop({
            type: String,
            required: true,
        })
        text!: string;

        @Prop({
            type: String,
            required: true,
        })
        value!: string;
    }
</script>

<style scoped>

</style>
