<template>
    <v-container fluid>
        <v-row>
            <v-col class="py-0 pl-5">
                <p class="mb-0 title font-weight-regular text-center">Список арендаторов</p>
            </v-col>
        </v-row>
        <v-row>
            <TenantsFilter @filter="onFilterChanged"/>
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
                    <template v-slot:item.name="{item}">
                        <router-link :to="'/tenant/' + item.id">
                            <p class="clickable-text mb-0 mt-1">{{getTenantName(item)}}</p>
                        </router-link>
                        <p v-if="item.organizationName" class="mb-0 secondary-text">{{getResponsiblePerson(item)}}</p>
                    </template>
                    <template v-slot:item.legalAddress="{item}">
                        <p class="mb-0 mt-1">{{item.legalAddress}}</p>
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
    import { Pagination } from '@/types/common';
    import { TenantsFilter as TenantsFilterDto } from '@/model/filter/filter';
    import PaginationComponent from '@/components/Pagination.vue';
    import TenantsFilter from '@/components/home/TenantsFilter.vue';
    import { Tenant } from '@/model/types/tenants-types';
    import { getAllTenants } from '@/model/repository/tenant-repository';

    @Component({
        components: {
            TenantsFilter,
            Pagination: PaginationComponent,
        },
    })
    export default class TenantsList extends Vue {
        headers = [
            { text: 'Имя', value: 'name', width: '40%' },
            { text: 'Адрес', value: 'legalAddress', width: '40%' },
        ];
        items: Tenant[] = [];

        pagination: Pagination = {
            desc: [false],
            page: 1,
            size: 10,
            sort: [null],
        };

        filter: TenantsFilterDto | null = null;

        totalItems: number | null = null;
        totalPages: number | null = null;

        @Watch('pagination', { immediate: true, deep: true })
        onPaginationChanged() {
            this.loadContracts();
        }

        @Watch('filter', { deep: true })
        onLocalFilterChanged() {
            this.loadContracts();
            this.pagination.page = 1;
        }

        getTenantName(tenant: Tenant): string {
            if (tenant.organizationName) {
                return tenant.organizationName;
            }
            return tenant.responsiblePerson;
        }

        getResponsiblePerson(tenant: Tenant): string | null {
            if (tenant.organizationName) {
                return tenant.responsiblePerson;
            }
            return null;
        }

        loadContracts() {
            const page = getAllTenants(this.pagination, this.filter);
            this.items = page.content;
            this.totalItems = page.totalItems;
            this.totalPages = page.totalPages;
        }

        onFilterChanged(filter: TenantsFilterDto) {
            this.filter = filter;
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
