<template>
    <v-container fluid>
        <v-row justify="space-between">
            <v-col cols="1"></v-col>
            <v-col cols="4">
                <p class="mb-0 text-center subtitle-1">Информация об объектах</p>
            </v-col>
            <v-col cols="1" class="text-end">
                <v-btn icon class="mr-3">
                    <v-icon size="25">
                        mdi-plus
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-divider/>
        <v-row>
            <v-col class="py-0">
                <ObjectListItems/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ObjectListItems from '@/components/contracts/object-list/ObjectListItems.vue';

@Component({
    components: {
        ObjectListItems,
    },
})
export default class ObjectList extends Vue {

}
</script>

<style scoped>

</style>
