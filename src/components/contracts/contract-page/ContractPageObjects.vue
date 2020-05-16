<template>
    <v-container fluid>
        <v-row v-if="objects.length> 0">
            <v-col cols="12" v-for="object in objects" :key="object.id">
                <ObjectDetailsCard :item="object" @edit="onEdit"/>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col class="text-center title font-weight-regular">
                Объекты отсутствуют. Добавить? (кнопка)
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import { FullObjectDetailsWithSubtenants } from '@/backend/types/objects-types';
    import { getFullObjectsDetails } from '@/backend/service/objects-service';
    import ObjectDetailsCard from '@/components/contracts/contract-page/ObjectDetailsCard.vue';

    @Component({
        components: {
            ObjectDetailsCard,
        },
    })
    export default class ContractPageObjects extends Vue {
        @Prop({
            type: Number,
            required: true,
        })
        contractId!: number;

        objects: FullObjectDetailsWithSubtenants[] = [];

        created() {
            this.objects = getFullObjectsDetails(this.contractId);
        }

        onEdit(id: number) {
            this.$router.push(`/objects/edit/${id}`);
        }
    }
</script>

<style scoped>

</style>
