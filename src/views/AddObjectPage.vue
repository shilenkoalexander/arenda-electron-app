<template>
    <CenteredCard lg="11">
        <ObjectForm :editing-object="editingObject" @save="onSave" @cancel="onCancel"/>
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
    import AddContractSubtenantsForm from '@/components/contracts/add-contract-page/AddContractSubtenantsForm.vue';
    import AddContractModule from '../store/add-contract-module';
    import { getModule } from 'vuex-module-decorators';
    import { EditObjectDto } from '@/backend/types/objects-types';
    import ObjectForm from '@/components/contracts/add-contract-page/ObjectForm.vue';

    @Component({
        components: {
            ObjectForm,
            AddContractSubtenantsForm,
            Label,
            DatePickerMenu,
            CenteredCard,
            Header,
            EditableTextField,
            SubtenantsList,
        },
    })
    export default class AddEditObject extends Vue {
        editingObject: EditObjectDto | null = null;

        created() {
            this.editingObject = this.$store.getters.editingObject;
        }

        get isEditingPage() {
            return this.$router.currentRoute.path === '/objects/new/edit';
        }

        onSave(edited: EditObjectDto) {
            const addContractState = this.$store.state.addContract;
            edited.id = this.isEditingPage ? addContractState.editingObjectIndex : addContractState.objects.length;

            const module = getModule(AddContractModule, this.$store);
            if (this.isEditingPage) {
                module.saveEditingObject(edited);
            } else {
                module.addObject(edited);
            }

            this.$router.back();
        }

        onCancel() {
            this.$router.back();
            this.editingObject = null;
        }

    }
</script>

<style scoped lang="scss">
    .col {
        padding: 5px 12px;
    }

    .mt-25px {
        margin-top: 25px;
    }

    .mt-4px {
        margin-top: 4px;
    }
</style>
