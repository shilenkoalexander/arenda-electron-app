<template>
    <div>
        <v-row>
            <v-col>
                {{orderNumber}}. {{objectItem.address}}
            </v-col>
        </v-row>
        <v-row>
            <v-col class="d-flex py-1" cols="3">
                <p class="mb-0 mr-1 grey--text">Арендная плата:</p>
                {{objectItem.payment + ' ' + CURRENCY}}
            </v-col>
            <v-col class="d-flex py-1" cols="3">
                <p class="mb-0 mr-1 grey--text">Арендная ставка:</p>
                {{objectItem.rentalRate + ' %'}}
            </v-col>
            <v-col class="d-flex py-1" cols="5">
                <p class="mb-0 mr-1 grey--text">Вид деятельности:</p>
                {{objectItem.businessType}}
            </v-col>
        </v-row>
        <v-row>
            <v-col class="d-flex py-1" cols="6">
                <p class="mb-0 mr-1 grey--text">На балансе:</p>
                {{objectItem.onBalance}}
            </v-col>
            <v-col class="d-flex py-1" v-if="objectItem.subtenantsCount > 0">
                <p class="mb-0 mr-1 grey--text">Количество субарендаторов:</p>
                {{objectItem.subtenantsCount}}
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ShortObjectDetails } from '@/types/objects';
import { CURRENCY } from '@/utils/finance-util';

@Component
export default class ContractDetailsObjectItem extends Vue {
    @Prop({
        type: Number,
        required: true,
    })
    orderNumber!: number;

    @Prop({
        type: Object,
        required: true,
    })
    objectItem!: ShortObjectDetails;

    CURRENCY = CURRENCY;
}
</script>

<style scoped>

</style>
