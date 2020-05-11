<template>
    <v-card class="elevation-1">
        <v-container fluid class="px-5 finance-card">
            <v-row class="pb-3">
                <v-col cols="3">
                    <v-btn
                            color="primary"
                            block
                            @click="onAddPaymentClicked"
                    >
                        Оплата
                    </v-btn>
                </v-col>
                <v-col cols="3">
                    <v-btn
                            :disabled="!isAdjustmentEditable"
                            color="primary"
                            block
                            @click="onEditAdjustmentClicked"
                    >
                        Корректировка
                    </v-btn>
                </v-col>
                <v-col cols="3">
                    <v-btn
                            color="primary"
                            block
                            @click="onAddContractExtensionClick"
                    >
                        Доп. соглашение
                    </v-btn>
                </v-col>
                <v-col cols="3">
                    <v-btn
                            color="primary"
                            block
                            @click="onIndexingChangeClick"
                    >
                        {{ indexingText }}
                    </v-btn>
                </v-col>
            </v-row>
            <v-divider/>
            <v-row>
                <v-col>
                    <v-tabs>
                        <v-tabs-slider></v-tabs-slider>
                        <v-tab>
                            Карточка
                        </v-tab>
                        <v-tab>
                            Оплаты
                        </v-tab>
                        <v-tab>
                            Индексация
                        </v-tab>
                        <v-tab>
                            Доп. соглашения
                        </v-tab>

                        <v-tab-item>
                            <v-card flat tile>
                                <v-card-text>
                                    <FinanceList :items="financePeriods"/>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card flat tile>
                                <v-card-text>
                                    <PaymentsList :contract-id="contractId" ref="paymentsList"/>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card flat tile>
                                <v-card-text>
                                    <IndexingList :contract-id="contractId" :items="indexingSigns"/>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card flat tile>
                                <v-card-text>
                                    <ContractExtensionsList :items="contractExtensions"/>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs>
                </v-col>
            </v-row>

        </v-container>
        <EditAdjustmentDialog ref="editAdjustmentDialog" @update="update"/>
        <AddPaymentDialog ref="addPaymentDialog" @update="update"/>
        <AddContractExtensionDialog ref="addContractExtensionDialog" @save="onSaveContractExtension"/>
    </v-card>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import FinanceList from '@/components/contracts/contract-page/finance/FinanceList.vue';
    import DatePickerMenu from '@/components/DatePickerMenu.vue';
    import Label from '@/components/Label.vue';
    import { FinancePeriod, IndexingSign } from '@/types/finance';
    import EditableTextField from '@/components/EditableTextField.vue';
    import Period from '@/backend/utils/period';
    import EditAdjustmentDialog from '@/components/contracts/contract-page/dialogs/EditAdjustmentDialog.vue';
    import AddPaymentDialog from '@/components/contracts/contract-page/dialogs/AddPaymentDialog.vue';
    import PaymentsList from '@/components/contracts/contract-page/finance/PaymentsList.vue';
    import IndexingList from '@/components/contracts/contract-page/finance/IndexingList.vue';
    import ContractExtensionsList from '@/components/contracts/contract-page/finance/ContractExtensionsList.vue';
    import AddContractExtensionDialog
        from '@/components/contracts/contract-page/dialogs/AddContractExtensionDialog.vue';
    import { FullContractExtension } from '@/types/contracts';
    import { addContractExtension } from '@/backend/service/finance-service';
    import { getIndexingSigns } from '@/backend/repository/finance-repository';
    import logger from 'vuex/dist/logger';

    @Component({
        components: {
            AddContractExtensionDialog,
            ContractExtensionsList,
            IndexingList,
            PaymentsList,
            AddPaymentDialog,
            EditAdjustmentDialog,
            EditableTextField,
            Label,
            FinanceList,
            DatePickerMenu,
        },
    })
    export default class FinanceCard extends Vue {
        @Prop({
            type: Number,
            required: true,
        })
        contractId!: number;

        @Prop({
            type: Array,
            required: true,
        })
        financePeriods!: FinancePeriod[];

        @Prop({
            type: Date,
            required: true,
        })
        calculationStartDate!: Date;

        @Prop({
            type: Date,
            required: true,
        })
        validity!: Date;

        @Prop({
            type: Array,
            required: true,
        })
        contractExtensions!: FullContractExtension[];

        indexingSigns: IndexingSign[] = [];
        currentPeriod = Period.currentPeriod();

        $refs!: {
            form: HTMLFormElement;
            editAdjustmentDialog: EditAdjustmentDialog;
            addPaymentDialog: AddPaymentDialog;
            paymentsList: PaymentsList;
            contractExtensionsList: ContractExtensionsList;
            indexingList: IndexingList;
            addContractExtensionDialog: AddContractExtensionDialog;
        };

        get isAdjustmentEditable(): boolean {
            return this.financePeriods.find(
                (value) => value.period.isSamePeriod(this.currentPeriod),
            ) !== undefined;
        }

        get calculatedPeriods(): Period[] {
            return this.financePeriods.map((value) => value.period);
        }

        get indexingText() {
            return this.indexingSigns[0].indexing ? 'Откл. индексацию' : 'Вкл. индексацию';
        }

        created() {
            // this.updateContractExtensions();
            this.updateIndexingSigns();
        }

        onEditAdjustmentClicked() {
            const currentFinancePeriod = this.financePeriods
                .find((value) => value.period.isSamePeriod(this.currentPeriod));

            if (currentFinancePeriod) {
                this.$refs.editAdjustmentDialog.open(this.contractId, currentFinancePeriod.adjustments);
            }
        }

        onAddPaymentClicked() {
            this.$refs.addPaymentDialog.open(
                this.contractId,
                Period.ofDate(this.calculationStartDate),
                this.calculatedPeriods,
            );
        }

        onAddContractExtensionClick() {
            this.$refs.addContractExtensionDialog.open(
                this.contractId,
                this.calculationStartDate,
                this.validity,
                this.contractExtensions,
            );
        }

        onIndexingChangeClick() {
            console.log('empty');
        }

        update() {
            this.$emit('update-periods');
            if (this.$refs.paymentsList) {
                this.$refs.paymentsList.update();
            }
        }

        onSaveContractExtension(value: FullContractExtension) {
            addContractExtension(this.contractId, value);
            this.updateContractExtensions();
        }

        updateContractExtensions() {
            this.$emit('update-extensions');
        }

        updateIndexingSigns() {
            this.indexingSigns = getIndexingSigns(this.contractId, true);
        }

    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }

    .finance-card {
        max-height: 65vh;
    }
</style>
