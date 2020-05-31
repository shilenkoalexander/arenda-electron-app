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
                                    :rules="[correctFloatRule, positiveNumberRule]"
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
                                    :allowed-dates="allowedPeriods"
                                    without-days
                                    clearable
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
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import DatePickerMenu from '@/components/DatePickerMenu.vue';
    import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
    import { correctFloatRule, notEmptyRule, positiveNumberRule } from '@/validation/common-rules';
    import EditableTextField from '@/components/EditableTextField.vue';
    import Period from '@/model/utils/period';
    import { formatDateToDefaultFormat, parseDate } from '@/utils/date-utils';
    import { addPayment } from '@/model/service/finance-service';

    @Component({
        components: { ConfirmDialog, DatePickerMenu, EditableTextField },
    })
    export default class AddPaymentDialog extends Vue {
        dialog = false;

        paymentSum = '';
        paymentDate = '';
        paymentPeriod = '';

        correctFloatRule = correctFloatRule;
        positiveNumberRule = positiveNumberRule;
        notEmptyRule = notEmptyRule;

        contractId: number | null = null;

        paymentDateMinDate = '';
        paymentDateMaxDate = formatDateToDefaultFormat(new Date());

        calculatedPeriods: Period[] = [];

        $refs!: {
            form: HTMLFormElement;
        };

        @Watch('dialog')
        onDialogChanged() {
            if (!this.dialog) {
                this.$refs.form.resetValidation();
                this.paymentSum = '';
                this.paymentDate = '';
                this.paymentPeriod = '';
            }
        }

        get allowedPeriods(): string[] {
            return this.calculatedPeriods.map((value) => value.toDefaultFormat());
        }

        onSaveAdjustmentClicked() {
            if (this.$refs.form.validate() && this.contractId) {
                const paymentSum = Number.parseFloat(this.paymentSum);

                const date = parseDate(this.paymentDate);
                addPayment(this.contractId, {
                    sum: paymentSum,
                    date,
                    period: this.paymentPeriod ?
                        Period.ofString(this.paymentPeriod)
                        : Period.ofDate(date).subMonths(1),
                });

                this.$emit('update');
                this.dialog = false;
                this.paymentSum = '';
                this.paymentDate = '';
                this.paymentPeriod = '';
            }
        }

        open(contractId: number, calculationStartPeriod: Period, calculatedPeriods: Period[]) {
            this.contractId = contractId;
            this.paymentDateMinDate = calculationStartPeriod.addMonths(1).toDateFormat();
            this.calculatedPeriods = calculatedPeriods;
            this.dialog = true;
        }

    }
</script>

<style scoped>

</style>
