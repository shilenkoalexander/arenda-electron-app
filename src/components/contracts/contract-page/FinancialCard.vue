<template>
    <v-card>
        <v-container fluid>
            <v-expand-transition mode="out-in">
                <div v-if="!showAllOperations">
                    <v-row key="financial-control">
                        <v-col cols="3">
                            <v-text-field label="Месяц" hide-details outlined dense/>
                        </v-col>
                        <v-col cols="3" offset="6">
                            <v-btn
                                    block
                                    color="primary lighten-1"
                                    :disabled="showAllOperations"
                                    @click="showAllOperations = true"
                            >
                                Показать все операции
                            </v-btn>
                        </v-col>
                    </v-row>

                    <v-row key="financial-short-1">
                        <v-col>
                            <TextValueItem text="Начисление" value="314.35 р"/>
                        </v-col>
                        <v-col>
                            <TextValueItem text="Оплата" value="314.35 р"/>
                        </v-col>
                        <v-col>
                            <TextValueItem text="Дата начисления" value="01.01.2019"/>
                        </v-col>
                    </v-row>
                    <v-row key="financial-short-2">
                        <v-col>
                            <TextValueItem text="Задолженность" value="314.35 р"/>
                        </v-col>
                        <v-col>
                            <TextValueItem text="Пеня" value="314.35 р"/>
                        </v-col>
                        <v-col>
                            <TextValueItem text="Дата оплаты" value="01.01.2019"/>
                        </v-col>
                    </v-row>
                </div>
                <v-row v-else key="financial-table">
                    <v-col>
                        <FinancialList/>
                    </v-col>
                </v-row>
            </v-expand-transition>
        </v-container>
    </v-card>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import TextValueItem from '@/components/TextValueItem.vue';
    import FinancialList from '@/components/contracts/contract-page/FinancialList.vue';

    @Component({
        components: {
            TextValueItem,
            FinancialList,
        },
    })
    export default class FinancialCard extends Vue {
        showAllOperations = false;
    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }
</style>
