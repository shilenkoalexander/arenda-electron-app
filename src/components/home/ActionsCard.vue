<template>
    <v-card>
        <v-container fluid class="py-0">
            <v-row>
                <v-col>
                    <v-btn block text color="primary" to="/contracts/add">
                        <v-icon class="mr-2">
                            mdi-text-box-plus-outline
                        </v-icon>
                        Добавить договор
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn block text color="primary">
                        <v-icon class="mr-2">
                            mdi-account-plus-outline
                        </v-icon>
                        Добавить арендатора
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn block text color="primary" @click="report">
                        <v-icon class="mr-2">
                            mdi-text-box-multiple-outline
                        </v-icon>
                        Отчеты
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn block text color="primary">
                        <v-icon class="mr-2">
                            mdi-settings-outline
                        </v-icon>
                        Настройки
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { AccrualsByDateReport } from '@/model/report/accruals-by-date-report';
    import { parseDate } from '@/utils/date-utils';

    @Component
    export default class ActionsCard extends Vue {
        report() {
            new AccrualsByDateReport().create([
                {
                    contractNumber: '12345',
                    tenant: 'МИНИСТЕРСТВО ЮСТИЦИИ ДОНЕЦКОЙ НАРОДНОЙ РЕСПУБЛИКИ',
                    startDate: '01.01.2020',
                    endDate: '01.01.2020',
                    square: 7.20.toFixed(2),
                    monthlyAccruals: 2.0.toFixed(2),
                    prevMonthPayments: 340.0.toFixed(2),
                    debtIncludingAccruals: '250.22',
                    adjustment: '',
                    debtWithoutAccruals: '252.22',
                },
                {
                    contractNumber: '12345',
                    tenant: 'МИНИСТЕРСТВО ЮСТИЦИИ ДОНЕЦКОЙ НАРОДНОЙ РЕСПУБЛИКИ',
                    startDate: '01.01.2020',
                    endDate: '01.01.2020',
                    square: 7.20.toFixed(2),
                    monthlyAccruals: 2.0.toFixed(2),
                    prevMonthPayments: 340.0.toFixed(2),
                    debtIncludingAccruals: '250.22',
                    adjustment: '',
                    debtWithoutAccruals: '252.22',
                },
                {
                    contractNumber: '12345',
                    tenant: 'МИНИСТЕРСТВО ЮСТИЦИИ ДОНЕЦКОЙ НАРОДНОЙ РЕСПУБЛИКИ',
                    startDate: '01.01.2020',
                    endDate: '01.01.2020',
                    square: 7.20.toFixed(2),
                    monthlyAccruals: 2.0.toFixed(2),
                    prevMonthPayments: 340.0.toFixed(2),
                    debtIncludingAccruals: '250.22',
                    adjustment: '',
                    debtWithoutAccruals: '252.22',
                },
            ], { date: parseDate('2020-05-08') });
        }
    }
</script>

<style scoped>

</style>
