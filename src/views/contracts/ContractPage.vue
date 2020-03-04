<template>
    <div>
        <v-tabs
                v-model="tab"
                background-color="primary lighten-1"
                dark
        >
            <v-tab>Информация о договоре</v-tab>
            <v-tab>Информация об объектах</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
            <v-tab-item>
                <v-container fluid class="back">
                    <v-row>
                        <v-col cols="7">
                            <ContractInfo class="fill-height"/>
                        </v-col>
                        <v-col cols="5">
                            <ContractInfoActionsCard class="fill-height"/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="7">
                            <FinancialCard class="fill-height"/>
                        </v-col>
                        <v-col>
                            <ContractStatusCard class="fill-height"/>
                        </v-col>
                    </v-row>
                </v-container>
            </v-tab-item>
            <v-tab-item>
                <v-container fluid class="back">
                    <v-row>
                        <v-col cols="6" v-for="i in 3" :key="i">
                            <ObjectDetailsCard/>
                        </v-col>
                    </v-row>
                </v-container>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import ContractInfo from '@/components/contracts/contract-page/ContractInfo.vue';
    import ContractStatusCard from '@/components/contracts/contract-page/ContractStatusCard.vue';
    import ContractInfoActionsCard from '@/components/contracts/contract-page/ContractInfoActionsCard.vue';
    import FinancialCard from '@/components/contracts/contract-page/FinancialCard.vue';
    import ObjectDetailsCard from '@/components/contracts/contract-page/ObjectDetailsCard.vue';
    import ObjectListCard from '@/components/contracts/contract-page/ObjectListCard.vue';

    @Component({
        components: {
            ContractInfo,
            ContractStatusCard,
            ContractInfoActionsCard,
            FinancialCard,
            ObjectListCard,
            ObjectDetailsCard,
        },
    })
    export default class ContractPage extends Vue {
        tab = null;
    }
</script>

<style scoped lang="scss">

</style>
