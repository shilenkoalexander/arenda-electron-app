<template>
    <v-container fluid class="py-1" :class="itemClasses">
        <v-row class="py-0 px-3">
            <p class="mb-0 mt-1 mr-3" :class="textClasses">
                {{text}}<span v-if="value">:</span>
            </p>
            <template v-if="value">
                <router-link v-if="to" :to="to" class="mt-1" :class="valueClasses">
                    {{value}}
                </router-link>
                <p v-else class="mb-0 mt-1" :class="valueClasses">{{value}}</p>
            </template>
        </v-row>
        <v-divider v-if="header"/>
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
            default: null,
        })
        value!: string | null;

        @Prop({
            type: String,
            default: null,
        })
        to!: string | null;

        @Prop({
            type: Boolean,
            default: false,
        })
        header!: boolean;

        get itemClasses(): string[] {
            if (this.header) {
                return [];
            }
            return ['item'];
        }

        get textClasses(): string[] {
            if (this.header) {
                return ['title', 'grey--text'];
            }
            return ['grey--text'];
        }

        get valueClasses(): string[] {
            const classes = [];
            if (this.header) {
                classes.push('title');
            }
            if (this.to) {
                classes.push('clickable-text');
            }
            return classes;
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
        background-color: white;
    }

</style>
