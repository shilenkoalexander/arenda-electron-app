import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { AddObjectDto } from '@/types/objects';

@Module({ name: 'add-contract' })
export default class AddContractModule extends VuexModule {
    objects: AddObjectDto[] = [];
    tenantId: number | null = null;
    contractNumber = '';
    startDate = '';
    validity = '';
    contractTypeId: number | null = null;
    indexing = false;

    editingObjectIndex: number | null = null;

    @Mutation
    addObject(object: AddObjectDto) {
        this.objects.push(object);
    }

    @Mutation
    removeObject(index: number) {
        this.objects = this.objects.filter((value) => value.index !== index);
    }

    @Mutation
    editObject(index: number) {
        this.editingObjectIndex = index;
    }

    get editingObject() {
        return this.objects.filter((value) => value.index === this.editingObjectIndex)[0];
    }

    @Mutation
    saveEditingObject(object: AddObjectDto) {
        const editingObj = this.objects.filter((value) => value.index === this.editingObjectIndex)[0];
        console.log(editingObj);
        for (const field in object) {
            if (
                Object.prototype.hasOwnProperty.call(object, field)
                && Object.prototype.hasOwnProperty.call(editingObj, field)
            ) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                editingObj[field] = object[field];
            }
        }

        this.editingObjectIndex = null;
    }

    @Mutation
    setTenantId(tenantId: number | null) {
        this.tenantId = tenantId;
    }

    @Mutation
    setStartDate(startDate: string) {
        this.startDate = startDate;
    }

    @Mutation
    setValidity(validity: string) {
        this.validity = validity;
    }

    @Mutation
    setContractNumber(contractNumber: string) {
        this.contractNumber = contractNumber;
    }

    @Mutation
    setContractTypeId(contractTypeId: number | null) {
        this.contractTypeId = contractTypeId;
    }

    @Mutation
    setIndexing(indexing: boolean) {
        this.indexing = indexing;
    }

    @Mutation
    clearContract() {
        this.objects = [];
        this.tenantId = null;
        this.contractNumber = '';
        this.startDate = '';
        this.validity = '';
        this.contractTypeId = null;
        this.indexing = false;
    }
}
