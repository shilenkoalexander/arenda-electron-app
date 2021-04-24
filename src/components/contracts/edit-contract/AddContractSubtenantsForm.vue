<template>
    <v-form>
        <v-row>
            <v-col cols="6">
                <EditableTextField v-model="name" label="Имя" hide-details/>
            </v-col>
            <v-col cols="6">
                <v-autocomplete
                        v-model="businessTypeId"
                        :items="businessTypes"
                        label="Вид деятельности"
                        item-text="name"
                        item-value="id"
                        hide-details
                        outlined
                        dense
                        validate-on-blur
                />
            </v-col>
            <v-col cols="2">
                <EditableTextField v-model="square" label="Площадь" hide-details/>
            </v-col>
            <v-col cols="3">
                <DatePickerMenu v-model="startDate" label="Дата начала" hide-details/>
            </v-col>
            <v-col cols="3">
                <DatePickerMenu v-model="endDate" label="Дата действия" hide-details/>
            </v-col>
            <v-col cols="4">
                <v-btn block color="primary" @click="onSaveClick">
                    Добавить
                </v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EditableTextField from '@/components/EditableTextField.vue';
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import { getBusinessTypes } from '@/model/repository/directory-repository';
import { parseDate } from '@/utils/date-utils';
import { Directory } from '@/model/types/common-types';
import { EditSubtenantDto } from '@/model/types/tenants-types';

@Component({
        components: {
            DatePickerMenu,
            EditableTextField,
        },
    })
    export default class AddContractSubtenantsForm extends Vue {
        name = '';
        businessTypeId: number | null = null;
        square = '';
        startDate = '';
        endDate = '';

        businessTypes: Directory[] = [];

        created() {
            this.businessTypes = getBusinessTypes();
        }

        get businessType(): Directory | undefined {
            return this.businessTypes.find((area) => area.id === this.businessTypeId);
        }

        onSaveClick() {
            this.$emit('save', {
                id: null,
                name: this.name,
                businessType: this.businessType,
                square: Number.parseFloat(this.square),
                startDate: parseDate(this.startDate),
                endDate: parseDate(this.endDate),
            } as EditSubtenantDto);

            this.name = '';
            this.businessTypeId = null;
            this.square = '';
            this.startDate = '';
            this.endDate = '';
        }
    }
</script>

<style scoped>

</style>
