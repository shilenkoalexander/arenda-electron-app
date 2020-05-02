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
                            <ContractInfoActionsCard
                                class="fill-height"
                                @recalculate="onRecalculate"
                            />
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="6">
                            <FinanceCard
                                class="fill-height"
                                :contract-id="contractId"
                                :finance-periods="financePeriods"
                                :calculation-start-date="contractMainInfo.calculationStartDate"
                                :validity="contractMainInfo.validity"
                                @update="updateFinancePeriods"
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
        <RecalculatePeriodsDialog ref="recalculatePeriodDialog" @update="updateFinancePeriods"/>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import ContractInfo from '@/components/contracts/contract-page/ContractInfo.vue';
    import ContractStatusCard from '@/components/contracts/contract-page/ContractStatusCard.vue';
    import ContractInfoActionsCard from '@/components/contracts/contract-page/ContractInfoActionsCard.vue';
    import FinanceCard from '@/components/contracts/contract-page/finance/FinanceCard.vue';
    import ObjectDetailsCard from '@/components/contracts/contract-page/ObjectDetailsCard.vue';
    import RecalculatePeriodsDialog from '@/components/contracts/contract-page/dialogs/RecalculatePeriodsDialog.vue';
    import { getContractMainPageInfo } from '@/backend/repository/contract-repository';
    import { ContractPageMainInfo } from '@/types/contracts';
    import { FinancePeriod } from '@/types/finance';
    import { getAllPeriods } from '@/backend/repository/finance-repository';

    @Component({
        components: {
            RecalculatePeriodsDialog,
            ContractInfo,
            ContractStatusCard,
            ContractInfoActionsCard,
            FinanceCard,
            ObjectDetailsCard,
        },
    })
    export default class ContractPage extends Vue {
        tab = null;
        contractId: number | null = null;
        contractMainInfo: ContractPageMainInfo | null = null;
        financePeriods: FinancePeriod[] = [];

        $refs!: {
            recalculatePeriodDialog: RecalculatePeriodsDialog;
        };

        created() {
            this.contractId = Number.parseInt(this.$route.params.id, 10);
            this.contractMainInfo = getContractMainPageInfo(this.contractId);
            this.updateFinancePeriods();
        }

        onRecalculate() {
            if (this.contractMainInfo) {
                this.$refs.recalculatePeriodDialog.open(this.contractId, this.contractMainInfo.calculationStartDate);
            }
        }

        updateFinancePeriods() {
            this.financePeriods = getAllPeriods(this.contractId!);
        }

    }
</script>

<style scoped lang="scss">

</style>
