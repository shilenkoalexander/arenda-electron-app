<template>
    <p class="header mb-0 title pl-2 pb-1">
        {{value}}
    </p>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class Header extends Vue {
        @Prop({
            type: String,
            required: true,
        })
        value!: string;
    }
</script>

<style scoped>
    .header {
        color: #686868;
        border-bottom: 1px solid #414141;
        font-size: 16px;
        margin-bottom: 3px!important;
    }
</style>
