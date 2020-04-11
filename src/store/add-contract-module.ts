import { Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { AddObjectDto } from '@/types/objects';

@Module({name: 'add-contract'})
export default class AddContract extends VuexModule {
    objects: AddObjectDto[] = [];
    tenantId: number | null = null;
    contractNumber = '';
    startDate = '';
    contractTypeId: number | null = null;
    indexing = false;

    @Mutation
    addObject(object: AddObjectDto) {
        this.objects.push(object);
    }
}
