<template>
    <v-data-table
        :height="height"
        :headers="headers"
        :items="items"
        hide-default-footer
        fixed-header
    >
        <template v-slot:body="{ items }">
            <tbody>
            <tr v-for="item in items" :key="item.name" :class="{'active-extension': isActive(item)}">
                <td>{{ formatDateToFriendly(item.startDate) }}</td>
                <td>{{ formatDateToFriendly(item.endDate) }}</td>
                <td>{{ formatDateToFriendly(item.conclusionDate) }}</td>
                <td>{{ `${item.payment.toFixed(2)} ${CURRENCY}` }}</td>
                <td>{{ formatDateToFriendly(item.paymentActualityDate) }}</td>
            </tr>
            </tbody>
        </template>
    </v-data-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FullContractExtension } from '@/types/contracts';
import { formatDateToFriendly } from '@/utils/date-utils';
import { CURRENCY } from '@/utils/finance-util';
import { isAfter, isBefore } from 'date-fns';

@Component
export default class ContractExtensionsList extends Vue {
    @Prop({
        type: String,
        default: '38vh',
    })
    height!: string;

    @Prop({
        type: Array,
        required: true,
    })
    items!: FullContractExtension;

    headers = [
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
}
</script>

<style scoped>
    .active-extension {
        background-color: #4CAF50;
        color: white;
    }

    .active-extension:hover {
        background-color: #42bb4a !important;
        color: white!important;
    }
</style>
