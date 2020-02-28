<template>
    <v-card>
        <v-container fluid>
            <v-row>
                <v-col class="d-flex mt-2" align-self="center">
                    <p class="ml-3 mb-0 subtitle-1 grey--text">Статус:</p>
                    <v-icon :color="statusIconColor" size="30" class="ml-1">
                        {{statusIcon}}
                    </v-icon>
                    <p class="mb-0 subtitle-1 ml-1">{{status}}</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <ContractInfoItem text="Дата заключения" value="18.01.2018"/>
                </v-col>
                <v-col>
                    <ContractInfoItem text="Срок действия" value="18.01.2019"/>
                </v-col>
            </v-row>
            <v-row class="mt-2">
                <v-col>
                    <p class="ml-3 mb-0 subtitle-1 grey--text">Последнее продление:</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <ContractInfoItem text="С" value="18.01.2019"/>
                </v-col>
                <v-col>
                    <ContractInfoItem text="По" value="18.01.2019"/>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { getIconByStatus, getIconColorByStatus } from '@/utils/icon-utils';
    import { ContractStatus, getContractStatusValue } from '@/types/contracts';
    import ContractInfoItem from '@/components/contracts/contract-page/ContractInfoItem.vue';

    @Component({
        components: {
            ContractInfoItem,
        },
    })
    export default class ContractStatusCard extends Vue {
        get statusIcon(): string {
            return getIconByStatus(ContractStatus.ACTIVE);
        }

        get statusIconColor(): string {
            return getIconColorByStatus(ContractStatus.ACTIVE);
        }

        get status(): string {
            return getContractStatusValue(ContractStatus.ACTIVE);
        }
    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }
</style>
