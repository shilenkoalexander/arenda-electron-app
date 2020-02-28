<template>
    <v-container fluid>
        <v-row>
            <v-col cols="7">
                <ContractInfo class="fill-height"/>
            </v-col>
            <v-col cols="5">
                <ContractStatusCard class="fill-height"/>
            </v-col>
            <!--<v-col>
                <ContractInfoActionsCard class="fill-height"/>
            </v-col>-->
        </v-row>
        <v-row>
            <v-col cols="7">
                <FinancialCard class="fill-height"/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import ContractInfo from '@/components/contracts/contract-page/ContractInfo.vue';
    import ContractStatusCard from '@/components/contracts/contract-page/ContractStatusCard.vue';
    import ContractInfoActionsCard from '@/components/contracts/contract-page/ContractInfoActionsCard.vue';
    import FinancialCard from '@/components/contracts/contract-page/FinancialCard.vue';

    @Component({
    components: {
        ContractInfo,
        ContractStatusCard,
        ContractInfoActionsCard,
        FinancialCard,
    },
})
export default class ContractPage extends Vue {

}
</script>

<style scoped>

</style>
