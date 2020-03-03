<template>
    <v-card>
        <v-container fluid class="py-0">
            <v-row>
                <v-col class="pt-0">
                    <ObjectListItems/>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ObjectDetailsCard from '@/components/contracts/contract-page/ObjectDetailsCard.vue';
import ObjectListItems from '@/components/object-list/ObjectListItems.vue';

@Component({
    components: {
        ObjectListItems,
        ObjectDetailsCard,
    },
})
export default class ObjectListCard extends Vue {

}
</script>

<style scoped>

</style>
