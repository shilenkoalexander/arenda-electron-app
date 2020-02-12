<template>
    <v-row>
        <v-col cols="4" class="pb-0">
            <p class="mb-0 grey--text">{{text}}</p>
        </v-col>
        <v-col class="pb-0">
            <p class="mb-0">{{value}}</p>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ContractDetailsItem extends Vue {
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
