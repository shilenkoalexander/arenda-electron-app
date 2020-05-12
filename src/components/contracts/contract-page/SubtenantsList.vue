<template>
    <div>
        <v-simple-table>
            <template v-slot:default>
                <thead>
                <tr>
                    <th class="text-left">Имя</th>
                    <th class="text-left">Площадь</th>
                    <th class="text-left">Дата начала</th>
                    <th class="text-left">Дата действия</th>
                    <th class="text-left">Вид деятельности</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,i) in items" :key="i + 's'">
                    <td>{{ item.name }}</td>
                    <td>{{ item.square.toFixed(2) }}</td>
                    <td>{{ formatToFriendly(item.startDate) }}</td>
                    <td>{{ formatToFriendly(item.endDate) }}</td>
                    <td>{{ item.businessType }}</td>
                </tr>
                </tbody>
            </template>
        </v-simple-table>
    </div>
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
