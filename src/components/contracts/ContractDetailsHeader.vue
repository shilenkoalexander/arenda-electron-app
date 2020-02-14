<template>
    <div>
        <v-row>
            <v-col>
                <p class="mb-0 title grey--text">{{text}}</p>
            </v-col>
        </v-row>
        <v-divider class="mb-2"/>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ContractDetailsHeader extends Vue {
    @Prop({
        type: String,
        required: true,
    })
    text!: string;
}
</script>

<style scoped>

</style>
