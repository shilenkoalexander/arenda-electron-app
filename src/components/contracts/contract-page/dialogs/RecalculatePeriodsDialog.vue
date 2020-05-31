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
                <v-container fluid class="pa-0">
                    <v-row>
                        <v-col class="py-0 pl-3" cols="6">
                            Перерасчет
                        </v-col>
                        <v-col class="pa-0 text-right" cols="1" offset="5">
                            <v-btn icon color="white" @click="close">
                                <v-icon>
                                    mdi-close
                                </v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-title>

            <v-card-text class="px-2 pb-1">
                <v-container fluid>
                    <v-row justify="center">
                        <v-col cols="10" class="pa-0">
                            <v-row justify="center">
                                <v-col class="title font-weight-regular pa-0 text-center" cols="6" offset="3">
                                    Дополнительные соглашения
                                </v-col>
                                <v-col cols="3" class="pa-0 text-right">
                                    <v-btn color="primary" text @click="onAddExtensionClicked">
                                        <v-icon class="mr-2">
                                            mdi-plus
                                        </v-icon>
                                        Добавить
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row justify="center">
                                <v-col cols="12">
                                    <ContractExtensionsList
                                            :items="contractExtensions"
                                            height="25vh"
                                            editable
                                            @edit="editExtension"
                                            @remove="removeExtension"
                                    />
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-divider class="mt-2 mb-2"/>
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
                        <v-col cols="8" class="pt-0">
                            <FinanceList :items="financePeriods" height="30vh"/>
                        </v-col>
                    </v-row>
                    <v-row justify="end">
                        <v-col cols="2" class="pb-0">
                            <v-btn
                                    :disabled="financePeriods.length < 1"
                                    color="error"
                                    block
                                    text
                                    @click="onSaveClicked"
                            >
                                Сохранить
                            </v-btn>
                        </v-col>
                        <v-col cols="2" class="pb-0">
                            <v-btn color="primary" text block @click="close">
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
    import { calculateFinancePeriods } from '@/model/service/accruals-service';
    import Period from '@/model/utils/period';
    import FinanceList from '@/components/contracts/contract-page/finance/FinanceList.vue';
    import { FinancePeriod } from '@/model/types/finance-types';
    import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
    import ContractExtensionsList from '@/components/contracts/contract-page/finance/ContractExtensionsList.vue';
    import { EditableContractExtension, FullContractExtension } from '@/model/types/contract-types';
    import AddContractExtensionDialog
        from '@/components/contracts/contract-page/dialogs/AddContractExtensionDialog.vue';
    import { saveRecalculatedData } from '@/model/service/finance-service';

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
    contractExtensions: EditableContractExtension[] = [];
    deletedExtensionsId: number[] = [];

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

    onSaveContractExtension(contractExtension: EditableContractExtension) {
        const foundExtension = this.contractExtensions.find((value) => value.id === contractExtension.id);

        if (foundExtension) {
            foundExtension.payment = contractExtension.payment;
            foundExtension.paymentActualityDate = contractExtension.paymentActualityDate;
            foundExtension.startDate = contractExtension.startDate;
            foundExtension.endDate = contractExtension.endDate;
            foundExtension.conclusionDate = contractExtension.conclusionDate;
        }

        if (!foundExtension) {
            this.contractExtensions.push(contractExtension);
        }

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
            this.contractId!,
            this.calculatingStartDate!,
            this.contractValidity!,
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
            saveRecalculatedData(
                this.contractId!,
                this.financePeriods,
                this.contractExtensions,
                this.deletedExtensionsId,
            );
            this.$emit('update');
            this.close();
        }
    }

    editExtension(id: number) {
        this.$refs.addContractExtensionDialog.open(
            this.contractId!,
            this.calculatingStartDate!,
            this.contractValidity!,
            this.contractExtensions,
            id,
        );
    }

    removeExtension(id: number) {
        this.deletedExtensionsId.push(id);
        this.contractExtensions = this.contractExtensions.filter((value) => value.id !== id);
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
        this.contractExtensions = currentExtensions.map((value) => (
            {
                ...value,
                isNew: false,
                isDeleted: false,
            }
        ));

        const calculatingStartDateString = formatDateToMonthString(this.calculatingStartDate);
        const currentPeriodString = Period.currentCalculativePeriod().toDefaultFormat();

        this.startMinDate = calculatingStartDateString;
        this.startMaxDate = currentPeriodString;
        this.endMinDate = calculatingStartDateString;
        this.endMaxDate = currentPeriodString;

        this.dialog = true;
    }
}
</script>

<style scoped>

</style>
