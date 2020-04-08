<template>
    <div class="pa-0 info-block">
        <slot></slot>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class InfoBlock extends Vue {

    }
</script>

<style scoped>
    .info-block {
        width: 100%;
        border-radius: 5px;
    }
</style>
