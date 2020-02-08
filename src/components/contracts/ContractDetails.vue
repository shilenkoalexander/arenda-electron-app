<template>
    <v-container fluid>
        <v-row>
            <v-col class="d-flex" align-self="center">
                <p class="mb-0 title text--secondary">№ договора: </p>
                <p class="mb-0 ml-1 title">{{item.contractInfo.number}}</p>
            </v-col>
            <v-col class="d-flex" align-self="center">
                <p class="mb-0 subtitle-1 text--secondary">Статус:</p>
                <v-icon :color="statusIconColor" size="30" class="ml-1">
                    {{statusIcon}}
                </v-icon>
                <p class="mb-0 subtitle-1">{{status}}</p>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FullContractDetails, getContractStatusValue } from '@/types/contracts';
import { getContractDetails } from '@/backend/service/contracts-service';
import { getIconByStatus, getIconColorByStatus } from '@/utils/icon-utils';

@Component
export default class ContractDetails extends Vue {
    @Prop({
        required: true,
        type: Number,
    })
    id!: number;

    item: FullContractDetails | null = null;
    getContractStatusValue = getContractStatusValue;

    created() {
        this.item = getContractDetails(this.id);
    }

    get statusIcon(): string {
        if (!this.item) {
            return '';
        }
        return getIconByStatus(this.item.contractInfo.status);
    }

    get statusIconColor(): string {
        if (!this.item) {
            return '';
        }
        return getIconColorByStatus(this.item.contractInfo.status);
    }

    get status(): string {
        if (!this.item) {
            return '';
        }
        return getContractStatusValue(this.item.contractInfo.status);
    }
}
</script>

<style scoped>

</style>
