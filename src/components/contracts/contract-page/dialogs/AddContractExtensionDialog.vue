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
                                        :max-date="startDate"
                                        :disabled="!startDate"
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import { correctFloatRule, notEmptyRule, positiveNumberRule } from '@/validation/common-rules';
import EditableTextField from '@/components/EditableTextField.vue';
import { formatDateToDefaultFormat, parseDate } from '@/utils/date-utils';
import { FullContractExtension } from '@/backend/types/contract-types';
import { addDays, isAfter, isBefore, isEqual, startOfMonth, subDays } from 'date-fns';

@Component({
    components: { ConfirmDialog, DatePickerMenu, EditableTextField },
})
export default class AddContractExtensionDialog extends Vue {
    @Prop({
        type: Boolean,
        default: false,
    })
    backdating!: boolean;

    dialog = false;
    editingContractExtensionId: number | null = null;

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

    @Watch('startDate')
    onStartDateChanged() {
        // todo: тут сделать чтобы дата конца двигалась, а не исчезала.
        // и ограничение на дату начала с учетом конца надо
        this.endDate = '';
    }

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

    get nextExtensionStartDate(): Date {
        let minDateAfterStart = addDays(this.contractValidity!, 1);
        const startDate = parseDate(this.startDate);

        this.activeExtensions.forEach((ext) => {
            if (isBefore(ext.startDate, minDateAfterStart) && isAfter(ext.startDate, startDate)) {
                minDateAfterStart = ext.startDate;
            }
        });

        return minDateAfterStart;
    }

    isOutOfContractValidityRange(date: Date): boolean {
        if (isAfter(date, addDays(this.contractValidity!, 1))) {
            return true;
        }

        if (this.backdating) {
            return isBefore(date, this.contractStartCalculationDate!);
        }

        return isBefore(date, startOfMonth(new Date()));
    }

    startDateAllowed(value: string): boolean {
        const date = parseDate(value);
        if (this.isOutOfContractValidityRange(date)) {
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

        if (this.isOutOfContractValidityRange(date)) {
            return false;
        }

        return isBefore(date, this.nextExtensionStartDate)
            && (isAfter(date, startDate) || isEqual(date, startDate));
    }

    open(
        contractId: number,
        contractStartCalculationDate: Date,
        contractValidity: Date,
        activeExtensions: FullContractExtension[],
        editingContractExtensionId?: number,
    ) {
        this.contractId = contractId;
        this.activeExtensions = activeExtensions;
        this.contractStartCalculationDate = contractStartCalculationDate;
        this.contractValidity = contractValidity;
        this.dialog = true;

        if (editingContractExtensionId) {
            const editingExtension = activeExtensions
                .find((value) => value.id === editingContractExtensionId);
            if (editingExtension) {
                this.activeExtensions = activeExtensions.filter((value) => value.id !== editingContractExtensionId);

                this.editingContractExtensionId = editingContractExtensionId;
                this.startDate = formatDateToDefaultFormat(editingExtension.startDate);
                this.paymentActualityDate = formatDateToDefaultFormat(editingExtension.paymentActualityDate);
                this.conclusionDate = formatDateToDefaultFormat(editingExtension.conclusionDate);
                this.paymentSum = editingExtension.payment.toFixed(2);
                this.$nextTick(() => this.endDate = formatDateToDefaultFormat(editingExtension.endDate));
            }
        }
    }

    onSaveClicked() {
        if (this.$refs.form.validate()) {
            let id = this.editingContractExtensionId;

            if (!id) {
                let maxId = 0;
                this.activeExtensions.forEach((value) => {
                    if (value.id > maxId) {
                        maxId = value.id;
                    }
                });

                id = maxId + 1;
            }

            let endDate;
            if (endDate) {
                endDate = parseDate(this.endDate);
            } else {
                endDate = this.contractValidity;
            }

            this.$emit('save', {
                id,
                payment: Number.parseFloat(this.paymentSum),
                paymentActualityDate: parseDate(this.paymentActualityDate),
                conclusionDate: parseDate(this.conclusionDate),
                endDate,
                startDate: parseDate(this.startDate),
                isNew: !this.editingContractExtensionId,
            });

            this.dialog = false;
        }
    }
}
</script>

<style scoped>

</style>
