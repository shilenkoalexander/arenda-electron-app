<template>
    <ContractInfo/>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import ContractInfo from '@/components/contracts/contract-page/ContractInfo.vue';

    @Component({
        components: {
            ContractInfo,
        },
    })
    export default class ContractPage extends Vue {

    }
</script>

<style scoped>

</style>
