<template>
    <CenteredCard cols="11">
        <v-container fluid class="pt-2 px-10">
            <v-row class="pt-2">
                <v-col cols="8">
                    <v-row>
                        <v-col cols="12">
                            <Header value="Общая информация"/>
                        </v-col>
                        <v-col cols="6">
                            <EditableTextField v-model="address" label="Адрес"/>
                        </v-col>
                        <v-col cols="6">
                            <EditableTextField v-model="businessType" label="Вид деятельности"/>
                        </v-col>
                        <v-col cols="3">
                            <DatePickerMenu v-model="startDate" label="Дата начала"/>
                        </v-col>
                        <v-col cols="3">
                            <DatePickerMenu v-model="endDate" label="Срок действия"/>
                        </v-col>
                        <v-col cols="6">
                            <v-autocomplete v-model="areaId" :items="areas" label="Район" outlined dense/>
                        </v-col>
                        <v-col cols="6">
                            <EditableTextField v-model="objectType" label="Тип объекта"/>
                        </v-col>
                        <v-col cols="6">
                            <EditableTextField v-model="onBalance" label="На балансе"/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <EditableTextField
                                    v-model="decisionMaker"
                                    label="Кем принято решение"
                            />
                        </v-col>
                        <v-col cols="3">
                            <DatePickerMenu v-model="decisionDate" label="Решение от"/>
                        </v-col>
                        <v-col cols="3">
                            <EditableTextField
                                    v-model="decisionNumber"
                                    label="Номер решения"
                            />
                        </v-col>
                    </v-row>
                </v-col>

                <v-col cols="4">
                    <v-row>
                        <v-col cols="12">
                            <Header value="Арендная информация"/>
                        </v-col>
                        <v-col cols="6">
                            <EditableTextField v-model="payment" label="Арендная плата"/>
                        </v-col>
                        <v-col cols="6">
                            <EditableTextField v-model="rentalRate" label="Арендная ставка"/>
                        </v-col>
                    </v-row>
                    <v-row class="mt-25px">
                        <v-col cols="12">
                            <Header value="Экспертная оценка"/>
                        </v-col>
                        <v-col cols="6">
                            <EditableTextField v-model="expertReviewSum" label="Стоимость"/>
                        </v-col>
                        <v-col cols="6">
                            <DatePickerMenu v-model="expertReviewDate" label="Дата"/>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="6">
                    <v-row class="pb-3">
                        <v-col cols="12">
                            <Header value="Индивидуальные данные"/>
                        </v-col>
                        <v-col cols="12" class="mt-3">
                            <v-row>
                                <v-col>
                                    <EditableTextField
                                            v-model="key"
                                            label="Ключ"
                                            :error-messages="keyErrorMessage || null"
                                            @input="keyErrorMessage = ''"
                                    />
                                </v-col>
                                <v-col>
                                    <EditableTextField v-model="value" label="Значение"/>
                                </v-col>
                                <v-col>
                                    <v-btn block color="primary" @click="onIndividualInfoAdd">
                                        Добавить
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                        <template v-if="objectIndividualInformation.length > 0">
                            <v-col
                                    cols="4"
                                    v-for="info in objectIndividualInformation"
                                    :key="info.key"
                            >
                                <Label :label="info.key" :value="info.value"/>
                            </v-col>
                        </template>
                        <v-col v-else cols="12">
                            <p class="mb-0 text-center">Нет индивидуальных данных</p>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="6">
                    <v-row class="pb-3">
                        <v-col cols="12">
                            <Header value="Субарендаторы"/>
                        </v-col>
                        <v-col cols="12" class="mt-4px">
                            <AddContractSubtenantsForm @save="onSubtenantAdd"/>
                        </v-col>
                        <v-col cols="12">
                            <SubtenantsList :items="subtenants"/>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col offset="5" cols="2" class="my-3">
                    <v-btn block color="primary" @click="onSaveClick">
                        Сохранить
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </CenteredCard>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import Header from '@/components/Header.vue';
    import SubtenantsList from '@/components/contracts/contract-page/SubtenantsList.vue';
    import EditableTextField from '@/components/EditableTextField.vue';
    import CenteredCard from '@/components/CenteredCard.vue';
    import DatePickerMenu from '@/components/DatePickerMenu.vue';
    import { AssociativeArrayItem, InputItem } from '@/types/common';
    import Label from '@/components/Label.vue';
    import { Subtenant } from '@/types/tenants';
    import AddContractSubtenantsForm from '@/components/contracts/add-contract-page/AddContractSubtenantsForm.vue';
    import { AddObjectDto } from '@/types/objects';
    import { parseDate } from '@/utils/date-utils';
    import { getAreas } from '@/backend/repository/directory-repository';
    import AddContractModule from './../../store/add-contract-module';
    import { getModule } from 'vuex-module-decorators';

    @Component({
        components: {
            AddContractSubtenantsForm,
            Label,
            DatePickerMenu,
            CenteredCard,
            Header,
            EditableTextField,
            SubtenantsList,
        },
    })
    export default class AddObject extends Vue {
        address = '';
        startDate = '';
        endDate = '';
        areaId: number | null = null;
        businessType = '';
        objectType = '';
        onBalance = '';
        payment = '';
        rentalRate = '';
        expertReviewSum = '';
        expertReviewDate = '';
        objectIndividualInformation: AssociativeArrayItem[] = [];
        subtenants: Subtenant[] = [];

        decisionDate = '';
        decisionMaker = '';
        decisionNumber = '';

        key = '';
        value = '';
        keyErrorMessage = '';

        areas: InputItem[] = [];

        created() {
            this.areas = getAreas();
        }

        onIndividualInfoAdd() {
            const isKeyExist = this.objectIndividualInformation
                .filter((v) => v.key === this.key)
                .length > 0;

            if (isKeyExist) {
                this.keyErrorMessage = 'Ключ уже существует';
                return;
            }

            this.objectIndividualInformation.push({
                key: this.key.trim(),
                value: this.value.trim(),
            });

            this.key = '';
            this.value = '';
        }

        onSubtenantAdd(subtenant: Subtenant) {
            this.subtenants.push(subtenant);
        }

        onSaveClick() {
            getModule(AddContractModule, this.$store).addObject({
                address: this.address,
                startDate: parseDate(this.startDate),
                endDate: parseDate(this.endDate),
                areaId: this.areaId,
                businessType: this.businessType,
                payment: Number.parseFloat(this.payment),
                rentalRate: Number.parseFloat(this.rentalRate),
                onBalance: this.onBalance,
                objectType: this.objectType,
                decisionDate: parseDate(this.decisionDate),
                decisionMaker: this.decisionMaker,
                decisionNumber: this.decisionNumber,
                expertReviewDate: parseDate(this.expertReviewDate),
                expertReviewSum: Number.parseFloat(this.expertReviewSum),
                objectIndividualInformation: this.objectIndividualInformation,
                subtenants: this.subtenants,
            } as AddObjectDto);
        }

    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }

    .mt-25px {
        margin-top: 25px;
    }

    .mt-4px {
        margin-top: 4px;
    }
</style>
