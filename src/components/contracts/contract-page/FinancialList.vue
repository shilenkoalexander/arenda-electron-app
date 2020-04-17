<template>
    <v-data-table
            :headers="headers"
            :items="items"
            hide-default-footer
            fixed-header
    >
        <template v-slot:item.date="{item}">
            {{ formatToFriendly(item.period) }}
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
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { FinancePeriod } from '@/types/finance';
    import { formatToFriendly } from '@/utils/date-utils';
    import { getAllPeriods } from '@/backend/repository/finance-repository';

    @Component
    export default class FinancialList extends Vue {
        @Prop({
            type: Number,
            required: true,
        })
        contractId!: number;

        headers = [
            { text: 'Период', value: 'date', sortable: false, width: '19%' },
            { text: 'Начислено', value: 'accruals', sortable: false, width: '16%' },
            { text: 'Оплачено', value: 'payments', sortable: false, width: '16%' },
            { text: 'Корректировка', value: 'adjustments', sortable: false, width: '16%' },
            { text: 'Долг', value: 'debt', sortable: false, width: '16%' },
            { text: 'Пеня', value: 'fine', sortable: false, width: '16%' },
        ];

        items: FinancePeriod[] = [];

        formatToFriendly = formatToFriendly;

        created() {
            this.items = getAllPeriods(this.contractId);
        }
    }
</script>

<style scoped>

</style>
