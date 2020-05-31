<template>
    <v-container fluid>
        <v-form ref="form">
            <v-row>
                <v-col>
                    <p class="title text-center">Информация о договоре</p>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-autocomplete
                            v-model="tenantId"
                            :items="tenants"
                            :rules="[notEmptyRule]"
                            label="Арендатор"
                            outlined
                            dense
                            validate-on-blur
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                            v-model="contractNumber"
                            :rules="[notEmptyRule]"
                            label="Номер договора"
                            outlined
                            validate-on-blur
                            dense
                    />
                </v-col>

            </v-row>
            <v-row>
                <v-col>
                    <DatePickerMenu
                            v-model="startDate"
                            :rules="[notEmptyRule]"
                            label="Дата заключения"
                    />
                </v-col>
                <v-col>
                    <DatePickerMenu
                            v-model="validity"
                            :rules="[notEmptyRule]"
                            label="Действителен до"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-autocomplete
                            v-model="contractTypeId"
                            :items="contractTypes"
                            label="Вид договора"
                            outlined
                            dense
                            validate-on-blur
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pl-3">
                    <v-checkbox
                            v-model="indexing"
                            class="mt-0"
                            label="Индексация после добавления"
                            hide-details
                            validate-on-blur
                    />
                </v-col>
            </v-row>
            <v-row class="mt-5" justify="center">
                <v-col cols="5">
                    <v-btn color="primary" block @click="save">
                        Сохранить
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>
    </v-container>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { notEmptyRule } from '@/validation/common-rules';
    import { InputItem } from '@/types/common';
    import { getAllTenantsNames } from '@/model/repository/tenant-repository';
    import { getContractTypes } from '@/model/repository/contract-repository';
    import { AddContractMainInfoDto } from '@/model/types/contract-types';
    import DatePickerMenu from '@/components/DatePickerMenu.vue';

    @Component({
    components: {
        DatePickerMenu,
    },
})
export default class EditContractForm extends Vue {

    get contract(): AddContractMainInfoDto {
        return {
            tenantId: this.tenantId,
            contractNumber: this.contractNumber,
            startDate: this.startDate,
            validity: this.validity,
            contractTypeId: this.contractTypeId,
            indexing: this.indexing,
        };
    }
    notEmptyRule = notEmptyRule;

    tenantId: number | null = null;
    contractNumber = '';
    startDate = '';
    validity = '';
    contractTypeId: number | null = null;
    indexing = false;

    tenants: InputItem[] = [];
    contractTypes: InputItem[] = [];

    $refs!: {
        form: HTMLFormElement;
    };

    created() {
        this.tenants = getAllTenantsNames();
        this.contractTypes = getContractTypes();
    }

    clear() {
        this.tenantId = null;
        this.contractNumber = '';
        this.startDate = '';
        this.validity = '';
        this.contractTypeId = null;
        this.indexing = false;
    }

    save() {
        if (this.$refs.form.validate()) {
            this.$emit('save', this.contract);
            this.clear();
        }
    }
}
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }
</style>
