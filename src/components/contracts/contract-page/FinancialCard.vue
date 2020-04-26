<template>
    <v-card>
        <v-container fluid class="px-5">
            <template v-if="isAdjustmentEditable">
                <v-row class="actions-row">
                    <v-col v-if="!adjustmentEditing" cols="4">
                        <v-btn
                            color="primary"
                            block
                            @click="onEditAdjustmentClicked"
                        >
                            Внести корректировку
                        </v-btn>
                    </v-col>

                    <template v-if="adjustmentEditing">
                        <v-col cols="3">
                            <v-form ref="form">
                                <EditableTextField
                                    class="pb-0"
                                    v-model="adjustmentSum"
                                    :rules="[correctFloatRule]"
                                    type="number"
                                    label="Сумма корректировки"
                                />
                            </v-form>
                        </v-col>
                        <v-col cols="3">
                            <v-btn color="primary" block @click="onSaveAdjustmentClicked">
                                Сохранить
                            </v-btn>
                        </v-col>
                        <v-col cols="3">
                            <v-btn color="error" block @click="adjustmentEditing = false">
                                Отменить
                            </v-btn>
                        </v-col>
                    </template>
                </v-row>

                <v-divider/>
            </template>
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
import { correctFloatRule } from '@/validation/common-rules';
import { saveNewAdjustment } from '@/backend/service/finance-service';

@Component({
    components: {
        EditableTextField,
        Label,
        FinancialList,
        DatePickerMenu,
    },
})
export default class FinancialCard extends Vue {

    get isAdjustmentEditable(): boolean {
        return true;
    }
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

    adjustmentSum = '';
    adjustmentEditing = false;

    correctFloatRule = correctFloatRule;

    // currentPeriod = Period.currentPeriod();
    currentPeriod = Period.ofMonthYear(8, 2020);

    $refs!: {
        form: HTMLFormElement;
    };

    onEditAdjustmentClicked() {
        const currentFinancePeriod = this.financePeriods
            .find((value) => value.period.isSamePeriod(this.currentPeriod));

        if (currentFinancePeriod) {
            this.adjustmentSum = currentFinancePeriod.adjustments.toFixed(2);
            this.adjustmentEditing = true;
        }
    }

    onSaveAdjustmentClicked() {
        if (this.$refs.form.validate()) {
            const newAdjustment = Number.parseFloat(this.adjustmentSum);
            saveNewAdjustment(this.contractId, newAdjustment, this.currentPeriod);
            this.adjustmentEditing = false;
            this.update();
        }
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

    .actions-row {
        height: 10vh;
    }
</style>
