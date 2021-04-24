<template>
    <v-dialog
            v-model="dialog"
            width="90%"
    >
        <v-card class="px-5">
            <ObjectForm
                    :editing-object="editingObject"
                    :contract-start-date="contractStartDate"
                    :contract-validity="contractValidity"
                    @save="onSave"
                    @cancel="close"
            />
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EditContractForm from '@/components/contracts/edit-contract/EditContractForm.vue';
import ObjectForm from '@/components/contracts/edit-contract/ObjectForm.vue';
import { EditObjectDto } from '@/model/types/objects-types';
import { saveNewObject, updateObject } from '@/model/repository/objects-repository';

@Component({
    components: { ObjectForm, EditContractForm },
})
export default class NewObjectDialog extends Vue {
    dialog = false;

    editingObject: EditObjectDto | null = null;
    contractId: number | null = null;
    contractStartDate: Date | null = null;
    contractValidity: Date | null = null;

    onSave(edited: EditObjectDto) {
        if (this.contractId) {
            if (this.editingObject) {
                updateObject(this.contractId, edited);
            } else {
                saveNewObject(this.contractId, edited);
            }
        }
        this.close();
        this.$emit('update');
    }

    public open(
        contractId: number,
        contractStartDate: Date,
        contractValidity: Date,
        editingObject?: EditObjectDto,
    ) {
        this.contractStartDate = contractStartDate;
        this.contractValidity = contractValidity;
        this.contractId = contractId;
        this.editingObject = editingObject || null;
        this.dialog = true;
    }

    close() {
        this.dialog = false;
    }
}
</script>

<style scoped>

</style>
