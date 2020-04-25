<template>
    <v-card>
        <v-container fluid class="px-5 fill-height">
            <v-row>
                <v-col cols="3">
                    <Label label="№ договора" :value="mainInfo.contractNumber"/>
                </v-col>
                <v-col>
                    <Label
                            label="Арендатор"
                            :value="mainInfo.tenantName"
                            to="/"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <Label label="Вид договора" :value="mainInfo.contractType"/>
                </v-col>
            </v-row>
            <!--<v-row>
                <v-col>
                    <Label label="Вид деятельности" value="Продажа жопы"/>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="4">
                    <Label label="Решение от" value="18.01.2018"/>
                </v-col>
                <v-col cols="2">
                    <Label label="№" value="271"/>
                </v-col>
                <v-col>
                    <Label label="в лице" value="директор, Кравец Молодец Удалец"/>
                </v-col>
            </v-row>-->
        </v-container>
    </v-card>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import Label from '@/components/Label.vue';
    import { ContractPageMainInfo } from '@/types/contracts';

    // todo : общая сумма платежа
    // todo: поля "дата заключения" и "дата начала действия" - разные вещи (еще дата начала расчета нужна)

    @Component({
        components: {
            Label,
        },
    })
    export default class ContractInfo extends Vue {
        @Prop({
            type: Object,
            required: true,
        })
        mainInfo!: ContractPageMainInfo;
    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }
</style>
