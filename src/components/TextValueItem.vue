<template>
    <v-container fluid class="py-1 item">
        <v-row class="py-0 px-3">
                <p class="mb-0 mt-1 mr-3 grey--text">{{text}}:</p>
                <router-link v-if="to" :to="to" class="clickable-text mt-1">
                    {{value}}
                </router-link>
                <p v-else class="mb-0 mt-1">{{value}}</p>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class TextValueItem extends Vue {
        @Prop({
            type: String,
            required: true,
        })
        text!: string;

        @Prop({
            type: String,
            required: true,
        })
        value!: string;

        @Prop({
            type: String,
            default: null,
        })
        to!: string | null;

    }
</script>

<style scoped lang="scss">
    .clickable-text {
        color: #2f518a;
        font-size: 16px;
    }

    .item {
        border: 1px #ece9e4 solid;
        border-radius: 5px;
    }
</style>
