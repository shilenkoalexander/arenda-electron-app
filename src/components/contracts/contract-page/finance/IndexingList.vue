<template>
    <v-data-table
        height="38vh"
        :headers="headers"
        :items="items"
        hide-default-footer
        fixed-header
    >
        <template v-slot:item.period="{item}">
            {{ item.period.toFriendlyFormat() }}
        </template>
        <template v-slot:item.indexing="{item}">
            {{ item.indexing ? 'Да' : 'Нет' }}
        </template>
    </v-data-table>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { IndexingSign } from '@/types/finance';
    import { getIndexingSigns } from '@/backend/repository/finance-repository';

    @Component
    export default class IndexingList extends Vue {
        @Prop({
            type: Array,
            required: true,
        })
        items!: IndexingSign[];

        headers = [
            { text: 'Период', value: 'period', sortable: false },
            { text: 'Индексация', value: 'indexing', sortable: false },
        ];

        update() {
            this.$emit('update-indexing');
        }
    }
</script>

<style scoped>

</style>
