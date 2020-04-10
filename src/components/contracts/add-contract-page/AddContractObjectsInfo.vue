<template>
    <v-container fluid>
        <v-row>
            <v-col>
                <p class="title text-center">Информация об объектах</p>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                        <tr>
                            <th class="text-left">Адрес</th>
                            <th class="text-left">Тип объекта</th>
                            <th class="text-left">Арендная плата</th>
                            <th class="text-left">Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in items" :key="item.name">
                            <td>{{ item.address }}</td>
                            <td>{{ item.objectType }}</td>
                            <td>{{`${item.payment} ${CURRENCY} (${item.rentalRate}%)`}}</td>
                            <td>
                                <v-btn icon color="primary">
                                    <v-icon>
                                        mdi-pencil
                                    </v-icon>
                                </v-btn>
                                <v-btn icon color="error">
                                    <v-icon>
                                        mdi-delete
                                    </v-icon>
                                </v-btn>
                            </td>
                        </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { BasicObjectInfo } from '@/types/objects';
    import { CURRENCY } from '@/utils/finance-util';

    @Component
    export default class AddContractObjectsInfo extends Vue {
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
