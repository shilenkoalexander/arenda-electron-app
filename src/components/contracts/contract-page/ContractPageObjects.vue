<template>
    <v-container fluid>
        <v-row v-if="objects.length > 0">
            <v-col cols="12" v-for="object in objects" :key="object.id">
                <ObjectDetailsCard :item="object" @edit="onEdit"/>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col class="text-center title font-weight-regular">
                Объекты отсутствуют
            </v-col>
        </v-row>
        <v-btn
                fixed
                fab
                right
                bottom
                color="primary"
                @click="onObjectAddClicked"
        >
            <v-icon>
                mdi-plus
            </v-icon>
        </v-btn>
        <NewObjectDialog ref="newObjectDialog" @update="update"/>
    </v-container>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { FullObjectDetailsWithSubtenants } from '@/model/types/objects-types';
    import { getFullObjectsDetails } from '@/model/service/objects-service';
    import ObjectDetailsCard from '@/components/contracts/contract-page/ObjectDetailsCard.vue';
    import NewObjectDialog from '@/components/contracts/edit-contract/NewObjectDialog.vue';

    @Component({
    components: {
        NewObjectDialog,
        ObjectDetailsCard,
    },
})
export default class ContractPageObjects extends Vue {
    @Prop({
        type: Number,
        required: true,
    })
    contractId!: number;

    @Prop({
        type: Date,
        required: true,
    })
    contractStartDate!: Date;

    @Prop({
        type: Date,
        required: true,
    })
    contractValidity!: Date;

    objects: FullObjectDetailsWithSubtenants[] = [];

    $refs!: {
        newObjectDialog: NewObjectDialog;
    };

    created() {
        this.update();
    }

    onEdit(id: number) {
        const found = this.objects.find((value) => value.id === id);

        if (found) {
            this.$refs.newObjectDialog.open(
                this.contractId,
                this.contractStartDate,
                this.contractValidity,
                found,
            );
        }
    }

    onObjectAddClicked() {
        this.$refs.newObjectDialog.open(this.contractId, this.contractStartDate, this.contractValidity);
    }

    update() {
        this.objects = getFullObjectsDetails(this.contractId);
    }
}
</script>

<style scoped>

</style>
