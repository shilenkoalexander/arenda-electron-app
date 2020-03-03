<template>
    <v-container fluid class="pa-0">
        <v-row>
            <v-col class="pt-0">
                <v-data-table
                        :headers="headers"
                        :items="items"
                        hide-default-footer
                        fixed-header
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
                    <template v-slot:item.action="{item}">
                        <v-btn icon color="info darken-4">
                            <v-icon size="25">
                                mdi-dots-vertical
                            </v-icon>
                        </v-btn>
                        <v-btn icon color="info darken-4">
                            <v-icon size="25">
                                mdi-logout-variant
                            </v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { BasicObjectInfo } from '@/types/objects';
    import { CURRENCY } from '@/utils/finance-util';

    @Component
    export default class ObjectListItems extends Vue {
        headers = [
            { text: 'Адрес', sortable: false, value: 'address', width: '40%' },
            { text: 'Площадь', value: 'type', sortable: false, width: '30%' },
            { text: 'Арендная плата', value: 'payment', sortable: false, width: '18%' },
            { text: 'Действия', value: 'action', sortable: false, align: 'center' },
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
            {
                id: 4,
                address: 'ул. Пушкина дом Колотушкина',
                payment: 150.3,
                rentalRate: 10.5,
                objectType: 'Пятиэтажное помещение',
            },
            {
                id: 5,
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
