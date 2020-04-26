<template>
    <v-card>
        <v-container fluid class="px-5">
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
    import { getAllPeriods } from '@/backend/repository/finance-repository';

    @Component({
        components: {
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

        financePeriods: FinancePeriod[] = [];

        created() {
            this.financePeriods = getAllPeriods(this.contractId);
        }
    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }
</style>
