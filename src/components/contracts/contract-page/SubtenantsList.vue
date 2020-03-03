<template>
    <v-expansion-panels accordion hover>
        <v-expansion-panel
                v-for="(item,i) in items"
                :key="i + 's'"
        >
            <v-expansion-panel-header>
                <v-container fluid class="pa-0">
                    <v-row no-gutters>
                        <v-col cols="6" align-self="center" class="subtitle-1 py-0">
                            {{item.name}}
                        </v-col>
                        <v-col cols="3" offset="3" align-self="center">
                            Площадь: {{item.square}}
                        </v-col>
                    </v-row>
                </v-container>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
                <v-container fluid class="pa-0">
                    <v-row>
                        <v-col cols="6">
                            <TextValueItem text="Дата начала" :value="formatToFriendly(item.startDate)"/>
                        </v-col>
                        <v-col cols="6">
                            <TextValueItem text="Дата действия" :value="formatToFriendly(item.endDate)"/>
                        </v-col>
                        <v-col cols="12">
                            <TextValueItem text="Вид деятельности" :value="item.businessType"/>
                        </v-col>
                    </v-row>
                </v-container>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { Subtenant } from '@/types/tenants';
    import TextValueItem from '@/components/TextValueItem.vue';
    import { formatToFriendly } from '@/utils/date-utils';

    @Component({
        components: {
            TextValueItem,
        },
    })
    export default class SubtenantsList extends Vue {
        @Prop({
            type: Array,
            default: [],
        })
        items!: Subtenant[];

        formatToFriendly = formatToFriendly;
    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }
</style>
