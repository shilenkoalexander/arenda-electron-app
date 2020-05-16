import { Directory } from '@/backend/types/common-types';
import { selectArray } from '@/backend/repository/repository';
import { ResultMapperFactory } from '@/backend/mapper/result-mapper-factory';

export function getAreas(): Directory[] {
    return selectArray('select * from areas', ResultMapperFactory.directoryMapper);
}

export function getBusinessTypes(): Directory[] {
    return selectArray('select * from business_types', ResultMapperFactory.directoryMapper);
}
