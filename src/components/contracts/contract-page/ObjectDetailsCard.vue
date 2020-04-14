<template>
    <v-card>
        <v-card-title class="primary lighten-2 white--text text--darken-3">
            <v-icon class="mr-3" color="white">mdi-home-city</v-icon>
            <p class="mb-0 font-regular">{{ item.address }}</p>
        </v-card-title>

        <v-container fluid class="pt-0 info-container">
            <v-row>
                <v-col cols="12">
                    <InfoBlock class="mt-2">
                        <v-row>
                            <v-col cols="3">
                                <Label label="Дата начала"
                                       :value="item.startDate"
                                />
                            </v-col>
                            <v-col cols="3">
                                <Label label="Срок действия"
                                       :value="item.endDate"/>
                            </v-col>
                            <v-col cols="6">
                                <Label label="Район" :value="item.area"/>
                            </v-col>
                            <v-col cols="12">
                                <Label label="Вид деятельности" :value="item.businessType"/>
                            </v-col>
                            <v-col cols="6">
                                <Label label="Тип объекта" :value="item.objectType"/>
                            </v-col>
                            <v-col cols="6">
                                <Label label="На балансе" :value="item.onBalance"/>
                            </v-col>
                        </v-row>
                    </InfoBlock>
                </v-col>

                <v-col cols="6">
                    <InfoBlock>
                        <v-row>
                            <v-col cols="12">
                                <Header value="Арендная информация"/>
                            </v-col>
                            <v-col cols="6">
                                <Label label="Арендная плата"
                                       :value="item.payment.toString(10) + ' р.'"/>
                            </v-col>
                            <v-col cols="6">
                                <Label label="Арендная ставка"
                                       :value="item.rentalRate.toString(10) + '%'"/>
                            </v-col>
                        </v-row>
                    </InfoBlock>
                    <InfoBlock>
                        <v-row>
                            <v-col cols="12">
                                <Header value="Экспертная оценка"/>
                            </v-col>
                            <v-col cols="6">
                                <Label label="Стоимость"
                                       :value="item.expertReviewSum.toString(10) + ' р.'"/>
                            </v-col>
                            <v-col cols="6">
                                <Label label="Дата"
                                       :value="formatToFriendly(item.expertReviewDate)"/>
                            </v-col>
                        </v-row>
                    </InfoBlock>
                </v-col>
                <v-col cols="6">
                    <InfoBlock>
                        <v-row>
                            <v-col cols="12">
                                <Header value="Индивидуальные данные"/>
                            </v-col>
                            <v-col cols="12"
                                   v-for="info in item.objectIndividualInformation"
                                   :key="info.key"
                            >
                                <Label :label="info.key" :value="info.value"/>
                            </v-col>
                        </v-row>
                    </InfoBlock>
                </v-col>
                <v-col cols="12">
                    <template>
                        <v-row>
                            <v-col>
                                <Header value="Субарендаторы"/>
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
    import { FullObjectDetails } from '@/types/objects';
    import { formatToFriendly } from '@/utils/date-utils';
    import SubtenantsList from '@/components/contracts/contract-page/SubtenantsList.vue';
    import InfoBlock from '@/components/InfoBlock.vue';
    import Label from '@/components/Label.vue';
    import Header from '@/components/Header.vue';

    @Component({
        components: {
            Header,
            Label,
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
            decisionDate: '2020-01-01',
            decisionMaker: 'Юрьев Сергей Валентинович',
            decisionNumber: '123654',
            startDate: '2020-01-01',
            endDate: '2020-01-01',
            objectType: 'Одноэтажное здание',
            payment: 300.3,
            onBalance: 'ЖК Пушкинский ДонецкМакеевка',
            rentalRate: 10,
            expertReviewDate: '2020-01-01',
            expertReviewSum: 1526.33,
            subtenants: [
                {
                    name: 'Садогурский Барух Джавович',
                    businessTypeId: 1,
                    startDate: formatToFriendly('2020-01-01'),
                    endDate: formatToFriendly('2020-01-01'),
                    square: 300.3,
                },
                {
                    name: 'Садогурский Барух Джавович',
                    businessTypeId: 1,
                    startDate: formatToFriendly('2020-01-01'),
                    endDate: formatToFriendly('2020-01-01'),
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
