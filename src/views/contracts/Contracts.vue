<template>
    <v-container fluid>
        <v-row>
            <v-col cols="5">
                <v-card>
                    <ContractsList @show-contract-details="showContractDetails"/>
                </v-card>
            </v-col>
            <v-col>
                <v-fade-transition mode="out-in">
                    <v-card v-if="item" class="fill-height" :key="`contract-details-${item.contractInfo.id}`">
                        <ContractDetails :item="item"/>
                    </v-card>
                </v-fade-transition>
            </v-col>
        </v-row>
        <v-btn
                fixed
                fab
                right
                bottom
                color="primary"
                @click="onContractAddClicked"
        >
            <v-icon>
                mdi-plus
            </v-icon>
        </v-btn>
        <NewContractDialog ref="newContractDialog"/>
    </v-container>
</template>

<script lang="ts">
import ContractsFilter from '@/components/contracts/ContractsFilter.vue';
import ContractsActionPanel from '@/components/contracts/ContractsActionPanel.vue';
import { Component, Vue } from 'vue-property-decorator';
import ContractsList from '@/components/contracts/ContractsList.vue';
import ContractDetails from '@/components/contracts/ContractDetails.vue';
import { getContractDetails } from '@/backend/repository/contract-repository';
import { FullContractDetails } from '@/backend/types/contract-types';
import NewContractDialog from '@/components/contracts/edit-contract/NewContractDialog.vue';

@Component({
    components: {
        NewContractDialog,
        ContractsFilter,
        ContractsActionPanel,
        ContractsList,
        ContractDetails,
    },
})
export default class Contracts extends Vue {
    item: FullContractDetails | null = null;

    $refs!: {
        newContractDialog: NewContractDialog;
    };

    showContractDetails(id: number) {
        this.item = getContractDetails(id);
    }

    onContractAddClicked() {
        this.$refs.newContractDialog.open();
    }
}
</script>

<style scoped lang="scss">
</style>
