<template>
    <v-data-table
            :items="items"
            :headers="headers"
            hide-default-footer
            fixed-header
    >

        <template v-slot:item.name="{item}">
            {{ item.name }}
        </template>
        <template v-slot:item.square="{item}">
            {{ item.square.toFixed(2) }}
        </template>
        <template v-slot:item.startDate="{item}">
            {{ formatToFriendly(item.startDate) }}
        </template>
        <template v-slot:item.endDate="{item}">
            {{ formatToFriendly(item.endDate) }}
        </template>
        <template v-slot:item.businessType="{item}">
            {{ item.businessType.name }}
        </template>
    </v-data-table>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { Subtenant } from '@/backend/types/tenants-types';
    import { formatDateToFriendly } from '@/utils/date-utils';

    @Component({
        components: {},
    })
    export default class SubtenantsList extends Vue {
        @Prop({
            type: Array,
            default: [],
        })
        items!: Subtenant[];

        headers = [
            { text: 'Имя', sortable: false, value: 'name' },
            { text: 'Площадь', sortable: false, value: 'square' },
            { text: 'Дата начала', sortable: false, value: 'startDate' },
            { text: 'Дата действия', sortable: false, value: 'endDate' },
            { text: 'Вид деятельности', sortable: false, value: 'businessType' },
        ];

        formatToFriendly(date: Date): string {
            return formatDateToFriendly(date);
        }
    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }
</style>
