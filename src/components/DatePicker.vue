<template>
    <v-date-picker
            ref="datePicker"
            v-model="localDateISO"
            :type="pickerType"
            :min="minDate"
            :max="maxDate"
            :allowed-dates="allowedDatesFunction"
            no-title
            scrollable
            locale="ru-ru"
            first-day-of-week="1"
            v-bind="$attrs"
            @update:pickerDate="onPickerDateChanged"
    />
</template>

<script lang="ts">
    import { isAfter, isBefore, parseISO } from 'date-fns';
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { VDatePicker } from 'vuetify/lib';

    @Component({
    inheritAttrs: false,
    components: {
        VDatePicker,
    },
})
export default class DatePicker extends Vue {

    private get date() {
        return this.localDateISO ? parseISO(this.localDateISO) : null;
    }

    private get pickerType() {
        return this.withoutDays ? 'month' : 'date';
    }

    private get allowedDatesFunction() {
        const allowedDates = this.allowedDates;

        if (Array.isArray(allowedDates)) {
            return (value: string) => allowedDates.includes(value);
        }

        return allowedDates;
    }
    /**
     * Значение, которое будет установлено при появлении компонента
     */
    @Prop({ type: String, default: null })
    value!: string | null;

    /**
     * Отключает возвожность выбора дня в дате
     */
    @Prop({ type: Boolean, default: false })
    withoutDays!: boolean;

    /**
     * Минимальное значение для даты
     */
    @Prop({ type: String, default: null })
    minDate!: string | null;

    /**
     * Максимальное значение для даты
     */
    @Prop({ type: String, default: null })
    maxDate!: string | null;

    /**
     * Функция или массив для определения доступных для выбора дат
     */
    @Prop({ type: [Function, Array], default: null })
    allowedDates!: (value: string) => boolean | string[] | null;

    private localDateISO: string | null = this.value;

    onPickerDateChanged(value: string) {
        /**
         * Событие при изменении значения в заголовке таблицы
         */
        this.$emit('picker-date', value);
    }

    @Watch('allowedDatesFunction')
    private onAllowedDatesFunctionChanged() {
        if (this.allowedDatesFunction !== null && this.localDateISO !== null) {
            if (!this.allowedDatesFunction(this.localDateISO)) {
                this.localDateISO = null;
            }
        }
    }

    @Watch('value')
    private onValueChanged(newValue: string | null) {
        this.localDateISO = newValue;
    }

    @Watch('minDate')
    private onMinDateChanged() {
        if (this.date && this.minDate && isAfter(parseISO(this.minDate), this.date)) {
            this.localDateISO = this.minDate;
        }
    }

    @Watch('maxDate')
    private onMaxDateChanged() {
        if (this.date && this.maxDate && isBefore(parseISO(this.maxDate), this.date)) {
            this.localDateISO = this.maxDate;
        }
    }

    @Watch('localDateISO')
    private onLocalDateChanged() {
        if (this.localDateISO !== this.value) {
            /**
             * Событие при изменении значения даты
             */
            this.$emit('input', this.localDateISO);
        }
    }
}
</script>

<style scoped>

</style>
