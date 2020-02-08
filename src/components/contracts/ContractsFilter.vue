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
                        v-model="filterText"
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
    import { Component, Vue } from 'vue-property-decorator';
    import { enumToComboBoxItems } from '@/utils/enum-utils';
    import { ContractStatus, getContractStatusValue } from '@/types/contracts';

    @Component
    export default class ContractsFilter extends Vue {
        statuses = enumToComboBoxItems(ContractStatus, getContractStatusValue);
        status = null;
        filterMode = 0;
        filterText = '';
    }
</script>

<style scoped>

</style>
