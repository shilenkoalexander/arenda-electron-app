<template>
    <v-dialog
        v-model="dialog"
        width="40%"
    >
        <v-card>
            <v-card-title
                class="headline primary white--text py-3"
                primary-title
            >
                Внесение оплаты
            </v-card-title>

            <v-card-text>
                <v-form ref="form">
                    <v-container fluid class="pb-0">
                        <v-row justify="center" class="mt-3">
                            <v-col cols="4">
                                <EditableTextField
                                    class="pb-0"
                                    v-model="paymentSum"
                                    :rules="[correctFloatRule]"
                                    type="number"
                                    label="Сумма оплаты"
                                />
                            </v-col>
                            <v-col cols="4">
                                <DatePickerMenu
                                    v-model="paymentDate"
                                    :rules="[notEmptyRule]"
                                    :min-date="paymentDateMinDate"
                                    :max-date="paymentDateMaxDate"
                                    label="Дата оплаты"
                                />
                            </v-col>
                            <v-col cols="4">
                                <DatePickerMenu
                                    v-model="paymentPeriod"
                                    without-days
                                    label="Период оплаты"
                                />
                            </v-col>
                        </v-row>
                        <v-row justify="center">
                            <v-col cols="4">
                                <v-btn color="primary" block @click="onSaveAdjustmentClicked">
                                    Сохранить
                                </v-btn>
                            </v-col>
                            <v-col cols="4">
                                <v-btn color="error" block @click="dialog = false">
                                    Отменить
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import FinancialList from '@/components/contracts/contract-page/FinancialList.vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import { correctFloatRule, notEmptyRule } from '@/validation/common-rules';
import EditableTextField from '@/components/EditableTextField.vue';
import Period from '@/backend/utils/period';
import { formatDateToDefaultFormat } from '@/utils/date-utils';

@Component({
    components: { ConfirmDialog, FinancialList, DatePickerMenu, EditableTextField },
})
export default class AddPaymentDialog extends Vue {
    dialog = false;

    paymentSum = '';
    paymentDate = '';
    paymentPeriod = '';

    correctFloatRule = correctFloatRule;
    notEmptyRule = notEmptyRule;

    contractId: number | null = null;
    currentPeriod = Period.currentPeriod();

    paymentDateMinDate = '';
    paymentDateMaxDate = formatDateToDefaultFormat(new Date());

    $refs!: {
        form: HTMLFormElement;
    };

    onSaveAdjustmentClicked() {
        if (this.$refs.form.validate() && this.contractId) {
            const paymentSum = Number.parseFloat(this.paymentSum);

            this.$emit('update');
            this.dialog = false;
        }
    }

    open(contractId: number, contractStartPeriod: Period) {
        this.contractId = contractId;
        this.dialog = true;
    }

}
</script>

<style scoped>

</style>
