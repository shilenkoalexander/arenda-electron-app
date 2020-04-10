import { ContractFilterMode } from '@/types/contracts';
<template>
    <v-container fluid class="py-3 pt-2 pb-3">
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
        </v-row>
        <v-row>
            <v-col class="py-0 pl-4">
                <v-radio-group
                        v-model="filterMode"
                        hide-details
                        row
                        color="primary"
                        class="mt-1"
                >
                    <v-radio color="primary" label="Адреса"/>
                    <v-radio color="primary" label="№ договора"/>
                    <v-radio color="primary" label="Арендатор"/>
                </v-radio-group>
            </v-col>
            <v-col cols="4" class="py-0">
                <v-combobox
                        dense
                        clearable
                        color="primary"
                        outlined
                        hide-details
                        v-model="status"
                        :items="statuses"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import { enumToComboBoxItems } from '@/utils/enum-utils';
    import { ContractFilterMode, ContractStatus, getContractStatusValue } from '@/types/contracts';
    import { $enum } from 'ts-enum-util';
    import { ContractsFilterInfo } from '@/backend/filter/filter';
    import { InputItem } from '@/types/common';

    @Component
    export default class ContractsFilter extends Vue {
        statuses = enumToComboBoxItems(ContractStatus, getContractStatusValue);

        filter: ContractsFilterInfo = {
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
