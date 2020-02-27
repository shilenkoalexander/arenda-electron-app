<template>
    <v-container fluid class="py-1 item">
        <v-row class="py-0 px-3">
<!--            <v-col :cols="textCols" class="pb-0 pt-1 px-0">-->
                <p class="mb-0 mt-1 mr-3 grey--text">{{text}}:</p>
<!--            </v-col>-->
<!--            <v-col :cols="valueColsNumber" class="pb-0 pt-1 px-0">-->
                <router-link v-if="to" :to="to" class="clickable-text mt-1">
                    {{value}}
                </router-link>
                <p v-else class="mb-0 mt-1">{{value}}</p>
<!--            </v-col>-->
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class ContractInfoItem extends Vue {
        @Prop({
            type: String,
            required: true,
        })
        text!: string;

        @Prop({
            type: Number,
            default: 4,
        })
        textCols!: number;

        @Prop({
            type: String,
            required: true,
        })
        value!: string;

        @Prop({
            type: Number,
            default: null,
        })
        valueCols!: number | null;

        @Prop({
            type: String,
            default: null,
        })
        to!: string | null;

        get valueColsNumber(): number {
            return this.valueCols ? this.valueCols : 12 - this.textCols;
        }
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
