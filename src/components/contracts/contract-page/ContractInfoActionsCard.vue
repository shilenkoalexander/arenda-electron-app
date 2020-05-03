<template>
    <v-card class="elevation-1">
        <v-container fluid fill-height class="justify-center align-content-center px-8">
            <v-row>
                <v-col cols="6">
                    <v-btn
                            block
                            color="primary lighten-1"
                            class="button-text"
                    >
                        Редактировать
                    </v-btn>
                </v-col>
                <v-col cols="6">
                    <v-btn
                            block
                            color="primary lighten-1"
                            class="button-text"
                            @click="onRecalculateClicked"
                    >
                        Перерасчет
                    </v-btn>
                </v-col>
                <v-col cols="6">
                    <v-btn
                            block
                            color="primary lighten-1"
                            class="button-text"
                    >
                        Кнопка
                    </v-btn>
                </v-col>
                <v-col cols="6">
                    <v-btn
                            block
                            color="primary lighten-1"
                            class="button-text"
                    >
                        Продлить
                    </v-btn>
                </v-col>
                <v-col cols="6">
                    <v-btn
                            block
                            color="warning"
                    >
                        Приостановить
                    </v-btn>
                </v-col>
                <v-col cols="6">
                    <v-btn
                            block
                            color="error darken-1"
                    >
                        Закрыть
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class ContractInfoActionsCard extends Vue {

        onRecalculateClicked() {
            this.$emit('recalculate');
        }

    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }

    .button-text {
        color: #f1f1f1 !important;
    }
</style>
