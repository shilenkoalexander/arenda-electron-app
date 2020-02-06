<template>
    <v-container fluid>
        <v-row>
            <v-col>
                <v-card>
                    <ContractsFilter/>
                </v-card>
            </v-col>
            <v-col>
                <v-card class="fill-height">
                    <ContractsActionPanel/>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card>
                    <ContractsList/>
                </v-card>
            </v-col>
            <v-col>
                <v-card>

                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import ContractsFilter from '@/components/contracts/ContractsFilter.vue';
import ContractsActionPanel from '@/components/contracts/ContractsActionPanel.vue';
import { Component, Vue } from 'vue-property-decorator';
import ContractsList from '@/components/contracts/ContractsList.vue';

@Component({
    components: {
        ContractsFilter,
        ContractsActionPanel,
        ContractsList,
    },
})
export default class Contracts extends Vue {

}
</script>

<style scoped>

</style>
