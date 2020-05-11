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
            <CenteredCard xl="10" transparent class="back">
                <v-tab-item>
                    <v-container fluid v-if="contractId">
                        <v-row justify="center">
                            <v-col cols="7">
                                <ContractInfo :main-info="contractMainInfo" class="fill-height"/>
                            </v-col>
                            <v-col cols="5">
                                <ContractInfoActionsCard
                                    class="fill-height"
                                    @recalculate="onRecalculate"
                                />
                            </v-col>
                        </v-row>
                        <v-row justify="center">
                            <v-col cols="7">
                                <FinanceCard
                                    class="fill-height"
                                    :contract-id="contractId"
                                    :finance-periods="financePeriods"
                                    :calculation-start-date="contractMainInfo.calculationStartDate"
                                    :validity="contractMainInfo.validity"
                                    :contract-extensions="contractExtensions"
                                    @update-periods="updateFinancePeriods"
                                    @update-extensions="updateContractExtensions"
                                />
                            </v-col>
                            <v-col cols="5">
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
            </CenteredCard>
        </v-tabs-items>
        <RecalculatePeriodsDialog ref="recalculatePeriodDialog" @update="updateAll"/>
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
import { getContractMainPageInfo, getFullContractExtensions } from '@/backend/repository/contract-repository';
import { ContractPageMainInfo, FullContractExtension } from '@/types/contracts';
import { FinancePeriod } from '@/types/finance';
import { getAllPeriods } from '@/backend/repository/finance-repository';
import CenteredCard from '@/components/CenteredCard.vue';

@Component({
    components: {
        CenteredCard,
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
    contractExtensions: FullContractExtension[] = [];

    $refs!: {
        recalculatePeriodDialog: RecalculatePeriodsDialog;
    };

    created() {
        this.contractId = Number.parseInt(this.$route.params.id, 10);
        this.contractMainInfo = getContractMainPageInfo(this.contractId);
        this.updateFinancePeriods();
    }

    onRecalculate() {
        if (this.contractMainInfo && this.contractId) {
            this.$refs.recalculatePeriodDialog.open(
                this.contractId,
                this.contractMainInfo.calculationStartDate,
                this.contractMainInfo.validity,
                this.contractExtensions,
            );
        }
    }

    updateFinancePeriods() {
        this.financePeriods = getAllPeriods(this.contractId!);
    }

    updateContractExtensions() {
        this.contractExtensions = getFullContractExtensions(this.contractId!);
    }

    updateAll() {
        this.updateFinancePeriods();
        this.updateContractExtensions();
    }

}
</script>

<style scoped lang="scss">

</style>
