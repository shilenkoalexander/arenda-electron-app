<template>
    <v-data-table
            :headers="headers"
            :items="items"
            hide-default-footer
            fixed-header
    >
        <template v-slot:item.date="{item}">
            {{ formatToFriendly(item.date) }}
        </template>
        <template v-slot:item.accruals="{item}">
            {{ item.accruals.toFixed(2) }}
        </template>
        <template v-slot:item.payments="{item}">
            {{ item.payments.toFixed(2) }}
        </template>
        <template v-slot:item.adjustments="{item}">
            {{ item.adjustments.toFixed(2) }}
        </template>
        <template v-slot:item.debt="{item}">
            {{ item.debt.toFixed(2) }}
        </template>
        <template v-slot:item.fine="{item}">
            {{ item.fine.toFixed(2) }}
        </template>
    </v-data-table>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { FinancialPeriod } from '@/types/financial';
    import { formatToFriendly } from '@/utils/date-utils';

    @Component
    export default class FinancialList extends Vue {
        headers = [
            { text: 'Период', value: 'date', sortable: false, width: '19%' },
            { text: 'Начислено', value: 'accruals', sortable: false, width: '16%' },
            { text: 'Оплачено', value: 'payments', sortable: false, width: '16%' },
            { text: 'Корректировка', value: 'adjustments', sortable: false, width: '16%' },
            { text: 'Долг', value: 'debt', sortable: false, width: '16%' },
            { text: 'Пеня', value: 'fine', sortable: false, width: '16%' },
        ];

        items: FinancialPeriod[] = [
            {
                date: '2020-01-01',
                accruals: 100.0,
                adjustments: 650.5,
                payments: 3654.5,
                debt: 96658.66,
                fine: 369985.3,
            },
            {
                date: '2020-01-01',
                accruals: 100.0,
                adjustments: 650.5,
                payments: 3654.5,
                debt: 96658.66,
                fine: 369985.3,
            },
            {
                date: '2020-01-01',
                accruals: 100.0,
                adjustments: 650.5,
                payments: 3654.5,
                debt: 96658.66,
                fine: 369985.3,
            },
            {
                date: '2020-01-01',
                accruals: 100.0,
                adjustments: 650.5,
                payments: 3654.5,
                debt: 96658.66,
                fine: 369985.3,
            },
            {
                date: '2020-01-01',
                accruals: 100.0,
                adjustments: 650.5,
                payments: 3654.5,
                debt: 96658.66,
                fine: 369985.3,
            },
            {
                date: '2020-01-01',
                accruals: 100.0,
                adjustments: 650.5,
                payments: 3654.5,
                debt: 96658.66,
                fine: 369985.3,
            },
        ];

        formatToFriendly = formatToFriendly;
    }
</script>

<style scoped>

</style>
