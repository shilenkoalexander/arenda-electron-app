<template>
    <v-container fluid>
        <v-row>
            <v-col cols="7">
                <ContractInfo/>
            </v-col>
            <v-col cols="3">
                <ContractStatusCard/>
            </v-col>
            <v-col>
                <ContractInfoActionsCard/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ContractInfo from '@/components/contracts/contract-page/ContractInfo.vue';
import ContractStatusCard from '@/components/contracts/contract-page/ContractStatusCard.vue';
import ContractInfoActionsCard from '@/components/contracts/contract-page/ContractInfoActionsCard.vue';

@Component({
    components: {
        ContractInfo,
        ContractStatusCard,
        ContractInfoActionsCard,
    },
})
export default class ContractPage extends Vue {

}
</script>

<style scoped>

</style>
