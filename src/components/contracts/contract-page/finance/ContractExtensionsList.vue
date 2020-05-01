<template>
    <v-data-table
        class="table"
        :headers="headers"
        :items="items"
        hide-default-footer
        fixed-header
    >
        <template v-slot:item.active="{item}">
            <v-icon v-if="isActive(item)" color="success">
                mdi-checkbox-marked-circle-outline
            </v-icon>
        </template>
        <template v-slot:item.startDate="{item}">
            {{ formatDateToFriendly(item.startDate) }}
        </template>
        <template v-slot:item.endDate="{item}">
            {{ formatDateToFriendly(item.endDate) }}
        </template>
        <template v-slot:item.conclusionDate="{item}">
            {{ formatDateToFriendly(item.conclusionDate) }}
        </template>
        <template v-slot:item.payment="{item}">
            {{ `${item.payment.toFixed(2)} ${CURRENCY}`}}
        </template>
        <template v-slot:item.paymentActualityDate="{item}">
            {{ formatDateToFriendly(item.paymentActualityDate) }}
        </template>
    </v-data-table>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { FullContractExtension } from '@/types/contracts';
    import { getFullContractExtensions } from '@/backend/repository/contract-repository';
    import { formatDateToFriendly } from '@/utils/date-utils';
    import { CURRENCY } from '@/utils/finance-util';
    import { isAfter, isBefore } from 'date-fns';

    @Component
    export default class ContractExtensionsList extends Vue {
        @Prop({
            type: Number,
            required: true,
        })
        contractId!: number;

        items: FullContractExtension[] = [];

        headers = [
            { text: '', value: 'active', sortable: false, width: '5%' },
            { text: 'Дата начала', value: 'startDate', sortable: false },
            { text: 'Дата окончания', value: 'endDate', sortable: false },
            { text: 'Дата подписания', value: 'conclusionDate', sortable: false },
            { text: 'Сумма', value: 'payment', sortable: false },
            { text: 'Актуальность суммы', value: 'paymentActualityDate', sortable: false },
        ];

        formatDateToFriendly = formatDateToFriendly;
        CURRENCY = CURRENCY;

        isActive(item: FullContractExtension): boolean {
            const now = new Date();
            return isBefore(item.startDate, now) && isAfter(item.endDate, now);
        }

        created() {
            this.update();
        }

        public update() {
            this.items = getFullContractExtensions(this.contractId);
        }
    }
</script>

<style scoped>
    .table {
        max-height: 45vh;
        overflow: auto;
    }
</style>
