<template>
    <v-container fluid>
        <v-row>
            <v-col cols="6" offset="3">
                <p class="title text-center">Информация об объектах</p>
            </v-col>
            <v-col offset="1" cols="2">
                <v-btn to="/object/add" color="primary" block>
                    Добавить
                </v-btn>
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
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { BasicObjectInfo } from '@/types/objects';
    import { CURRENCY } from '@/utils/finance-util';

    @Component
    export default class AddContractObjectsList extends Vue {
        @Prop({
            type: Array,
            default: () => [],
        })
        items!: BasicObjectInfo;

        CURRENCY = CURRENCY;

        created() {
            // addContractEventBus.$on('save', (value: AddObjectDto) => this.$emit('add', value))
        }
    }
</script>

<style scoped>

</style>
