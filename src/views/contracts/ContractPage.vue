<template>
    <div>
        <v-tabs
                v-model="tab"
                background-color="primary lighten-1"
                dark
        >
            <v-tab>Информация о договоре</v-tab>
            <v-tab>Информация об объектах</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
            <v-tab-item>
                <v-container fluid class="back" v-if="contractId">
                    <v-row justify="center">
                        <v-col cols="6">
                            <ContractInfo :main-info="contractMainInfo" class="fill-height"/>
                        </v-col>
                        <v-col cols="4">
                            <ContractInfoActionsCard class="fill-height"/>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="6">
                            <FinancialCard
                                    class="fill-height"
                                    :contract-id="1"
                            />
                        </v-col>
                        <v-col cols="4">
                            <ContractStatusCard class="fill-height"/>
                        </v-col>
                    </v-row>
                </v-container>
            </v-tab-item>
            <v-tab-item>
                <v-container fluid class="back">
                    <v-row>
                        <v-col cols="6" v-for="i in 3" :key="i">
                            <ObjectDetailsCard/>
                        </v-col>
                    </v-row>
                </v-container>
            </v-tab-item>
        </v-tabs-items>
        <RecalculatePeriodsDialog :calculating-start-date="contractMainInfo.calculationStartDate"/>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import ContractInfo from '@/components/contracts/contract-page/ContractInfo.vue';
    import ContractStatusCard from '@/components/contracts/contract-page/ContractStatusCard.vue';
    import ContractInfoActionsCard from '@/components/contracts/contract-page/ContractInfoActionsCard.vue';
    import FinancialCard from '@/components/contracts/contract-page/FinancialCard.vue';
    import ObjectDetailsCard from '@/components/contracts/contract-page/ObjectDetailsCard.vue';
    import RecalculatePeriodsDialog from '@/components/contracts/contract-page/RecalculatePeriodsDialog.vue';
    import { getContractMainPageInfo } from '@/backend/repository/contract-repository';
    import { ContractPageMainInfo } from '@/types/contracts';

    @Component({
        components: {
            RecalculatePeriodsDialog,
            ContractInfo,
            ContractStatusCard,
            ContractInfoActionsCard,
            FinancialCard,
            ObjectDetailsCard,
        },
    })
    export default class ContractPage extends Vue {
        tab = null;
        contractId: number | null = null;
        contractMainInfo: ContractPageMainInfo | null = null;

        created() {
            this.contractId = Number.parseInt(this.$route.params.id, 10);
            this.contractMainInfo = getContractMainPageInfo(this.contractId);
            // recalculate('2020-01', '2020-04', 1, false);
            // const payment = calculateAccruals(Period.ofMonthYear(8, 2020), 1);
            // const accrualForCalculations = getAccrualPerFullMonthByPeriod(Period.ofMonthYear(8, 2020), 2);
            // console.log('accrual =', accrualForCalculations.toFixed(2));
        }
    }
</script>

<style scoped lang="scss">

</style>
