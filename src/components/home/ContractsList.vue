<template>
    <v-container fluid>
        <v-row>
            <v-col class="py-0 pl-5">
                <p class="mb-0 title font-weight-regular text-center">Список договоров</p>
            </v-col>
        </v-row>
        <v-row>
            <ContractsFilter @filter="onFilterChanged"/>
        </v-row>
        <v-divider/>
        <v-row>
            <v-col>
                <v-data-table
                        :headers="headers"
                        :items="items"
                        :sort-by.sync="pagination.sort"
                        :sort-desc.sync="pagination.desc"
                        height="58vh"
                        hide-default-footer
                        fixed-header
                >
                    <template v-slot:item.status="{item}">
                        <v-icon :color="getIconColorByStatus(item.status)" size="30" class="mr-2">
                            {{ getIconByStatus(item.status) }}
                        </v-icon>
                        <span class="secondary-text">{{ getContractStatusValue(item.status) }}</span>
                    </template>
                    <template v-slot:item.contract="{item}">
                        <router-link :to="'/contract/' + item.id">
                            <p class="clickable-text mb-0 mt-1">Договор №{{item.number}}</p>
                        </router-link>
                        <p class="mb-0 secondary-text">с: {{formatToFriendly(item.startDate)}}</p>
                        <p class="mb-1 secondary-text">по: {{formatToFriendly(item.validity)}}</p>
                    </template>
                    <template v-slot:item.tenant="{item}">
                        <router-link to="/">
                            <p class="clickable-text mb-0 mt-1">{{item.tenantInfo.fullName}}</p>
                        </router-link>
                        <p class="mb-0 secondary-text">{{item.tenantInfo.legalAddress}}</p>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        <v-row>
            <Pagination
                    color="primary lighten-1"
                    v-model="pagination.page"
                    :rows-per-page.sync="pagination.size"
                    :visible-page-count-xs="5"
                    :total-items="totalItems"
                    :total-pages="totalPages"
            />
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import { getAllContracts } from '@/backend/repository/contract-repository';
    import { ContractWithTenant, getContractStatusValue } from '@/backend/types/contract-types';
    import { formatToFriendly } from '@/utils/date-utils';
    import { getIconByStatus, getIconColorByStatus } from '@/utils/icon-utils';
    import ContractsFilter from '@/components/home/ContractsFilter.vue';
    import { Pagination } from '@/types/common';
    import PaginationComponent from '@/components/Pagination.vue';
    import { ContractsFilter as ContractsFilterDto } from '@/backend/filter/filter';

    @Component({
        components: {
            Pagination: PaginationComponent,
            ContractsFilter,
        },
    })
    export default class ContractsList extends Vue {
        headers = [
            { text: 'Статус', align: 'left', sortable: false, value: 'status', width: '20%' },
            { text: 'Договор', value: 'contract', width: '30%' },
            { text: 'Арендатор', value: 'tenant', width: '50%' },
        ];
        items: ContractWithTenant[] = [];

        pagination: Pagination = {
            desc: [false],
            page: 1,
            size: 10,
            sort: [null],
        };

        filter: ContractsFilterDto | null = null;

        totalItems: number | null = null;
        totalPages: number | null = null;

        formatToFriendly = formatToFriendly;
        getIconColorByStatus = getIconColorByStatus;
        getIconByStatus = getIconByStatus;
        getContractStatusValue = getContractStatusValue;

        @Watch('pagination', { immediate: true, deep: true })
        onPaginationChanged() {
            this.loadContracts();
        }

        @Watch('filter', { deep: true })
        onLocalFilterChanged() {
            this.loadContracts();
            this.pagination.page = 1;
        }

        loadContracts() {
            const page = getAllContracts(this.pagination, this.filter);
            this.items = page.content;
            this.totalItems = page.totalItems;
            this.totalPages = page.totalPages;
        }

        onFilterChanged(filter: ContractsFilterDto) {
            this.filter = filter;
        }
    }
</script>

<style scoped lang="scss">
    .clickable-text {
        color: #2f518a;
        font-size: 16px;
    }

    .secondary-text {
        color: gray;
    }

</style>
