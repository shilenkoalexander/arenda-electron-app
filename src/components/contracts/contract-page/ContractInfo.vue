<template>
    <v-card>
        <v-container fluid class="pl-5">
            <v-row>
                <v-col cols="4">
                    <ContractInfoItem text="№ договора" value="111111" :text-cols="5"/>
                </v-col>
                <v-col>
                    <ContractInfoItem
                            text="Арендатор"
                            value="Государственная служба исполнения наказаний"
                            to="/"
                            :text-cols="3"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <ContractInfoItem text="Вид договора" value="Аренда нежилых помещений" :text-cols="3"/>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <ContractInfoItem text="Вид деятельности" value="Продажа жопы" :text-cols="3"/>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="4">
                    <ContractInfoItem text="Решение от" value="18.01.2018" :text-cols="6"/>
                </v-col>
                <v-col cols="2">
                    <ContractInfoItem text="№" value="271" :text-cols="6"/>
                </v-col>
                <v-col>
                    <ContractInfoItem text="в лице" value="директор, Кравец Молодец Удалец" :text-cols="2"/>
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
    export default class ContractInfo extends Vue {

    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }
</style>
