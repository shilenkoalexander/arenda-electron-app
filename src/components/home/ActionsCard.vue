<template>
    <v-card>
        <v-container fluid class="py-0">
            <v-row>
                <v-col>
                    <v-btn block text color="primary" to="/contracts/add">
                        <v-icon class="mr-2">
                            mdi-text-box-plus-outline
                        </v-icon>
                        Добавить договор
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn block text color="primary">
                        <v-icon class="mr-2">
                            mdi-account-plus-outline
                        </v-icon>
                        Добавить арендатора
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn block text color="primary">
                        <v-icon class="mr-2">
                            mdi-text-box-multiple-outline
                        </v-icon>
                        Отчеты
                    </v-btn>
                </v-col>
                <v-col>
                    <v-btn block text color="primary">
                        <v-icon class="mr-2">
                            mdi-settings-outline
                        </v-icon>
                        Настройки
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class ActionsCard extends Vue {

    }
</script>

<style scoped>

</style>
