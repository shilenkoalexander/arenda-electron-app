<template>
    <v-container fluid>
        <v-row justify="center">
            <v-col xl="10" xs="12">
                <ActionsCard/>
            </v-col>
        </v-row>
        <v-row justify="center">
            <v-col xl="6" xs="8">
                <v-card>
                    <ContractsList/>
                </v-card>
            </v-col>
            <v-col xl="4" xs="4">
                <v-card>
                    <TenantsList/>
                </v-card>
            </v-col>
        </v-row>
        <NewContractDialog ref="newContractDialog"/>
    </v-container>
</template>

<script lang="ts">
    import ContractsFilter from '@/components/home/ContractsFilter.vue';
    import ContractsActionPanel from '@/components/contracts/ContractsActionPanel.vue';
    import { Component, Vue } from 'vue-property-decorator';
    import ContractsList from '@/components/home/ContractsList.vue';
    import ContractDetails from '@/components/contracts/ContractDetails.vue';
    import { getContractDetails } from '@/backend/repository/contract-repository';
    import { FullContractDetails } from '@/backend/types/contract-types';
    import NewContractDialog from '@/components/contracts/edit-contract/NewContractDialog.vue';
    import TenantsList from '@/components/home/TenantsList.vue';
    import ActionsCard from '@/components/home/ActionsCard.vue';

    @Component({
    components: {
        ActionsCard,
        TenantsList,
        NewContractDialog,
        ContractsFilter,
        ContractsActionPanel,
        ContractsList,
        ContractDetails,
    },
})
export default class Home extends Vue {
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
