<template>
    <v-form>
        <v-row>

            <v-col cols="6">
                <EditableTextField v-model="name" label="Имя" hide-details/>
            </v-col>
            <v-col cols="6">
                <EditableTextField v-model="businessType" label="Вид деятельности" hide-details/>
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
    import { parseDate } from '@/utils/date-utils';

    @Component({
        components: {
            DatePickerMenu,
            EditableTextField,
        },
    })
    export default class AddContractSubtenantsForm extends Vue {
        name = '';
        businessType = '';
        square = '';
        startDate = '';
        endDate = '';

        onSaveClick() {
            this.$emit('save', {
                name: this.name,
                businessType: this.businessType,
                square: Number.parseFloat(this.square),
                startDate: parseDate(this.startDate),
                endDate: parseDate(this.endDate),
            } as Subtenant);

            this.name = '';
            this.businessType = '';
            this.square = '';
            this.startDate = '';
            this.endDate = '';
        }
    }
</script>

<style scoped>

</style>
