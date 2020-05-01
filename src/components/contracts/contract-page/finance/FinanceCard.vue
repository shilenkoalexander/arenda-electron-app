<template>
    <v-card class="finance-card">
        <v-container fluid class="px-5">
            <v-row class="pb-3">
                <v-col cols="4">
                    <v-btn
                        color="primary"
                        block
                        @click="onAddPaymentClicked"
                    >
                        Внести оплату
                    </v-btn>
                </v-col>
                <v-col cols="4">
                    <v-btn
                        :disabled="!isAdjustmentEditable"
                        color="primary"
                        block
                        @click="onEditAdjustmentClicked"
                    >
                        Внести корректировку
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
                            <v-card
                                flat
                                tile
                            >
                                <v-card-text>
                                    <FinanceList v-if="financePeriods.length > 0" :items="financePeriods"/>
                                    <p v-else class="mb-0">Записи отсутствуют</p>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card
                                flat
                                tile
                            >
                                <v-card-text>
                                    <PaymentsList :contract-id="contractId"/>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card
                                flat
                                tile
                            >
                                <v-card-text>
                                    <IndexingList :contract-id="contractId"/>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card
                                flat
                                tile
                            >
                                <v-card-text>
                                    <ContractExtensionsList :contract-id="contractId"/>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs>
                </v-col>
            </v-row>

        </v-container>
        <EditAdjustmentDialog ref="editAdjustmentDialog" @update="update"/>
        <AddPaymentDialog ref="addPaymentDialog" @update="update"/>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import FinanceList from '@/components/contracts/contract-page/finance/FinanceList.vue';
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import Label from '@/components/Label.vue';
import { FinancePeriod } from '@/types/finance';
import EditableTextField from '@/components/EditableTextField.vue';
import Period from '@/backend/utils/period';
import EditAdjustmentDialog from '@/components/contracts/contract-page/dialogs/EditAdjustmentDialog.vue';
import AddPaymentDialog from '@/components/contracts/contract-page/dialogs/AddPaymentDialog.vue';
import PaymentsList from '@/components/contracts/contract-page/finance/PaymentsList.vue';
import IndexingList from '@/components/contracts/contract-page/finance/IndexingList.vue';
import ContractExtensionsList from '@/components/contracts/contract-page/finance/ContractExtensionsList.vue';

// todo добавить обновление таблиц. проверить lazy и кэш в табах
@Component({
    components: {
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

    currentPeriod = Period.currentPeriod();

    $refs!: {
        form: HTMLFormElement;
        editAdjustmentDialog: EditAdjustmentDialog;
        addPaymentDialog: AddPaymentDialog;
    };

    get isAdjustmentEditable(): boolean {
        return this.financePeriods.find(
            (value) => value.period.isSamePeriod(this.currentPeriod),
        ) !== undefined;
    }

    get calculatedPeriods(): Period[] {
        return this.financePeriods.map((value) => value.period);
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

    update() {
        this.$emit('update');
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
