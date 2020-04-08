<template>
    <v-text-field
            color="primary"
            readonly
            outlined
            hide-details
            dense
            :label="label"
            :value="value"
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class Label extends Vue {
        @Prop({
            type: String,
            required: true,
        })
        label!: string;

        @Prop({
            type: String,
            default: ' ',
        })
        value!: string;
    }
</script>

<style scoped>

</style>
