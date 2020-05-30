<template>
    <v-container fluid class="pt-2 pb-3 px-5">
        <v-row>
            <v-col>
                <v-text-field
                        dense
                        color="primary"
                        outlined
                        label="Фильтр"
                        prepend-inner-icon="mdi-magnify"
                        hide-details
                        clearable
                        v-model="filter.search"
                />
            </v-col>
            <v-col class="py-0 pl-4" cols="6" align-self="center">
                <v-radio-group
                        v-model="filterMode"
                        hide-details
                        row
                        color="primary"
                        class="mt-0"
                >
                    <v-radio color="primary" label="Адреса"/>
                    <v-radio color="primary" label="№ договора"/>
                    <v-radio color="primary" label="Арендатор"/>
                </v-radio-group>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import { enumToComboBoxItems } from '@/utils/enum-utils';
    import { $enum } from 'ts-enum-util';
    import { ContractFilterMode, ContractsFilter as ContractsFilterDto } from '@/backend/filter/filter';
    import { InputItem } from '@/types/common';
    import { ContractStatus, getContractStatusValue } from '@/backend/types/contract-types';

    @Component
    export default class ContractsFilter extends Vue {
        statuses = enumToComboBoxItems(ContractStatus, getContractStatusValue);

        filter: ContractsFilterDto = {
            status: null,
            filterMode: ContractFilterMode.ADDRESS,
            search: null,
        };

        filterMode = 0;
        status: InputItem | null = null;

        @Watch('status')
        onStatusChanged() {
            this.filter.status = this.status ? this.status.value : null;
        }

        @Watch('filterMode')
        onFilterModeChanged() {
            this.filter.filterMode = $enum(ContractFilterMode).getValues()[this.filterMode];
        }

        @Watch('filter', { deep: true })
        onFilterChanged() {
            this.$emit('filter', this.filter);
        }
    }
</script>

<style scoped>

</style>
