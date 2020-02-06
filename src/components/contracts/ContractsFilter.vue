import { ContractStatus } from '@/types/contracts';
import { ContractStatus } from '@/types/contracts';
import { ContractStatus } from '@/types/contracts';
<template>
    <v-container fluid class="pa-2">
        <v-row>
            <v-col>
                <v-text-field
                        color="primary"
                        outlined
                        label="Фильтр"
                        prepend-inner-icon="search"
                        hide-details
                />
            </v-col>
        </v-row>
        <v-row>
            <v-col class="py-0 pl-4">
                <v-radio-group v-model="filterMode" row color="primary">
                    <v-radio label="Адреса"/>
                    <v-radio label="№ договора"/>
                    <v-radio label="Арендатор"/>
                </v-radio-group>
            </v-col>
            <v-col cols="4" class="py-0">
                <v-combobox
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

@Component
export default class ContractsFilter extends Vue {
    public statuses = [

    ];

    public status = null;
}
</script>

<style scoped>

</style>
