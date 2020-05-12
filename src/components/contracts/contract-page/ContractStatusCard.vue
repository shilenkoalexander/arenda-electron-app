<template>
    <v-card class="elevation-1">
        <v-container fluid class="px-5">
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
                    <Label label="Дата заключения" value="18.01.2018"/>
                </v-col>
                <v-col>
                    <Label label="Срок действия" value="18.01.2019"/>
                </v-col>
            </v-row>
            <v-row class="mt-2">
                <v-col cols="6">
                    <p class="ml-3 mb-0 subtitle-1 grey--text">Последнее продление:</p>
                </v-col>
                <v-col>
                    <v-switch
                            v-model="showAllExtensions"
                            label="Показать все продления"
                            hide-details
                            class="mt-0"
                            color="primary lighten-2"
                    />
                </v-col>
            </v-row>
            <v-expand-transition mode="out-in">
                <v-row v-if="!showAllExtensions" key="last-extension">
                    <v-col>
                        <Label label="С" value="18.01.2019"/>
                    </v-col>
                    <v-col>
                        <Label label="По" value="18.01.2019"/>
                    </v-col>
                </v-row>
                <v-row v-else key="all-extensions">
                    <v-col>
                        <v-data-table
                                :headers="headers"
                                :items="items"
                                hide-default-footer
                                fixed-header
                        >
                            <template v-slot:item.actionDate="{item}">
                                {{formatToFriendly(item.startDate)}}
                            </template>
                            <template v-slot:item.dateFrom="{item}">
                                {{formatToFriendly(item.endDate)}}
                            </template>
                            <template v-slot:item.dateTo="{item}">
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-expand-transition>
        </v-container>
    </v-card>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { getIconByStatus, getIconColorByStatus } from '@/utils/icon-utils';
    import { ContractStatus, getContractStatusValue } from '@/backend/types/contract-types';
    import { formatToFriendly } from '@/utils/date-utils';
    import Label from '@/components/Label.vue';
    import { ContractExtension } from '@/backend/types/contract-types';

    @Component({
        components: {
            Label,
        },
    })
    export default class ContractStatusCard extends Vue {
        headers = [
            { text: 'Дата продления', value: 'actionDate', sortable: false, width: '35%' },
            { text: 'Дата с', value: 'dateFrom', sortable: false, width: '30%' },
            { text: 'Дата по', value: 'dateTo', sortable: false, width: '30%' },
        ];
        showAllExtensions = false;
        formatToFriendly = formatToFriendly;

        items: ContractExtension[] = [];

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
