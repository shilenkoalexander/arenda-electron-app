<template>
    <v-data-table
        class="table"
        :headers="headers"
        :items="items"
        hide-default-footer
        fixed-header
    >
        <template v-slot:item.period="{item}">
            {{ item.period.toFriendlyFormat() }}
        </template>
        <template v-slot:item.date="{item}">
            {{ formatDateToFriendly(item.date) }}
        </template>
        <template v-slot:item.sum="{item}">
            {{ item.sum.toFixed(2) }}
        </template>
    </v-data-table>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { Payment } from '@/types/finance';
    import { getPayments } from '@/backend/repository/finance-repository';
    import { formatDateToFriendly } from '@/utils/date-utils';

    @Component
    export default class PaymentsList extends Vue {
        @Prop({
            type: Number,
            required: true,
        })
        contractId!: number;

        items: Payment[] = [];

        headers = [
            { text: 'Период', value: 'period', sortable: false },
            { text: 'Дата', value: 'date', sortable: false },
            { text: 'Сумма', value: 'sum', sortable: false },
        ];

        formatDateToFriendly = formatDateToFriendly;

        created() {
            this.update();
        }

        public update() {
            this.items = getPayments(this.contractId);
        }
    }
</script>

<style scoped>
    .table {
        max-height: 45vh;
        overflow: auto;
    }
</style>
