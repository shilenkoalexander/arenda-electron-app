<template>
    <v-container fluid>
        <v-row>
            <v-col>
                <v-data-table
                        :headers="headers"
                        fixed-header
                        multi-sort
                ></v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
export default class ContractsList extends Vue {
    headers = [
        { text: 'Статус', align: 'left', sortable: false, value: 'name', width: '10%' },
        { text: 'Договор', value: 'calories', width: '40%' },
        { text: 'Арендатор', value: 'fat', width: '40%' },
        { text: 'Просмотр', value: 'carbs', sortable: false },
    ];
}
</script>

<style scoped>

</style>
