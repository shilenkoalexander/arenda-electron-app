<template>
    <v-container fluid pa-0 class="pagination">
        <v-layout row>
            <v-flex v-if="isRowsPerPageIsNotEmpty" xs3 align-self-center>
                <v-layout row>
                    <v-flex xs8 align-self-center>
                        <v-subheader class="pl-0">
                            {{ countPerPageLabel }}
                        </v-subheader>
                    </v-flex>
                    <v-flex xs4 align-self-center>
                        <v-select v-model="localRowsPerPage"
                                  :items="rowsPerPageVariants"
                        />
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex v-if="totalPages > 1"
                    class="text-xs-center"
                    :class="paginationClass"
                    align-self-center
            >
                <v-pagination
                        v-model="localPage"
                        :total-visible="currentVisiblePageCount"
                        :length="totalPages"
                        :color="color"
                        circle
                />
            </v-flex>
            <v-spacer/>
            <v-flex v-if="totalItems !== null" xs3 align-self-center>
                <v-subheader>
                    Количество записей всего: {{ totalItems }}
                </v-subheader>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

    @Component
    export default class Pagination extends Vue {
        /**
         * Общее количество страниц
         */
        @Prop({
            type: Number,
            default: 0,
        })
        totalPages!: number;

        /**
         * Общее количество записей
         */
        @Prop({
            type: Number,
            default: null,
        })
        totalItems!: number | null;

        /**
         * Количество отображаемых страниц при точке останова xs
         */
        @Prop({
            type: Number,
            default: 5,
        })
        visiblePageCountXs!: number;

        /**
         * Количество отображаемых страниц при точке останова sm
         */
        @Prop({
            type: Number,
            default: null,
        })
        visiblePageCountSm!: number | null;

        /**
         * Количество отображаемых страниц при точке останова md
         */
        @Prop({
            type: Number,
            default: null,
        })
        visiblePageCountMd!: number | null;

        /**
         * Количество отображаемых страниц при точке останова lg
         */
        @Prop({
            type: Number,
            default: null,
        })
        visiblePageCountLg!: number | null;

        /**
         * Количество отображаемых страниц при точке останова xl
         */
        @Prop({
            type: Number,
            default: null,
        })
        visiblePageCountXl!: number | null;

        /**
         * Текст, отображаемый с выбором количества отображаемых записей на странице
         */
        @Prop({
            type: String,
            default: 'Количество записей на странице',
        })
        countPerPageLabel!: string;

        /**
         * Варианты выбора количества отображаемых записей на странице
         */
        @Prop({
            type: Array,
            default: () => [],
        })
        rowsPerPageVariants!: number[];

        /**
         * Количество записей на странице
         */
        @Prop({
            type: Number,
            default: null,
        })
        rowsPerPage!: number;

        /**
         * Задает цвет кнопкам номеров страниц
         */
        @Prop({
            type: String,
            default: 'primary',
        })
        color!: string;

        /**
         * Выбранная страница
         */
        @Prop({
            type: Number,
            required: true,
        })
        value!: number;

        localPage = this.value;
        localRowsPerPage = this.rowsPerPage;

        get isRowsPerPageIsNotEmpty(): boolean {
            return this.rowsPerPageVariants.length !== 0;
        }

        get paginationClass() {
            if (this.isRowsPerPageIsNotEmpty && this.totalItems !== null) {
                return ['xs6'];
            }

            if (this.isRowsPerPageIsNotEmpty) {
                return ['xs6'];
            }

            if (this.totalItems !== null) {
                return ['xs6', 'offset-xs3'];
            }

            return ['xs12'];
        }

        get currentVisiblePageCount() {
            for (let i = 0; i < this.breakpointsArray.length; i += 1) {
                if (this.breakpointsArray[i]) {
                    for (let j = i; j >= 0; j -= 1) {
                        if (this.visiblePagesBreakpointsArray[j] !== null) {
                            return this.visiblePagesBreakpointsArray[j];
                        }
                    }
                }
            }
            return 0;
        }

        get breakpointsArray() {
            // breakpoint НЕЛЬЗЯ выносить в переменную. Не будут отслеживаться изменения
            return [
                this.$vuetify.breakpoint.xs,
                this.$vuetify.breakpoint.sm,
                this.$vuetify.breakpoint.md,
                this.$vuetify.breakpoint.lg,
                this.$vuetify.breakpoint.xl,
            ];
        }

        get visiblePagesBreakpointsArray() {
            return [
                this.visiblePageCountXs,
                this.visiblePageCountSm,
                this.visiblePageCountMd,
                this.visiblePageCountLg,
                this.visiblePageCountXl,
            ];
        }


        @Watch('rowsPerPage')
        onRowsPerPageChanged() {
            this.localRowsPerPage = this.rowsPerPage;
        }

        @Watch('localRowsPerPage')
        onLocalRowsPerPageChanged() {
            this.localPage = 1;

            if (this.localRowsPerPage !== this.rowsPerPage) {
                /**
                 * Событие, происходящее при изменении выбранного количества записей на странице
                 */
                this.$emit('update:rowsPerPage', this.localRowsPerPage);
            }
        }

        @Watch('value')
        onValueChanged() {
            this.localPage = this.value;
        }

        @Watch('localPage')
        onLocalPageChanged() {
            if (this.localPage !== this.value) {
                /**
                 * Событие, происходящее при изменении выбранной страницы
                 */
                this.$emit('input', this.localPage);
            }
        }
    }
</script>

<style scoped lang="scss">
    .pagination > > > {
        .v-pagination--circle {
            .v-pagination__navigation, .v-pagination__item {
                outline: none !important
            }
        }
    }
</style>
