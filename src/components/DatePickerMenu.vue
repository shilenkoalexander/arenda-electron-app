<template>
    <v-menu v-model="menuVisible"
            :disabled="readonly || loading"
            :close-on-content-click="false"
            :nudge-right="40"
            :color="color"
            transition="scale-transition"
            offset-y
            min-width="290px"
            content-class="date-picker-menu"
    >
        <template v-slot:activator="{ on }">
        <v-text-field
                v-on="on"
                :value="formattedDate"
                :label="label"
                :color="color"
                outlined
                dense
                :clearable="clearable"
                :rules="rules"
                :hide-details="hideDetails"
                :loading="loading"
                append-icon="mdi-calendar"
                readonly
                @click:clear="clearDate"
        />
        </template>
        <DatePicker v-model="localDateISO"
                    :min-date="minDate"
                    :max-date="maxDate"
                    :allowed-dates="allowedDates"
                    :color="color"
                    :without-days="withoutDays"
                    @input="menuVisible = false"
        />
    </v-menu>
</template>

<script lang="ts">
    import { parseISO } from 'date-fns';
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import DatePicker from '@/components/DatePicker.vue';
    import { formatMonthToFriendly } from '@/utils/date-utils';

    @Component({
        components: { DatePicker },
    })
    export default class DatePickerMenu extends Vue {
        /**
         * Значение, которое будет установлено при появлении компонента
         */
        @Prop({ type: String, default: null })
        value!: string | null;

        /**
         * Текст в поле выбора
         */
        @Prop({ type: String, default: null })
        label!: string | null;

        /**
         * Добавляет кнопку для очистки введенного значения
         */
        @Prop({ type: Boolean, default: false })
        clearable!: boolean;

        /**
         * Не позволяет изменить значение
         */
        @Prop({ type: Boolean, default: false })
        readonly!: boolean;

        /**
         * Анимация загрузки
         */
        @Prop({ type: Boolean, default: false })
        loading!: boolean;

        /**
         * Правила для выбранного значения даты
         */
        // @Prop({ type: Array, default: () => [] })
        rules!: any[];

        /**
         * Функция или массив для определения доступных для выбора дат
         */
        // @Prop({ type: [Function, Array], default: null })
        allowedDates!: (value: string) => boolean | string[] | null;

        /**
         * Отключает возвожность выбора дня в дате
         */
        @Prop({ type: Boolean, default: false })
        withoutDays!: boolean;

        /**
         * Скрывает сообщения под текстовым полем
         */
        @Prop({ type: Boolean, default: false })
        hideDetails!: boolean;

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
         * Цвет компонента
         */
        @Prop({ type: String, default: 'primary' })
        color!: string;

        private localDateISO: string | null = this.value;
        private menuVisible: boolean | null = null;

        private get localDate() {
            return this.localDateISO ? parseISO(this.localDateISO) : null;
        }

        private get formattedDate() {
            if (this.localDate) {
                return this.withoutDays ? formatMonthToFriendly(this.localDate) : formatMonthToFriendly(this.localDate);
            }
            return '';
        }

        @Watch('value')
        private onValueChanged(newValue: string | null) {
            this.localDateISO = newValue;
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

        private clearDate() {
            this.localDateISO = null;
        }
    }
</script>

<style scoped lang="scss">
    .v-text-field >>> {
        .v-input__slot {
            cursor: pointer;
        }
    }
</style>
