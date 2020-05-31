import { Directory } from '@/model/types/common-types';
import { selectArray } from '@/model/repository/repository';
import { ResultMapperFactory } from '@/model/mapper/result-mapper-factory';

export function getAreas(): Directory[] {
    return selectArray('select * from areas', ResultMapperFactory.directoryMapper);
}

export function getBusinessTypes(): Directory[] {
    return selectArray('select * from business_types', ResultMapperFactory.directoryMapper);
}
