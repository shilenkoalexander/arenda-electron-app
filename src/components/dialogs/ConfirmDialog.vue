<template>
    <v-dialog
        v-model="dialog"
        width="500"
    >
        <v-card>
            <v-card-title class="title primary grey--text text--lighten-3 py-3" primary-title>
                Подтвердите действие
            </v-card-title>

            <v-card-text class="pt-3">
                <p class="mb-0 body-1 grey--text text--darken-2">{{ text }}</p>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
                <v-spacer/>
                <v-btn
                    text
                    color="error"
                    @click="onConfirm"
                >
                    Да
                </v-btn>
                <v-btn
                    text
                    color="primary"
                    @click="close"
                >
                    Нет
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class ConfirmDialog extends Vue {
        text = '';
        dialog = false;

        open(text: string) {
            this.text = text;
            this.dialog = true;
        }

        close() {
            this.dialog = false;
        }

        onConfirm() {
            this.$emit('confirm');
            this.close();
        }
    }
</script>

<style scoped>

</style>
