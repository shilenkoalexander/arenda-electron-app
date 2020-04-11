<template>
    <v-text-field
            v-model="localValue"
            v-bind="$attrs"
            :label="label"
            outlined
            dense
            validate-on-blur
    />
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

    @Component
    export default class EditableTextField extends Vue {
        @Prop({
            type: String,
            required: true,
        })
        label!: string;

        @Prop({
            type: String,
            required: true,
        })
        value!: string;

        localValue = '';

        @Watch('value', { immediate: true })
        onValueChanged() {
            this.localValue = this.value;
        }

        @Watch('localValue')
        onLocalValueChanged() {
            this.$emit('input', this.localValue);
        }
    }
</script>

<style scoped>

</style>
