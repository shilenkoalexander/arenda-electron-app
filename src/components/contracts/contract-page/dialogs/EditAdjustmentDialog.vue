<template>
    <v-dialog
        v-model="dialog"
        width="20%"
    >
        <v-card>
            <v-card-title
                class="headline primary white--text py-3"
                primary-title
            >
                Внесение корректировки
            </v-card-title>

            <v-card-text>
                <v-container fluid class="pb-0">
                    <v-row justify="center" class="mt-3">
                        <v-form ref="form">
                            <EditableTextField
                                class="pb-0"
                                v-model="adjustmentSum"
                                :rules="[correctFloatRule]"
                                type="number"
                                label="Сумма корректировки"
                            />
                        </v-form>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="6">
                            <v-btn color="primary" block @click="onSaveAdjustmentClicked">
                                Сохранить
                            </v-btn>
                        </v-col>
                        <v-col cols="6">
                            <v-btn color="error" block @click="dialog = false">
                                Отменить
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import { saveNewAdjustment } from '@/backend/service/finance-service';
import FinancialList from '@/components/contracts/contract-page/FinancialList.vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import { correctFloatRule } from '@/validation/common-rules';
import EditableTextField from '@/components/EditableTextField.vue';
import Period from '@/backend/utils/period';

@Component({
    components: { ConfirmDialog, FinancialList, DatePickerMenu, EditableTextField },
})
export default class EditAdjustmentDialog extends Vue {
    dialog = false;

    adjustmentSum = '';
    correctFloatRule = correctFloatRule;

    currentPeriod = Period.currentPeriod();
    contractId: number | null = null;

    $refs!: {
        form: HTMLFormElement;
    };

    onSaveAdjustmentClicked() {
        if (this.$refs.form.validate() && this.contractId) {
            const newAdjustment = Number.parseFloat(this.adjustmentSum);
            saveNewAdjustment(this.contractId, newAdjustment, this.currentPeriod);
            this.$emit('update');
            this.dialog = false;
        }
    }

    open(contractId: number, currentAdjustment: number) {
        this.adjustmentSum = currentAdjustment.toFixed(2);
        this.contractId = contractId;
        this.dialog = true;
    }

}
</script>

<style scoped>

</style>
