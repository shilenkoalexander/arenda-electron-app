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
                        hide-details
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
    import { Subtenant } from '@/types/tenants';
    import { InputItem } from '@/types/common';
    import { getBusinessTypes } from '@/backend/repository/directory-repository';

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

        businessTypes: InputItem[] = [];

        created() {
            this.businessTypes = getBusinessTypes();
        }

        onSaveClick() {
            this.$emit('save', {
                name: this.name,
                businessTypeId: this.businessTypeId,
                square: Number.parseFloat(this.square),
                startDate: this.startDate,
                endDate: this.endDate,
            } as Subtenant);

            this.name = '';
            this.businessTypeId = '';
            this.square = '';
            this.startDate = '';
            this.endDate = '';
        }
    }
</script>

<style scoped>

</style>
