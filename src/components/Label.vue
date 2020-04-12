<template>
    <v-text-field
            color="primary"
            readonly
            outlined
            hide-details
            dense
            :label="label"
            :value="value">
        <template v-slot:append v-if="deletable">
            <v-icon color="error" @click="$emit('delete')">
                mdi-close
            </v-icon>
        </template>
    </v-text-field>
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

        @Prop({
            type: Boolean,
            default: false,
        })
        deletable!: boolean;
    }
</script>

<style scoped>

</style>
