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
                    <v-container fluid v-if="contractId" class="py-0">
                        <v-row>
                            <v-col class="py-0" cols="1">
                                <v-btn block text color="primary" @click="$router.back()">
                                    <v-icon class="mr-2">
                                        mdi-arrow-left
                                    </v-icon>
                                    Назад
                                </v-btn>
                            </v-col>
                        </v-row>
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
                    <!-- Заменить calculationStartDate на startDate -->
                    <ContractPageObjects
                            v-if="contractMainInfo"
                            class="back"
                            :contract-id="contractId"
                            :contract-start-date="contractMainInfo.calculationStartDate"
                            :contract-validity="contractMainInfo.validity"
                    />
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
    import { getContractMainPageInfo, getFullContractExtensions } from '@/model/repository/contract-repository';
    import { ContractPageMainInfo, FullContractExtension } from '@/model/types/contract-types';
    import { FinancePeriod } from '@/model/types/finance-types';
    import { getAllPeriods } from '@/model/repository/finance-repository';
    import CenteredCard from '@/components/CenteredCard.vue';
    import ContractPageObjects from '@/components/contracts/contract-page/ContractPageObjects.vue';
    import { Route } from 'vue-router';

    @Component({
        components: {
            ContractPageObjects,
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

        beforeRouteEnter(to: Route, from: Route, next: any) {
            const contractId = Number.parseInt(to.params.id, 10);
            const contractMainInfo = getContractMainPageInfo(contractId)
                .orElseThrowWithMessage(`Отсутствует информация о договоре с id = ${contractId}`);
            next((vm: ContractPage) => {
               vm.contractId = contractId;
               vm.contractMainInfo = contractMainInfo;
               vm.updateAll();
            });
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
