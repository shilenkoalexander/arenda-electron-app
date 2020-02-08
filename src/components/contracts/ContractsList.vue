<template>
    <v-container fluid>
        <v-row>
            <v-col>
                <v-data-table
                        :headers="headers"
                        :items="items"
                        fixed-header
                >
                    <template v-slot:item.status="{item}">
                        <v-icon :color="getIconColorByStatus(item.status)" size="30">
                            {{ getIconByStatus(item.status) }}
                        </v-icon>
                    </template>
                    <template v-slot:item.contract="{item}">
                        <router-link to="/">
                            <p class="clickable-text mb-0 mt-1">Договор №{{item.number}}</p>
                        </router-link>
                        <p class="mb-0 secondary-text">с: {{formatToFriendly(item.startDate)}}</p>
                        <p class="mb-1 secondary-text">по: {{formatToFriendly(item.endDate)}}</p>
                    </template>
                    <template v-slot:item.tenant="{item}">
                        <router-link to="/">
                            <p class="clickable-text mb-0 mt-1">{{item.tenantInfo.fullName}}</p>
                        </router-link>
                        <p class="mb-0 secondary-text">{{item.tenantInfo.legalAddress}}</p>
                    </template>
                    <template v-slot:item.action="{item}">
                        <v-btn icon color="info darken-4" @click="showDetails(item.id)">
                            <v-icon size="30">
                                mdi-logout-variant
                            </v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { getContracts } from '@/backend/service/contracts-service';
    import { Contract } from '@/types/contracts';
    import { formatToFriendly } from '@/utils/date-utils';
    import { getIconByStatus, getIconColorByStatus } from '@/utils/icon-utils';

    @Component
    export default class ContractsList extends Vue {
        headers = [
            { text: 'Статус', align: 'center', sortable: false, value: 'status', width: '10%' },
            { text: 'Договор', value: 'contract', width: '30%' },
            { text: 'Арендатор', value: 'tenant', width: '50%' },
            { text: 'Просмотр', value: 'action', sortable: false, align: 'center' },
        ];
        items: Contract[] = [];

        formatToFriendly = formatToFriendly;
        getIconColorByStatus = getIconColorByStatus;
        getIconByStatus = getIconByStatus;

        created() {
            this.items = getContracts();
        }

        showDetails(id: number) {
            this.$emit('show-contract-details', id);
        }
    }
</script>

<style scoped>
    .clickable-text {
        color: #2f518a;
        font-size: 16px;
    }

    .secondary-text {
        color: gray;
    }
</style>
