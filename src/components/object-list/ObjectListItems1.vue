<template>
    <v-expansion-panels accordion hover>
        <v-expansion-panel
                v-for="(item,i) in 5"
                :key="i"
        >
            <v-expansion-panel-header>
                <v-container fluid class="pa-0">
                    <v-row no-gutters>
                        <v-col cols="6" align-self="center">
                            ул. Пушкина дом Колотушкина этаж 3
                        </v-col>
                        <v-col cols="2" align-self="center">
                            150кв.м.
                        </v-col>
                        <v-col cols="2" align-self="center">
                            300 р. (10%)
                        </v-col>
                        <v-col class="text-end">
                            <v-btn icon small>
                                <v-icon>
                                    mdi-dots-vertical
                                </v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <v-container fluid class="pa-0">
                    <v-row>
                        <v-col>
                            <TextValueItem text="Дата начала" value="10.10.2018"/>
                        </v-col>
                        <v-col>
                            <TextValueItem text="Дата действия" value="10.10.2020"/>
                        </v-col>
                        <v-col>
                            <TextValueItem text="Район" value="Центрально-Городской"/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <TextValueItem text="На балансе" value="Центральное управление по управлению управлениями"/>
                        </v-col>
                    </v-row>
                </v-container>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import TextValueItem from '@/components/TextValueItem.vue';

    @Component({
        components: {
            TextValueItem,
        },
    })
    export default class ObjectListItems extends Vue {

    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }
</style>
