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
            <tr v-for="item in items" :key="item.id" :class="{'active-extension': isActive(item)}">
                <td>{{ formatDateToFriendly(item.startDate) }}</td>
                <td>{{ formatDateToFriendly(item.endDate) }}</td>
                <td>{{ formatDateToFriendly(item.conclusionDate) }}</td>
                <td>{{ formatDateToFriendly(item.paymentActualityDate) }}</td>
                <td>{{ `${item.payment.toFixed(2)} ${CURRENCY}` }}</td>
                <td v-if="editable" class="text-right">
                    <v-btn icon color="info" @click="edit(item.id)">
                        <v-icon>
                            mdi-pencil
                        </v-icon>
                    </v-btn>
                    <v-btn icon color="error" @click="remove(item.id)">
                        <v-icon>
                            mdi-delete
                        </v-icon>
                    </v-btn>
                </td>
            </tr>
            </tbody>
        </template>
    </v-data-table>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { FullContractExtension } from '@/model/types/contract-types';
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
            type: Boolean,
            default: false,
        })
        editable!: boolean;

        @Prop({
            type: Array,
            required: true,
        })
        items!: FullContractExtension;

        headers = [
            { text: 'Дата начала', value: 'startDate', sortable: false, width: '15%' },
            { text: 'Дата окончания', value: 'endDate', sortable: false, width: '15%' },
            { text: 'Дата подписания', value: 'conclusionDate', sortable: false, width: '15%' },
            { text: 'Актуальность суммы', value: 'paymentActualityDate', sortable: false, width: '15%' },
            { text: 'Сумма', value: 'payment', sortable: false, width: '20%' },
        ];

        formatDateToFriendly = formatDateToFriendly;
        CURRENCY = CURRENCY;

        created() {
            if (this.editable) {
                this.headers.push({
                    text: '',
                    value: '',
                    sortable: false,
                    width: '',
                });
            }
        }

        isActive(item: FullContractExtension): boolean {
            const now = new Date();
            return isBefore(item.startDate, now) && isAfter(item.endDate, now);
        }

        edit(id: number) {
            this.$emit('edit', id);
        }

        remove(id: number) {
            this.$emit('remove', id);
        }
    }
</script>

<style scoped>
    .active-extension {
        background-color: #bafbbc;
        color: #4c4c4c;
    }

    .active-extension:hover {
        background-color: #a0fda2 !important;
        color: #4c4c4c !important;
    }
</style>
