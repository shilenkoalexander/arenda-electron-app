<template>
    <v-card>
        <v-card-title class="primary lighten-2 white--text text--darken-3">
            <v-icon class="mr-3" color="white">mdi-home-city</v-icon>
            {{ item.address }}
        </v-card-title>

        <v-container fluid class="pt-0">
            <v-row>
                <v-col cols="12">
                    <InfoBlock class="mt-2">
                        <v-row>
                            <v-col cols="4">
                                <TextValueItem text="Дата начала"
                                               :value="formatToFriendly(item.startDate)"/>
                            </v-col>
                            <v-col cols="4">
                                <TextValueItem text="Срок действия"
                                               :value="formatToFriendly(item.endDate)"/>
                            </v-col>
                            <v-col cols="4">
                                <TextValueItem text="Район" :value="item.area"/>
                            </v-col>
                            <v-col cols="12">
                                <TextValueItem text="Вид деятельности" :value="item.businessType"/>
                            </v-col>
                            <v-col cols="6">
                                <TextValueItem text="Тип объекта" :value="item.objectType"/>
                            </v-col>
                            <v-col cols="6">
                                <TextValueItem text="На балансе" :value="item.onBalance"/>
                            </v-col>
                        </v-row>
                    </InfoBlock>
                    <InfoBlock class="mt-2">
                        <v-row>
                            <v-col cols="12">
                                <TextValueItem text="Индивидуальные данные" header/>
                            </v-col>
                            <v-col cols="12" v-for="info in item.objectIndividualInformation"
                                   :key="info.key">
                                <TextValueItem :text="info.key" :value="info.value"/>
                            </v-col>
                        </v-row>
                    </InfoBlock>
                </v-col>
                <v-col cols="12">
                    <InfoBlock>
                        <v-row>
                            <v-col cols="6">
                                <TextValueItem text="Арендная плата"
                                               :value="item.payment.toString(10) + ' р.'"/>
                            </v-col>
                            <v-col cols="6">
                                <TextValueItem text="Арендная ставка"
                                               :value="item.rentalRate.toString(10) + '%'"/>
                            </v-col>
                        </v-row>
                    </InfoBlock>
                    <InfoBlock class="mt-2">
                        <v-row>
                            <v-col cols="12">
                                <TextValueItem text="Экспертная оценка" header/>
                            </v-col>
                            <v-col cols="6">
                                <TextValueItem text="Сумма"
                                               :value="item.expertReviewSum.toString(10) + ' р.'"/>
                            </v-col>
                            <v-col cols="6">
                                <TextValueItem text="Дата"
                                               :value="formatToFriendly(item.expertReviewDate)"/>
                            </v-col>
                        </v-row>
                    </InfoBlock>
                    <template>
                        <v-row>
                            <v-col>
                                <TextValueItem text="Субарендаторы" header/>
                            </v-col>
                            <v-col cols="12">
                                <SubtenantsList :items="item.subtenants"/>
                            </v-col>
                        </v-row>
                    </template>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import TextValueItem from '@/components/TextValueItem.vue';
    import { FullObjectDetails } from '@/types/objects';
    import { formatToFriendly } from '@/utils/date-utils';
    import SubtenantsList from '@/components/contracts/contract-page/SubtenantsList.vue';
    import InfoBlock from '@/components/InfoBlock.vue';

    @Component({
        components: {
            TextValueItem,
            SubtenantsList,
            InfoBlock,
        },
    })
    export default class ObjectDetailsCard extends Vue {
        item: FullObjectDetails = {
            id: 1,
            address: 'ул. Пушкина дом Колотушкина',
            area: 'Центрально-Городской',
            businessType: 'Размещение аптек, которые реализуют готовые лекарства',
            dispositionDate: new Date(),
            dispositionMaker: 'Юрьев Сергей Валентинович',
            dispositionNumber: '123654',
            startDate: new Date(),
            endDate: new Date(),
            objectType: 'Одноэтажное здание',
            payment: 300.3,
            onBalance: 'ЖК Пушкинский ДонецкМакеевка',
            rentalRate: 10,
            expertReviewDate: new Date(),
            expertReviewSum: 1526.33,
            subtenants: [
                {
                    name: 'Садогурский Барух Джавович',
                    businessType: 'Продажа алкогольной продукции',
                    startDate: new Date(),
                    endDate: new Date(),
                    square: 300.3,
                },
                {
                    name: 'Садогурский Барух Джавович',
                    businessType: 'Продажа алкогольной продукции',
                    startDate: new Date(),
                    endDate: new Date(),
                    square: 300.3,
                },
            ],
            objectIndividualInformation: [
                {
                    key: 'Площадь',
                    value: '326.3',
                },
                {
                    key: 'Количество комнат',
                    value: '3',
                },
                {
                    key: 'Количество окон',
                    value: '10',
                },
            ],
        };

        formatToFriendly = formatToFriendly;
    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }
</style>
