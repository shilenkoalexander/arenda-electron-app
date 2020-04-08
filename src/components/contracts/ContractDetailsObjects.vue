<template>
    <v-simple-table>
        <template v-slot:default>
            <thead>
            <tr>
                <th class="text-left">Адрес</th>
                <th class="text-left">Арендная плата</th>
                <th class="text-left">Арендная ставка</th>
                <th class="text-left">Вид деятельности</th>
                <th class="text-left">На балансе</th>
                <th class="text-left">Количество субарендаторов</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in items" :key="item.name">
                <td>{{ item.address }}</td>
                <td>{{ item.payment + ' ' + CURRENCY }}</td>
                <td>{{ item.rentalRate + ' %' }}</td>
                <td>{{ item.businessType }}</td>
                <td>{{ item.onBalance }}</td>
                <td>{{ item.subtenantsCount }}</td>
            </tr>
            </tbody>
        </template>
    </v-simple-table>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { ShortObjectDetails } from '@/types/objects';
    import { CURRENCY } from '@/utils/finance-util';
    import Label from '@/components/Label.vue';

    @Component({
        components: { Label },
    })
    export default class ContractDetailsObjects extends Vue {
        @Prop({
            type: Array,
            default: () => [],
        })
        items!: ShortObjectDetails[];

        CURRENCY = CURRENCY;
    }
</script>

<style scoped>

</style>
