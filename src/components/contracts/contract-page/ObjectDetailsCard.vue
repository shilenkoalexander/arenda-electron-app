<template>
    <v-card>
        <v-card-title class="primary lighten-2 white--text text--darken-3">
            <v-container fluid class="pa-0">
                <v-row>
                    <v-col cols="4" class="py-0 pl-3 d-flex">
                        <v-icon class="mr-3" color="white">mdi-home-city</v-icon>
                        <p class="mb-0 font-regular">{{ item.address }}</p>
                    </v-col>
                    <v-col cols="8" class="py-0 pr-3 d-flex justify-end">
                        <v-btn color="white" text @click="onEditObjectClick">
                            <v-icon class="mr-2">
                                mdi-pencil
                            </v-icon>
                            Редактировать
                        </v-btn>
                        <v-btn color="white" text>
                            <v-icon class="mr-2">
                                mdi-text-box-remove-outline
                            </v-icon>
                            Расторгнуть
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-title>

        <v-container fluid class="pt-0 info-container">
            <v-row>
                <v-col cols="5">
                    <InfoBlock>
                        <v-row>
                            <v-col cols="12">
                                <Header value="Основная информация"/>
                            </v-col>
                            <v-col cols="3">
                                <Label label="Дата начала"
                                       :value="formatToFriendly(item.startDate)"
                                />
                            </v-col>
                            <v-col cols="3">
                                <Label label="Срок действия"
                                       :value="formatToFriendly(item.endDate)"/>
                            </v-col>
                            <v-col cols="3">
                                <Label label="Дата расторжения"
                                       :value="formatToFriendly(item.startDate)"
                                />
                            </v-col>
                            <v-col cols="6">
                                <Label label="Район" :value="item.area.name"/>
                            </v-col>
                            <v-col cols="6">
                                <Label label="Вид деятельности" :value="item.businessType.name"/>
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

                <v-col cols="4">
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
                <v-col cols="3">
                    <InfoBlock>
                        <v-row>
                            <v-col cols="12">
                                <Header value="Индивидуальные данные"/>
                            </v-col>
                            <v-col cols="12"
                                   v-for="info in item.objectIndividualInformation"
                                   :key="info.name"
                            >
                                <Label :label="info.name" :value="info.value"/>
                            </v-col>
                        </v-row>
                    </InfoBlock>
                </v-col>
                <v-col cols="12">
                    <v-row>
                        <v-col class="pt-0">
                            <Header value="Субарендаторы"/>
                        </v-col>
                        <v-col cols="12" class="pt-0">
                            <SubtenantsList :items="item.subtenants"/>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { FullObjectDetailsWithSubtenants } from '@/backend/types/objects-types';
    import { formatDateToFriendly } from '@/utils/date-utils';
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
        @Prop({
            type: Object,
            required: true,
        })
        item!: FullObjectDetailsWithSubtenants;

        onEditObjectClick() {
            this.$emit('edit', this.item.id);
        }

        formatToFriendly(date: Date): string {
            return formatDateToFriendly(date);
        }
    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }
</style>
