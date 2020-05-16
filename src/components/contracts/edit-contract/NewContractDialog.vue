<template>
    <v-dialog
            v-model="dialog"
            width="40%"
    >
        <v-card class="px-5">
            <EditContractForm @save="onSave"/>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import EditContractForm from '@/components/contracts/edit-contract/EditContractForm.vue';
    import { AddContractMainInfoDto } from '@/backend/types/contract-types';
    import { saveNewContract } from '@/backend/repository/contract-repository';

    @Component({
        components: { EditContractForm },
    })
    export default class NewContractDialog extends Vue {
        dialog = false;

        onSave(addContractMainInfoDto: AddContractMainInfoDto) {
            const insertedId = saveNewContract(addContractMainInfoDto);
            if (insertedId) {
                this.$router.push(`/contract/${insertedId}`);
                this.close();
            }
        }

        public open() {
            this.dialog = true;
        }

        close() {
            this.dialog = false;
        }
    }
</script>

<style scoped>

</style>
