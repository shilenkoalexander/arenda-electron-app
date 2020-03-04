<template>
    <v-card>
        <v-container fluid class="py-0">
            <v-row>
                <v-col class="pt-0">
                    <v-data-table
                            :headers="headers"
                            :items="items"
                            single-select
                            hide-default-footer
                            fixed-header
                            v-model="value"
                    >
                        <template v-slot:item.address="{item}">
                            {{item.address}}
                        </template>
                        <template v-slot:item.type="{item}">
                            {{item.objectType}}
                        </template>
                        <template v-slot:item.payment="{item}">
                            {{`${item.payment} ${CURRENCY} (${item.rentalRate}%)`}}
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import ObjectDetailsCard from '@/components/contracts/contract-page/ObjectDetailsCard.vue';
    import { BasicObjectInfo } from '@/types/objects';
    import { CURRENCY } from '@/utils/finance-util';

    @Component({
        components: {
            ObjectDetailsCard,
        },
    })
    export default class ObjectListCard extends Vue {
        value = [];

        headers = [
            { text: 'Адрес', sortable: false, value: 'address', width: '40%' },
            { text: 'Тип объекта', value: 'type', sortable: false, width: '30%' },
            { text: 'Арендная плата', value: 'payment', sortable: false, width: '18%' },
        ];

        CURRENCY = CURRENCY;

        items: BasicObjectInfo[] = [
            {
                id: 1,
                address: 'ул. Пушкина дом Колотушкина',
                payment: 150.3,
                rentalRate: 10.5,
                objectType: 'Пятиэтажное помещение',
            },
            {
                id: 2,
                address: 'ул. Пушкина дом Колотушкина',
                payment: 150.3,
                rentalRate: 10.5,
                objectType: 'Пятиэтажное помещение',
            },
            {
                id: 3,
                address: 'ул. Пушкина дом Колотушкина',
                payment: 150.3,
                rentalRate: 10.5,
                objectType: 'Пятиэтажное помещение',
            },
        ];
    }
</script>

<style scoped>

</style>
