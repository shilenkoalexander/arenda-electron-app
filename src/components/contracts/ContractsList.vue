<template>
    <v-container fluid>
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
                        height="65vh"
                        hide-default-footer
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
                        <p class="mb-1 secondary-text">по: {{formatToFriendly(item.validity)}}</p>
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
    import { Contract } from '@/types/contracts';
    import { formatToFriendly } from '@/utils/date-utils';
    import { getIconByStatus, getIconColorByStatus } from '@/utils/icon-utils';
    import ContractsFilter from '@/components/contracts/ContractsFilter.vue';
    import { Pagination } from '@/types/common';
    import PaginationComponent from '@/components/Pagination.vue';
    import { ContractsFilterInfo } from '@/backend/filter/filter';

    @Component({
        components: {
            Pagination: PaginationComponent,
            ContractsFilter,
        },
    })
    export default class ContractsList extends Vue {
        headers = [
            { text: 'Статус', align: 'center', sortable: false, value: 'status', width: '10%' },
            { text: 'Договор', value: 'contract', width: '30%' },
            { text: 'Арендатор', value: 'tenant', width: '50%' },
            { text: 'Просмотр', value: 'action', sortable: false, align: 'center' },
        ];
        items: Contract[] = [];

        pagination: Pagination = {
            desc: [false],
            page: 1,
            size: 10,
            sort: [null],
        };

        filter: ContractsFilterInfo | null = null;

        totalItems: number | null = null;
        totalPages: number | null = null;

        formatToFriendly = formatToFriendly;
        getIconColorByStatus = getIconColorByStatus;
        getIconByStatus = getIconByStatus;

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

        showDetails(id: number) {
            this.$emit('show-contract-details', id);
        }

        onFilterChanged(filter: ContractsFilterInfo) {
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
