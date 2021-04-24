<template>
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
                        <v-autocomplete
                                v-model="businessTypeId"
                                :items="businessTypes"
                                label="Вид деятельности"
                                item-text="name"
                                item-value="id"
                                outlined
                                dense
                                validate-on-blur
                        />
                    </v-col>
                    <v-col cols="3">
                        <DatePickerMenu v-model="startDate" label="Дата начала"/>
                    </v-col>
                    <v-col cols="3">
                        <DatePickerMenu v-model="endDate" label="Срок действия"/>
                    </v-col>
                    <v-col cols="2">
                        <EditableTextField v-model="square" label="Площадь" type="number"/>
                    </v-col>
                    <v-col cols="4">
                        <v-autocomplete
                                v-model="areaId"
                                :items="areas"
                                item-text="name"
                                item-value="id"
                                label="Район"
                                outlined
                                dense
                        />
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
                        <EditableTextField v-model="payment" label="Арендная плата" type="number"/>
                    </v-col>
                    <v-col cols="6">
                        <EditableTextField v-model="rentalRate" label="Арендная ставка" type="number"/>
                    </v-col>
                </v-row>
                <v-row class="mt-25px">
                    <v-col cols="12">
                        <Header value="Экспертная оценка"/>
                    </v-col>
                    <v-col cols="6">
                        <EditableTextField v-model="expertReviewSum" label="Стоимость" type="number"/>
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
                                        v-model="name"
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
                                cols="6"
                                v-for="info in objectIndividualInformation"
                                :key="info.name"
                        >
                            <Label
                                    :label="info.name"
                                    :value="info.value"
                                    deletable
                                    @delete="onIndividualInfoDelete(info.name)"
                            />
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
        </v-row>
        <v-row class="my-3" justify="center">
            <v-col cols="2">
                <v-btn block color="primary" @click="onSaveClick">
                    Сохранить
                </v-btn>
            </v-col>
            <v-col cols="2">
                <v-btn block color="primary" @click="onCancelClick">
                    Отменить
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Header from '@/components/Header.vue';
import SubtenantsList from '@/components/contracts/contract-page/SubtenantsList.vue';
import EditableTextField from '@/components/EditableTextField.vue';
import CenteredCard from '@/components/CenteredCard.vue';
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import Label from '@/components/Label.vue';
import AddContractSubtenantsForm from '@/components/contracts/edit-contract/AddContractSubtenantsForm.vue';
import { getAreas, getBusinessTypes } from '@/model/repository/directory-repository';
import { Directory } from '@/model/types/common-types';
import { EditObjectDto, ObjectInformation } from '@/model/types/objects-types';
import { formatDateToDefaultFormat, parseDate } from '@/utils/date-utils';
import { EditSubtenantDto } from '@/model/types/tenants-types';

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
    export default class ObjectForm extends Vue {
        @Prop({
            type: Object,
            default: null,
        })
        editingObject!: EditObjectDto;

        @Prop({
            type: Date,
            required: true,
        })
        contractStartDate!: Date;

        @Prop({
            type: Date,
            required: true,
        })
        contractValidity!: Date;

        address = '';
        startDate = '';
        endDate = '';
        areaId: number | null = null;
        businessTypeId: number | null = null;
        objectType = '';
        onBalance = '';
        payment = '';
        rentalRate = '';
        expertReviewSum = '';
        expertReviewDate = '';
        objectIndividualInformation: ObjectInformation[] = [];
        subtenants: EditSubtenantDto[] = [];
        square = '';

        decisionDate = '';
        decisionMaker = '';
        decisionNumber = '';

        name = '';
        value = '';
        keyErrorMessage = '';

        areas: Directory[] = [];
        businessTypes: Directory[] = [];

        get area(): Directory | undefined {
            return this.areas.find((area) => area.id === this.areaId);
        }

        get businessType(): Directory | undefined {
            return this.businessTypes.find((area) => area.id === this.businessTypeId);
        }

        created() {
            this.areas = getAreas();
            this.businessTypes = getBusinessTypes();

            this.startDate = formatDateToDefaultFormat(this.contractStartDate);
            this.endDate = formatDateToDefaultFormat(this.contractValidity);

            if (this.editingObject) {
                this.address = this.editingObject.address;
                this.startDate = formatDateToDefaultFormat(this.editingObject.startDate);
                this.endDate = formatDateToDefaultFormat(this.editingObject.endDate);
                this.areaId = this.editingObject.area.id;
                this.businessTypeId = this.editingObject.businessType.id;
                this.objectType = this.editingObject.objectType;
                this.onBalance = this.editingObject.onBalance;
                this.payment = this.editingObject.payment.toString(10);
                this.rentalRate = this.editingObject.rentalRate.toString(10);
                this.expertReviewSum = this.editingObject.expertReviewSum.toString(10);
                this.expertReviewDate = formatDateToDefaultFormat(this.editingObject.expertReviewDate);
                this.objectIndividualInformation = [...this.editingObject.objectIndividualInformation];
                this.subtenants = [...this.editingObject.subtenants];
                this.decisionDate = formatDateToDefaultFormat(this.editingObject.decisionDate);
                this.decisionMaker = this.editingObject.decisionMaker;
                this.decisionNumber = this.editingObject.decisionNumber;
            }
        }

        onIndividualInfoAdd() {
            const isKeyExist = this.objectIndividualInformation
                .filter((v) => v.name === this.name)
                .length > 0;

            if (isKeyExist) {
                this.keyErrorMessage = 'Ключ уже существует';
                return;
            }

            this.objectIndividualInformation.push({
                id: null,
                objectId: this.editingObject ? this.editingObject.id : null,
                name: this.name.trim(),
                value: this.value.trim(),
            });

            this.name = '';
            this.value = '';
        }

        onIndividualInfoDelete(name: string) {
            this.objectIndividualInformation = this.objectIndividualInformation.filter((value) => value.name !== name);
        }

        onSubtenantAdd(subtenant: EditSubtenantDto) {
            this.subtenants.push(subtenant);
        }

        onSaveClick() {
            if (!this.area || !this.businessType) {
                return;
            }

            const newObject = {
                id: this.editingObject ? this.editingObject.id : null,
                address: this.address,
                startDate: parseDate(this.startDate),
                endDate: parseDate(this.endDate),
                area: this.area,
                businessType: this.businessType,
                payment: Number.parseFloat(this.payment),
                rentalRate: Number.parseFloat(this.rentalRate),
                onBalance: this.onBalance,
                objectType: this.objectType,
                square: this.square ? Number.parseFloat(this.square) : null,
                decisionDate: parseDate(this.decisionDate),
                decisionMaker: this.decisionMaker,
                decisionNumber: this.decisionNumber,
                expertReviewDate: parseDate(this.expertReviewDate),
                expertReviewSum: Number.parseFloat(this.expertReviewSum),
                objectIndividualInformation: this.objectIndividualInformation,
                subtenants: this.subtenants,
            } as EditObjectDto;

            this.$emit('save', newObject);
            this.clear();
        }

        onCancelClick() {
            this.$emit('cancel');
            this.clear();
        }

        clear() {
            this.address = '';
            this.startDate = formatDateToDefaultFormat(this.contractStartDate);
            this.endDate = formatDateToDefaultFormat(this.contractValidity);
            this.areaId = null;
            this.businessTypeId = null;
            this.objectType = '';
            this.onBalance = '';
            this.payment = '';
            this.rentalRate = '';
            this.expertReviewSum = '';
            this.expertReviewDate = '';
            this.objectIndividualInformation = [];
            this.subtenants = [];
            this.decisionDate = '';
            this.decisionMaker = '';
            this.decisionNumber = '';
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
