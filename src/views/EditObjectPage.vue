<template>
    <CenteredCard lg="11">
        <ObjectForm v-if="editingObject" :editing-object="editingObject" @save="onSave" />
    </CenteredCard>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from '@/components/Header.vue';
import SubtenantsList from '@/components/contracts/contract-page/SubtenantsList.vue';
import EditableTextField from '@/components/EditableTextField.vue';
import CenteredCard from '@/components/CenteredCard.vue';
import DatePickerMenu from '@/components/DatePickerMenu.vue';
import Label from '@/components/Label.vue';
import AddContractSubtenantsForm from '@/components/contracts/edit-contract/AddContractSubtenantsForm.vue';
import ObjectDetailsCard from '@/components/contracts/contract-page/ObjectDetailsCard.vue';
import ObjectForm from '@/components/contracts/edit-contract/ObjectForm.vue';
import { EditObjectDto } from '@/model/types/objects-types';
import { getFullObjectForEditing } from '@/model/service/objects-service';
import { Route } from 'vue-router';

@Component({
        components: {
            ObjectForm,
            ObjectDetailsCard,
            AddContractSubtenantsForm,
            Label,
            DatePickerMenu,
            CenteredCard,
            Header,
            EditableTextField,
            SubtenantsList,
        },
    })
    export default class EditObjectPage extends Vue {
        objectId: number | null = null;
        editingObject: EditObjectDto | null = null;

        beforeRouteEnter(to: Route, from: Route, next: any) {
            const objectId = Number.parseInt(to.params.id, 10);
            const editingObject = getFullObjectForEditing(objectId).orNull();

            if (editingObject) {
                next(false);
            }

            next((vm: EditObjectPage) => {
                vm.objectId = objectId;
                vm.editingObject = editingObject;
            });
        }

        onSave(edited: EditObjectDto) {
            console.log(edited);
        }

    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }
</style>
