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
                <template v-if="items.length > 0">
                    <tr v-for="(item,i) in items" :key="i + 's'">
                        <td>{{ item.name }}</td>
                        <td>{{ item.square }}</td>
                        <td>{{ formatToFriendly(item.startDate) }}</td>
                        <td>{{ formatToFriendly(item.endDate) }}</td>
                        <td>{{ item.businessType }}</td>
                    </tr>
                </template>
                </tbody>
            </template>
        </v-simple-table>
        <p v-if="items.length < 1" class="text-center mb-0 mt-5">
            Список субарендаторов пуст
        </p>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { Subtenant } from '@/types/tenants';
    import { formatToFriendly } from '@/utils/date-utils';

    @Component({
        components: {},
    })
    export default class SubtenantsList extends Vue {
        @Prop({
            type: Array,
            default: [],
        })
        items!: Subtenant[];

        formatToFriendly = formatToFriendly;
    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }
</style>
