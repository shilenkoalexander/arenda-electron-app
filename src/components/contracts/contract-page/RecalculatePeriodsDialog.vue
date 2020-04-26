<template>
    <v-dialog
            v-model="dialog"
            width="50%"
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
                    <v-row justify="center">
                        <v-col cols="3">
                            <DatePickerMenu
                                    v-model="startMonth"
                                    :min-date="startMinDate"
                                    :max-date="startMaxDate"
                                    label="Период с"
                                    without-days
                            />
                        </v-col>
                        <v-col cols="3">
                            <DatePickerMenu
                                    v-model="endMonth"
                                    :min-date="endMinDate"
                                    :max-date="endMaxDate"
                                    label="Период по"
                                    without-days
                            />
                        </v-col>
                        <v-col cols="3">
                            <v-btn
                                    block
                                    color="primary"
                                    :disabled="!startMonth || !endMonth"
                                    @click="onRecalculateClicked"
                            >
                                Пересчитать
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row class="finance-list-row">
                        <v-col v-if="financePeriods.length > 0">
                            <FinancialList :items="financePeriods"/>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="3">
                            <v-btn
                                    :disabled="financePeriods.length < 1"
                                    color="error"
                                    block
                            >
                                Сохранить
                            </v-btn>
                        </v-col>
                        <v-col cols="3">
                            <v-btn color="primary" block @click="onCloseClicked">
                                Закрыть
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import DatePickerMenu from '@/components/DatePickerMenu.vue';
    import { formatDateToMonthString } from '@/utils/date-utils';
    import { calculateFinancePeriods } from '@/backend/service/finance-service';
    import Period from '@/backend/utils/period';
    import FinancialList from '@/components/contracts/contract-page/FinancialList.vue';
    import { FinancePeriod } from '@/types/finance';

    @Component({
        components: { FinancialList, DatePickerMenu },
    })
    export default class RecalculatePeriodsDialog extends Vue {
        dialog = false;

        calculatingStartDate: Date | null = null;
        contractId: number | null = null;

        startMonth = '';
        endMonth = '';

        startMinDate = '';
        // startMaxDate = formatDateToMonthString(subMonths(new Date(), 1));
        startMaxDate = '';
        endMinDate = '';
        endMaxDate = '';

        // endMaxDate = formatDateToMonthString(subMonths(new Date(), 1));

        financePeriods: FinancePeriod[] = [];

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
                    this.contractId,
                );
            }
        }

        onCloseClicked() {
            this.dialog = false;
            this.financePeriods = [];
            this.startMonth = '';
            this.endMonth = '';
        }

        open(contractId: number, calculatingStartDate: Date) {
            this.contractId = contractId;
            this.calculatingStartDate = calculatingStartDate;

            this.startMinDate = formatDateToMonthString(this.calculatingStartDate);
            this.endMinDate = formatDateToMonthString(this.calculatingStartDate);
            // startMaxDate = formatDateToMonthString(subMonths(new Date(), 1));
            this.startMaxDate = formatDateToMonthString(new Date(2020, 8, 1));
            this.endMaxDate = formatDateToMonthString(new Date(2020, 8, 1));
            // endMaxDate = formatDateToMonthString(subMonths(new Date(), 1));

            this.dialog = true;
        }
    }
</script>

<style scoped>
    .finance-list-row {
        height: 40vh;
        overflow: auto;
    }
</style>
