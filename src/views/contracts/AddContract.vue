<template>
    <v-container fluid>
        <v-row justify="center">
            <v-col cols="10">
                <v-card>
                    <v-container fluid>
                        <v-row>
                            <v-col cols="4">
                                <v-container fluid>
                                    <form ref="form">
                                        <v-row>
                                            <v-col>
                                                <p class="title text-center">Информация о договоре</p>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <v-autocomplete
                                                        v-model="tenantId"
                                                        :items="tenants"
                                                        :rules="[notEmptyRule]"
                                                        label="Арендатор"
                                                        outlined
                                                        dense
                                                        validate-on-blur
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <v-text-field
                                                        v-model="contractNumber"
                                                        :rules="[notEmptyRule]"
                                                        label="Номер договора"
                                                        outlined
                                                        validate-on-blur
                                                        dense
                                                />
                                            </v-col>
                                            <v-col>
                                                <DatePickerMenu
                                                        v-model="startDate"
                                                        :rules="[notEmptyRule]"
                                                        label="Дата заключения"
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <DatePickerMenu v-model="decisionDate" label="Решение от"/>
                                            </v-col>
                                            <v-col>
                                                <v-text-field
                                                        v-model="decisionNumber"
                                                        label="Номер решения"
                                                        outlined
                                                        dense
                                                        validate-on-blur
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <v-text-field
                                                        v-model="decisionMaker"
                                                        label="Кем принято решение"
                                                        outlined
                                                        dense
                                                        validate-on-blur
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col>
                                                <v-autocomplete
                                                        v-model="contractTypeId"
                                                        :items="contractTypes"
                                                        label="Вид договора"
                                                        outlined
                                                        dense
                                                        validate-on-blur
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col class="pl-3">
                                                <v-checkbox
                                                        v-model="indexing"
                                                        class="mt-0"
                                                        label="Индексация после добавления"
                                                        hide-details
                                                        validate-on-blur
                                                />
                                            </v-col>
                                        </v-row>
                                        <v-row class="mt-5" justify="center">
                                            <v-col cols="5">
                                                <v-btn color="primary" block>
                                                    Сохранить
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </form>
                                </v-container>
                            </v-col>
                            <v-col cols="8">
                                <AddContractObjectsInfo/>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import DatePickerMenu from '@/components/DatePickerMenu.vue';
    import { InputItem } from '@/types/common';
    import { notEmptyRule } from '@/validation/common-rules';
    import AddContractObjectsInfo from '@/components/contracts/add-contract-page/AddContractObjectsInfo.vue';
    import { getAllTenantsNames } from '@/backend/repository/tenant-repository';
    import { getContractTypes } from '@/backend/repository/contract-repository';

    @Component({
        components: { DatePickerMenu, AddContractObjectsInfo },
    })
    export default class AddContract extends Vue {
        notEmptyRule = notEmptyRule;

        tenantId: number | null = null;
        contractNumber = '';
        startDate = '';
        decisionDate = '';
        decisionNumber = '';
        decisionMaker = '';
        contractTypeId: number | null = null;
        indexing = false;

        tenants: InputItem[] = [];
        contractTypes: InputItem[] = [];

        created() {
            this.tenants = getAllTenantsNames();
            this.contractTypes = getContractTypes();
        }

        get contract() {
            return {
                tenantId: this.tenantId,
                contractNumber: this.contractNumber,
                startDate: this.startDate,
                decisionDate: this.decisionDate,
                decisionNumber: this.decisionNumber,
                decisionMaker: this.decisionMaker,
                contractTypeId: this.contractTypeId,
                indexing: this.indexing,
            };
        }
    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }
</style>
