<template>
    <v-dialog
        v-model="dialog"
        width="500"
    >
        <v-card>
            <v-card-title class="headline primary" primary-title>
                Произошла ошибка
            </v-card-title>

            <v-card-text>
                {{ errorText }}
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    @click="close"
                >
                    Закрыть
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class ErrorDialog extends Vue {
        errorText = '';
        dialog = false;

        open(errorText: string) {
            this.errorText = errorText;
            this.dialog = true;
        }

        close() {
            this.dialog = false;
        }
    }
</script>

<style scoped>

</style>
