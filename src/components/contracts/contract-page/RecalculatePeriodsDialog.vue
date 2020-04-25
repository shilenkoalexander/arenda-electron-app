<template>
    <v-dialog
            v-model="dialog"
            width="50%"
    >
        <v-card>
            <v-card-title
                    class="headline primary white--text py-3"
                    primary-title
            >
                Перерасчет
            </v-card-title>

            <v-card-text>
                <v-container fluid>
                    <v-row justify="center">
                        <v-col cols="3">
                            <DatePickerMenu
                                    v-model="startMonth"
                                    :min-date="startMinDate"
                                    :max-date="startMaxDate"
                                    label="Период с"
                                    without-days
                                    range
                            />
                        </v-col>
                        <v-col cols="3">
                            <DatePickerMenu
                                    v-model="endMonth"
                                    :min-date="endMinDate"
                                    :max-date="endMaxDate"
                                    label="Период по"
                                    without-days
                            />
                        </v-col>
                        <v-col cols="3">
                            <v-btn
                                    block
                                    color="primary"
                                    @click="onRecalculateClicked"
                            >
                                Пересчитать
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import { formatDateToMonthString } from '@/utils/date-utils';
import { calculateFinancePeriods } from '@/backend/service/finance-service';
import Period from '@/backend/utils/period';

@Component({
    components: { DatePickerMenu },
})
export default class RecalculatePeriodsDialog extends Vue {
    @Prop({
        type: Date,
        required: true,
    })
    calculatingStartDate!: Date;

    dialog = true;

    startMonth = '';
    endMonth = '';

    startMinDate = formatDateToMonthString(this.calculatingStartDate);
    // startMaxDate = formatDateToMonthString(subMonths(new Date(), 1));
    startMaxDate = formatDateToMonthString(new Date(2020, 8, 1));
    endMinDate = formatDateToMonthString(this.calculatingStartDate);
    endMaxDate = formatDateToMonthString(new Date(2020, 8, 1));

    // endMaxDate = formatDateToMonthString(subMonths(new Date(), 1));

    @Watch('startMonth')
    onStartMonthChanged() {
        this.endMinDate = this.startMonth;
    }

    @Watch('endMonth')
    onEndMonthChanged() {
        this.startMaxDate = this.endMonth;
    }

    onRecalculateClicked() {
        const financePeriods = calculateFinancePeriods(
            Period.ofString(this.startMonth),
            Period.ofString(this.endMonth),
            1,
        );
        financePeriods.forEach((value) => console.log(value));
    }
}
</script>

<style scoped>

</style>
