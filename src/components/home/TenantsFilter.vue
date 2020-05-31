<template>
    <v-container fluid class="pt-2 pb-3 px-5">
        <v-row>
            <v-col>
                <v-text-field
                        dense
                        color="primary"
                        outlined
                        label="Фильтр"
                        prepend-inner-icon="mdi-magnify"
                        hide-details
                        clearable
                        v-model="filter.search"
                />
            </v-col>
            <v-col class="py-0 pl-4" align-self="center" cols="5">
                <v-radio-group
                        v-model="filterMode"
                        hide-details
                        row
                        color="primary"
                        class="mt-0"
                >
                    <v-radio color="primary" label="Имя"/>
                    <v-radio color="primary" label="Адрес"/>
                </v-radio-group>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import { TenantsFilter as TenantsFilterDto, TenantsFilterMode } from '@/model/filter/filter';
    import { InputItem } from '@/types/common';
    import { $enum } from 'ts-enum-util';

    @Component
    export default class TenantsFilter extends Vue {
        filter: TenantsFilterDto = {
            filterMode: TenantsFilterMode.NAME,
            search: null,
        };

        filterMode = 0;
        status: InputItem | null = null;

        @Watch('filterMode')
        onFilterModeChanged() {
            this.filter.filterMode = $enum(TenantsFilterMode).getValues()[this.filterMode];
        }

        @Watch('filter', { deep: true })
        onFilterChanged() {
            this.$emit('filter', this.filter);
        }
    }
</script>

<style scoped>

</style>
