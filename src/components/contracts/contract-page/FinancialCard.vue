<template>
    <v-card>
        <v-container fluid>
            <v-row justify="space-between">
                <v-col cols="4">
                    <DatePickerMenu
                            v-if="!showAllOperations"
                            v-model="month"
                            label="Месяц"
                            hide-details
                            outlined
                            without-days
                            clearable
                    />
                </v-col>
                <v-col cols="4" class="text-right">
                    <v-btn
                            v-if="!showAllOperations"
                            block
                            color="primary lighten-1"
                            :disabled="showAllOperations"
                            @click="showAllOperations = true"
                    >
                        Показать все операции
                    </v-btn>
                    <v-btn
                            v-else
                            block
                            color="primary lighten-1"
                            @click="showAllOperations = false"
                    >
                        <v-icon>
                            mdi-arrow-left
                        </v-icon>
                        Вернуться
                    </v-btn>
                </v-col>
            </v-row>
            <v-expand-transition mode="out-in">
                <v-row v-if="showAllOperations" key="financial-table">
                    <v-col cols="12">
                        <FinancialList/>
                    </v-col>
                </v-row>
                <div v-else>
                    <v-row key="financial-short-1" class="mt-5">
                        <v-col>
                            <Label label="Начисление" value="314.35 р"/>
                        </v-col>
                        <v-col>
                            <Label label="Оплата" value="314.35 р"/>
                        </v-col>
                        <v-col>
                            <Label label="Дата начисления" value="01.01.2019"/>
                        </v-col>
                    </v-row>
                    <v-row key="financial-short-2">
                        <v-col>
                            <Label label="Задолженность" value="314.35 р"/>
                        </v-col>
                        <v-col>
                            <Label label="Пеня" value="314.35 р"/>
                        </v-col>
                        <v-col>
                            <Label label="Дата оплаты" value="01.01.2019"/>
                        </v-col>
                    </v-row>
                </div>
            </v-expand-transition>
        </v-container>
    </v-card>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import FinancialList from '@/components/contracts/contract-page/FinancialList.vue';
    import DatePickerMenu from '@/components/DatePickerMenu.vue';
    import Label from '@/components/Label.vue';

    @Component({
        components: {
            Label,
            FinancialList,
            DatePickerMenu,
        },
    })
    export default class FinancialCard extends Vue {
        showAllOperations = false;
        month = '';
    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }
</style>
