<template>
    <v-card>
        <v-container fluid class="pl-5">
            <v-row>
                <v-col cols="3">
                    <TextValueItem text="№ договора" value="111111"/>
                </v-col>
                <v-col>
                    <TextValueItem
                            text="Арендатор"
                            value="Государственная служба исполнения наказаний"
                            to="/"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <TextValueItem text="Вид договора" value="Аренда нежилых помещений"/>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <TextValueItem text="Вид деятельности" value="Продажа жопы" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="4">
                    <TextValueItem text="Решение от" value="18.01.2018"/>
                </v-col>
                <v-col cols="2">
                    <TextValueItem text="№" value="271"/>
                </v-col>
                <v-col>
                    <TextValueItem text="в лице" value="директор, Кравец Молодец Удалец"/>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import TextValueItem from '@/components/TextValueItem.vue';

    @Component({
        components: {
            TextValueItem,
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
