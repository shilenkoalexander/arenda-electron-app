<template>
    <v-data-table
        :height="height"
        :headers="headers"
        :items="items"
        hide-default-footer
        fixed-header
    >
        <template v-slot:item.period="{item}">
            {{ item.period.toFriendlyFormat() }}
        </template>
        <template v-slot:item.accruals="{item}">
            {{ item.accruals.toFixed(2) }}
        </template>
        <template v-slot:item.adjustments="{item}">
            {{ item.adjustments.toFixed(2) }}
        </template>
        <template v-slot:item.payments="{item}">
            {{ item.payments.toFixed(2) }}
        </template>
        <template v-slot:item.debt="{item}">
            {{ item.debt.toFixed(2) }}
        </template>
    </v-data-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FinancePeriod } from '@/backend/types/finance-types';

@Component
export default class FinanceList extends Vue {
    @Prop({
        type: String,
        default: '38vh',
    })
    height!: string;

    @Prop({
        type: Array,
        required: true,
    })
    items!: FinancePeriod[];

    headers = [
        { text: 'Период', value: 'period', sortable: false, width: '19%' },
        { text: 'Начислено', value: 'accruals', sortable: false, width: '16%' },
        { text: 'Корректировка', value: 'adjustments', sortable: false, width: '16%' },
        { text: 'Оплачено', value: 'payments', sortable: false, width: '16%' },
        { text: 'Долг', value: 'debt', sortable: false, width: '16%' },
    ];
}
</script>

<style scoped>

</style>
