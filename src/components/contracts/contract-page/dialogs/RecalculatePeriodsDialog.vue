<template>
    <v-dialog
            v-model="dialog"
            width="60%"
    >
        <v-card>
            <v-card-title
                    class="headline primary white--text py-3"
                    primary-title
            >
                Перерасчет
            </v-card-title>

            <v-card-text>
                <v-container fluid>
                    <v-row justify="space-around">
                        <v-col cols="3" align-self="center">
                            <v-row>
                                <DatePickerMenu
                                        v-model="startMonth"
                                        :min-date="startMinDate"
                                        :max-date="startMaxDate"
                                        label="Период с"
                                        without-days
                                />
                            </v-row>
                            <v-row>
                                <DatePickerMenu
                                        v-model="endMonth"
                                        :min-date="endMinDate"
                                        :max-date="endMaxDate"
                                        label="Период по"
                                        without-days
                                />
                            </v-row>
                            <v-row>
                                <v-btn
                                        block
                                        color="primary"
                                        :disabled="!startMonth || !endMonth"
                                        @click="onRecalculateClicked"
                                >
                                    Пересчитать
                                </v-btn>
                            </v-row>
                        </v-col>
                        <v-col cols="8" class="pa-0">
                            <v-row justify="center">
                                <v-col class="title font-weight-regular py-0 pr-0 pl-10" cols="9">
                                    Дополнительные соглашения
                                </v-col>
                                <v-col cols="3" class="pa-0 text-center">
                                    <v-btn color="primary" icon @click="onAddExtensionClicked">
                                        <v-icon>
                                            mdi-plus
                                        </v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row justify="center" class="mt-3">
                                <v-col cols="12">
                                    <ContractExtensionsList :items="contractExtensions" height="25vh"/>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-divider class="mt-2"/>
                    <v-row justify="center">
                        <v-col cols="8" class="pt-0">
                            <FinanceList :items="financePeriods" height="30vh"/>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="3">
                            <v-btn
                                    :disabled="financePeriods.length < 1"
                                    color="error"
                                    block
                                    @click="onSaveClicked"
                            >
                                Сохранить
                            </v-btn>
                        </v-col>
                        <v-col cols="3">
                            <v-btn color="primary" block @click="close">
                                Закрыть
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <ConfirmDialog ref="confirmDialog" @confirm="saveRecalculatedPeriods"/>
            <AddContractExtensionDialog backdating ref="addContractExtensionDialog" @save="onSaveContractExtension"/>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import DatePickerMenu from '@/components/DatePickerMenu.vue';
    import { formatDateToMonthString } from '@/utils/date-utils';
    import { calculateFinancePeriods } from '@/backend/service/accruals-service';
    import Period from '@/backend/utils/period';
    import FinanceList from '@/components/contracts/contract-page/finance/FinanceList.vue';
    import { FinancePeriod } from '@/types/finance';
    import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
    import { replaceFinancePeriods } from '@/backend/repository/finance-repository';
    import ContractExtensionsList from '@/components/contracts/contract-page/finance/ContractExtensionsList.vue';
    import { FullContractExtension } from '@/types/contracts';
    import AddContractExtensionDialog
        from '@/components/contracts/contract-page/dialogs/AddContractExtensionDialog.vue';

    // todo перерасчет нужен только для проверки возможного доп соглашения и задним числом тоже
    // несколько доп соглашений тоже должно быть
    // а еще проверить как там поживает replace в базе.
    @Component({
        components: { AddContractExtensionDialog, ContractExtensionsList, ConfirmDialog, FinanceList, DatePickerMenu },
    })
    export default class RecalculatePeriodsDialog extends Vue {
        dialog = false;

        calculatingStartDate: Date | null = null;
        contractValidity: Date | null = null;
        contractId: number | null = null;

        startMonth = '';
        endMonth = '';

        startMinDate = '';
        startMaxDate = '';
        endMinDate = '';
        endMaxDate = '';

        financePeriods: FinancePeriod[] = [];
        contractExtensions: FullContractExtension[] = [];

        $refs!: {
            confirmDialog: ConfirmDialog;
            addContractExtensionDialog: AddContractExtensionDialog;
        };

        @Watch('startMonth')
        onStartMonthChanged() {
            this.endMinDate = this.startMonth;
        }

        @Watch('endMonth')
        onEndMonthChanged() {
            this.startMaxDate = this.endMonth;
        }

        onRecalculateClicked() {
            if (this.contractId) {
                this.financePeriods = calculateFinancePeriods(
                    Period.ofString(this.startMonth),
                    Period.ofString(this.endMonth),
                    this.contractId!,
                    this.contractExtensions,
                ).sort((a, b) => b.period.getDate().getTime() - a.period.getDate().getTime());
            }
        }

        onSaveContractExtension(contractExtension: FullContractExtension) {
            this.contractExtensions.push(contractExtension);
            this.contractExtensions.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
        }

        onSaveClicked() {
            this.$refs.confirmDialog.open(
                'Вы действительно хотите сохранить данные? ' +
                'Старые расчеты по этим периодам будут удалены.',
            );
        }

        onAddExtensionClicked() {
            this.$refs.addContractExtensionDialog.open(
                this.contractId,
                this.calculatingStartDate,
                this.contractValidity,
                this.contractExtensions,
            );
        }

        close() {
            this.dialog = false;
            this.financePeriods = [];
            this.startMonth = '';
            this.endMonth = '';
        }

        saveRecalculatedPeriods() {
            if (this.contractId) {
                replaceFinancePeriods(this.contractId!, this.financePeriods);
                this.$emit('update');
                this.close();
            }
        }


        // todo: ограничить максимальную дату с учетом индексов инфляции (их наличия)
        open(
            contractId: number,
            calculatingStartDate: Date,
            contractValidity: Date,
            currentExtensions: FullContractExtension[],
        ) {
            this.contractId = contractId;
            this.calculatingStartDate = calculatingStartDate;
            this.contractValidity = contractValidity;
            this.contractExtensions = [...currentExtensions];

            this.startMinDate = formatDateToMonthString(this.calculatingStartDate);
            this.startMaxDate = Period.currentPeriod().toDefaultFormat();
            this.endMinDate = formatDateToMonthString(this.calculatingStartDate);
            this.endMaxDate = Period.currentPeriod().toDefaultFormat();
            // this.startMaxDate = formatDateToMonthString(new Date(2020, 7, 1));
            // this.endMaxDate = formatDateToMonthString(new Date(2020, 7, 1));

            this.dialog = true;
        }
    }
</script>

<style scoped>

</style>
