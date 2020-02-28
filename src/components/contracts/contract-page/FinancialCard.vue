<template>
    <v-card>
        <v-container fluid>
            <v-row>
                <v-col cols="3">
                    <v-text-field label="Месяц" hide-details outlined dense/>
                </v-col>
                <v-col cols="3" offset="6">
                    <v-btn block color="primary lighten-1">Все операции</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <ContractInfoItem text="Начисление" value="314.35 р"/>
                </v-col>
                <v-col>
                    <ContractInfoItem text="Оплата" value="314.35 р"/>
                </v-col>
                <v-col>
                    <ContractInfoItem text="Дата начисления" value="01.01.2019"/>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <ContractInfoItem text="Задолженность" value="314.35 р"/>
                </v-col>
                <v-col>
                    <ContractInfoItem text="Пеня" value="314.35 р"/>
                </v-col>
                <v-col>
                    <ContractInfoItem text="Дата оплаты" value="01.01.2019"/>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ContractInfoItem from '@/components/contracts/contract-page/ContractInfoItem.vue';

@Component({
    components: {
        ContractInfoItem,
    },
})
export default class FinancialCard extends Vue {

}
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }
</style>
