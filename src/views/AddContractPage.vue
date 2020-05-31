<template>
    <CenteredCard>
        <v-container fluid>
            <v-row>
                <v-col cols="4">
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
                                <v-col cols="5">
                                    <v-btn color="primary" block @click="$router.back()">
                                        Отменить
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                </v-col>
                <v-col cols="8">
                    <AddContractObjectsList :items="basicObjectsItems"/>
                </v-col>
            </v-row>
        </v-container>
    </CenteredCard>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import DatePickerMenu from '@/components/DatePickerMenu.vue';
    import { InputItem } from '@/types/common';
    import { notEmptyRule } from '@/validation/common-rules';
    import AddContractObjectsList from '@/components/contracts/add-contract-page/AddContractObjectsList.vue';
    import { getAllTenantsNames } from '@/model/repository/tenant-repository';
    import { getContractTypes, saveNewContractWithObjects } from '@/model/repository/contract-repository';
    import CenteredCard from '@/components/CenteredCard.vue';
    import { BasicObjectInfo, EditObjectDto } from '@/model/types/objects-types';
    import { getModule } from 'vuex-module-decorators';
    import AddContractModule from '@/store/add-contract-module';
    import { AddContractMainInfoDto } from '@/model/types/contract-types';


    @Component({
        components: { CenteredCard, DatePickerMenu, AddContractObjectsList },
    })
    export default class AddContractPage extends Vue {
        moduleState = this.$store.state.addContract;

        notEmptyRule = notEmptyRule;

        tenantId: number | null = this.moduleState.tenantId;
        contractNumber = this.moduleState.contractNumber;
        startDate = this.moduleState.startDate;
        validity = this.moduleState.validity;
        contractTypeId: number | null = this.moduleState.contractTypeId;
        indexing = this.moduleState.indexing;

        tenants: InputItem[] = [];
        contractTypes: InputItem[] = [];

        objects: EditObjectDto[] = this.moduleState.objects;

        $refs!: {
            form: HTMLFormElement;
        };

        created() {
            this.tenants = getAllTenantsNames();
            this.contractTypes = getContractTypes();
        }

        get basicObjectsItems(): BasicObjectInfo[] {
            return this.objects.map((v) => ({
                id: v.id!,
                address: v.address,
                objectType: v.objectType,
                payment: v.payment,
                rentalRate: v.rentalRate,
            }));
        }

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


        @Watch('moduleState.objects', { deep: true })
        onObjectsChanged() {
            this.objects = this.moduleState.objects;
        }

        @Watch('contract')
        onContractChanged() {
            const module = getModule(AddContractModule, this.$store);

            module.setContractNumber(this.contractNumber);
            module.setContractTypeId(this.contractTypeId);
            module.setIndexing(this.indexing);
            module.setStartDate(this.startDate);
            module.setValidity(this.validity);
            module.setTenantId(this.tenantId);
        }

        clearAddingContract() {
            getModule(AddContractModule, this.$store).clearContract();
            this.tenantId = null;
            this.contractNumber = '';
            this.startDate = '';
            this.validity = '';
            this.contractTypeId = null;
            this.indexing = false;
        }

        save() {
            if (this.$refs.form.validate()) {
                try {
                    saveNewContractWithObjects(this.contract, this.objects);
                    // todo и переход на страницу этого договора
                    this.clearAddingContract();
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }
</style>
