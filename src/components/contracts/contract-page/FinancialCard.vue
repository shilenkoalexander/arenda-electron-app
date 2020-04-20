<template>
    <v-card>
        <v-container fluid class="px-5" v-if="item">
            <v-row justify="space-between">
                <v-col cols="4">
                    <DatePickerMenu
                            v-if="!showAllPeriods"
                            v-model="month"
                            :allowed-dates="availablePeriods"
                            label="Период"
                            hide-details
                            outlined
                            without-days
                    />
                </v-col>
                <v-col cols="4" class="text-right">
                    <v-btn
                            v-if="!showAllPeriods"
                            block
                            color="primary lighten-1"
                            :disabled="showAllPeriods"
                            @click="showAllPeriods = true"
                    >
                        Показать все периоды
                    </v-btn>
                    <v-btn
                            v-else
                            block
                            color="primary lighten-1"
                            @click="showAllPeriods = false"
                    >
                        <v-icon>
                            mdi-arrow-left
                        </v-icon>
                        Вернуться
                    </v-btn>
                </v-col>
            </v-row>
            <v-expand-transition mode="out-in">
                <v-row v-if="showAllPeriods" key="financial-table">
                    <v-col cols="12">
                        <FinancialList :contract-id="contractId"/>
                    </v-col>
                </v-row>
                <div v-if="!showAllPeriods && item">
                    <v-row class="mt-5">
                        <v-col>
                            <Label label="Начисление" :value="item.accruals.toFixed(2)"/>
                        </v-col>
                        <v-col>
                            <Label label="Оплата" :value="item.payments.toFixed(2)"/>
                        </v-col>
                        <v-col>
                            <Label label="Корректировки" :value="item.adjustments.toFixed(2)"/>
                        </v-col>

                        <v-col>
                            <Label label="Задолженность" :value="item.debt.toFixed(2)"/>
                        </v-col>
                        <v-col>
                            <Label label="Пеня" value="DEV"/>
                        </v-col>
                    </v-row>
                </div>
            </v-expand-transition>
        </v-container>
        <v-container fluid v-else>
            <p>Записи отсутствуют</p>
        </v-container>
    </v-card>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import FinancialList from '@/components/contracts/contract-page/FinancialList.vue';
    import DatePickerMenu from '@/components/DatePickerMenu.vue';
    import Label from '@/components/Label.vue';
    import { FinancePeriod } from '@/types/finance';
    import {
        getAvailablePeriods,
        getFinancePeriod,
        getLastFinancePeriod,
    } from '@/backend/repository/finance-repository';
    import { formatDateStringToMonthString } from '@/utils/date-utils';
    import Period from '@/backend/utils/period';

    // todo: подумать как кэшировать данные в списке

    @Component({
        components: {
            Label,
            FinancialList,
            DatePickerMenu,
        },
    })
    export default class FinancialCard extends Vue {
        @Prop({
            type: Number,
            required: true,
        })
        contractId!: number;

        showAllPeriods = false;
        month = '';
        item: FinancePeriod | null = null;
        availablePeriods: string[] = [];

        created() {
            this.availablePeriods = getAvailablePeriods(this.contractId);
            this.item = getLastFinancePeriod(this.contractId);

            if (this.item) {
                this.month = formatDateStringToMonthString(this.item.period);
            }
        }

        @Watch('month')
        onMonthChanged(newValue: string, oldValue: string) {
            if (oldValue !== newValue && oldValue !== '') {
                this.item = getFinancePeriod(Period.ofString(this.month), this.contractId).orNull();
            }
        }
    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }
</style>
