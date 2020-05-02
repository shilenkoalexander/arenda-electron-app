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
                Новое дополнительное соглашение
            </v-card-title>

            <v-card-text>
                <v-form ref="form">
                    <v-container fluid class="pb-0">
                        <v-row justify="center" class="mt-3">
                            <v-col cols="4" class="pb-0">
                                <EditableTextField
                                    class="pb-0"
                                    v-model="paymentSum"
                                    :rules="[notEmptyRule, correctFloatRule, positiveNumberRule]"
                                    type="number"
                                    label="Сумма"
                                />
                            </v-col>
                            <v-col cols="4" class="pb-0">
                                <DatePickerMenu
                                    v-model="startDate"
                                    :rules="[notEmptyRule]"
                                    :allowed-dates="startDateAllowed"
                                    label="Дата начала"
                                />
                            </v-col>
                            <v-col cols="4" class="pb-0">
                                <DatePickerMenu
                                    v-model="endDate"
                                    :rules="[notEmptyRule]"
                                    :disabled="!startDate"
                                    :allowed-dates="endDateAllowed"
                                    label="Дата окончания"
                                />
                            </v-col>
                        </v-row>
                        <v-row justify="center" class="mt-3">
                            <v-col cols="6" class="pt-0">
                                <DatePickerMenu
                                    v-model="conclusionDate"
                                    :rules="[notEmptyRule]"
                                    label="Дата подписания"
                                />
                            </v-col>
                            <v-col cols="6" class="pt-0">
                                <DatePickerMenu
                                    v-model="paymentActualityDate"
                                    :rules="[notEmptyRule]"
                                    :disabled="!startDate"
                                    :max-date="startDate"
                                    label="Дата актуальности суммы"
                                />
                            </v-col>
                        </v-row>
                        <v-row justify="center">
                            <v-col cols="4">
                                <v-btn color="primary" block @click="onSaveClicked">
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
    import { parseDate } from '@/utils/date-utils';
    import { getActiveAndFutureContractExtensions } from '@/backend/repository/contract-repository';
    import { FullContractExtension } from '@/types/contracts';
    import { addDays, isAfter, isBefore, startOfMonth, subDays } from 'date-fns';
    import { addContractExtension } from '@/backend/service/finance-service';

    @Component({
        components: { ConfirmDialog, DatePickerMenu, EditableTextField },
    })
    export default class AddContractExtensionDialog extends Vue {
        dialog = false;

        paymentSum = '';
        startDate = '';
        endDate = '';
        paymentActualityDate = '';
        conclusionDate = '';

        correctFloatRule = correctFloatRule;
        positiveNumberRule = positiveNumberRule;
        notEmptyRule = notEmptyRule;

        contractId: number | null = null;

        contractStartCalculationDate: Date | null = null;
        contractValidity: Date | null = null;
        activeExtensions: FullContractExtension[] = [];

        $refs!: {
            form: HTMLFormElement;
        };

        @Watch('dialog')
        onDialogChanged() {
            if (!this.dialog) {
                this.$refs.form.resetValidation();
                this.paymentSum = '';
                this.startDate = '';
                this.endDate = '';
                this.paymentActualityDate = '';
                this.conclusionDate = '';
            }
        }

        @Watch('startDate')
        onStartDateChanged() {
            this.endDate = '';
        }

        get nextExtensionStartDate(): Date {
            let minDateAfterStart = this.contractValidity!;
            const startDate = parseDate(this.startDate);

            this.activeExtensions.forEach((ext) => {
                if (isBefore(ext.startDate, minDateAfterStart) && isAfter(ext.startDate, startDate)) {
                    minDateAfterStart = ext.startDate;
                }
            });

            return minDateAfterStart;
        }

        startDateAllowed(value: string): boolean {
            const date = parseDate(value);
            if (isBefore(date, startOfMonth(new Date())) || isAfter(date, this.contractValidity!)) {
                return false;
            }

            return !this.activeExtensions
                .some((ext) =>
                    isBefore(subDays(ext.startDate, 1), date)
                    && isAfter(addDays(ext.endDate, 1), date),
                );
        }

        endDateAllowed(value: string): boolean {
            const date = parseDate(value);
            const startDate = parseDate(this.startDate);

            if (isBefore(date, startOfMonth(new Date())) || isAfter(date, this.contractValidity!)) {
                return false;
            }

            return isBefore(date, this.nextExtensionStartDate) && isAfter(date, startDate);
        }

        open(contractId: number, contractStartCalculationDate: Date, contractValidity: Date) {
            this.contractId = contractId;
            this.activeExtensions = getActiveAndFutureContractExtensions(this.contractId);
            this.contractStartCalculationDate = contractStartCalculationDate;
            this.contractValidity = contractValidity;
            this.dialog = true;
        }

        onSaveClicked() {
            if (this.$refs.form.validate()) {
                addContractExtension(this.contractId!, {
                    payment: Number.parseFloat(this.paymentSum),
                    paymentActualityDate: parseDate(this.paymentActualityDate),
                    conclusionDate: parseDate(this.conclusionDate),
                    endDate: parseDate(this.endDate),
                    startDate: parseDate(this.startDate),
                });
                this.$emit('update');
                this.dialog = false;
            }
        }
    }
</script>

<style scoped>

</style>
