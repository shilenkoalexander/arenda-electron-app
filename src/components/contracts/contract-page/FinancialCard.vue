<template>
    <v-card>
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
            <v-row v-if="financePeriods.length > 0">
                <v-col cols="12">
                    <FinancialList :items="financePeriods"/>
                </v-col>
            </v-row>
            <v-row v-else justify="center">
                <v-col cols="4">
                    <p>Записи отсутствуют</p>
                </v-col>
            </v-row>
        </v-container>
        <EditAdjustmentDialog ref="editAdjustmentDialog" @update="update"/>
        <AddPaymentDialog ref="addPaymentDialog" @update="update"/>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import FinancialList from '@/components/contracts/contract-page/FinancialList.vue';
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import Label from '@/components/Label.vue';
import { FinancePeriod } from '@/types/finance';
import EditableTextField from '@/components/EditableTextField.vue';
import Period from '@/backend/utils/period';
import EditAdjustmentDialog from '@/components/contracts/contract-page/dialogs/EditAdjustmentDialog.vue';
import AddPaymentDialog from '@/components/contracts/contract-page/dialogs/AddPaymentDialog.vue';

@Component({
    components: {
        AddPaymentDialog,
        EditAdjustmentDialog,
        EditableTextField,
        Label,
        FinancialList,
        DatePickerMenu,
    },
})
export default class FinancialCard extends Vue {
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
</style>
