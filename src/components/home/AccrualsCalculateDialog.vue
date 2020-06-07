<template>
    <v-dialog v-model="dialog" width="50vw">
        <v-card>
            <v-container fluid>
                <v-row>
                    <v-col class="py-0 pl-5">
                        <p class="mb-0 title font-weight-regular text-center">Расчет начисления</p>
                    </v-col>
                </v-row>
                <v-row class="pb-2">
                    <v-col>
                        <EditableTextField
                                hide-details
                                label="Поиск по номеру"
                                prepend-inner-icon="mdi-magnify"
                                clearable
                                v-model="filter"
                        />
                    </v-col>
                </v-row>
                <v-divider/>
                <v-row>
                    <v-col class="pt-0">
                        <v-simple-table fixed-header height="50vh">
                            <template v-slot:default>
                                <thead>
                                <tr>
                                    <th class="text-left"></th>
                                    <th class="text-left">Номер</th>
                                    <th class="text-left">Арендатор</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr
                                        v-for="contract in contracts"
                                        :key="contract.id"
                                        @click="contract.include = !contract.include"
                                        class="table-row"
                                        :class="{'selected-table-row' : contract.include}"
                                >
                                    <td>
                                        <v-simple-checkbox color="primary" :value="contract.include"/>
                                    </td>
                                    <td>{{ contract.contractNumber }}</td>
                                    <td>{{ contract.tenantName }}</td>
                                </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-col>
                </v-row>
                <v-divider/>
                <v-row justify="center">
                    <v-col cols="4" class="pb-0" @click="onCalculateClicked">
                        <v-btn text block color="primary">
                            Расчитать
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import EditableTextField from '@/components/EditableTextField.vue';
    import { ContractNumberWithTenantName } from '@/model/types/contract-types';
    import { getContractsForAccrualsCalculation } from '@/model/repository/contract-repository';
    import { calculateFinancePeriod } from '@/model/service/accruals-service';
    import Period from '@/model/utils/period';

    @Component({
    components: { EditableTextField },
})
export default class AccrualsCalculateDialog extends Vue {
    dialog = false;
    filter = '';
    contracts: Array<ContractNumberWithTenantName & { include: boolean }> = [];

    open() {
        this.contracts = getContractsForAccrualsCalculation().map((value) => ({
            ...value,
            include: true,
        }));

        this.dialog = true;
    }

    onCalculateClicked() {
        const currentCalculativePeriod = Period.currentCalculativePeriod();

        const financePeriods = this.contracts
            .filter((value) => value.include)
            .map((value) => calculateFinancePeriod(currentCalculativePeriod, value.id));

        console.log(financePeriods);
    }
}
</script>

<style scoped>
    .table-row {
        cursor: pointer;
    }

    .table-row:hover {
        background-color: #f5f5f5 !important;
    }

    .selected-table-row {
        background-color: #f6f6f6 !important;
    }

    .selected-table-row:hover {
        background-color: #eeeeee !important;
    }
</style>
