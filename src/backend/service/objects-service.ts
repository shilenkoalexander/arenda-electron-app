import { FullObjectDetails, ObjectInformation } from '@/backend/types/objects-types';
import {
    getFullObjectsDetailsByContractId,
    getObjectInformationByObjectsId,
    getSubtenantsByObjectsIds,
} from '@/backend/repository/objects-repository';
import { AssociativeArrayItem } from '@/types/common';
import { isEmpty } from '@/backend/utils/other-util';

export function objectInformationToAssociativeArrayItem(objectInformation: ObjectInformation): AssociativeArrayItem {
    return {
        key: objectInformation.name,
        value: objectInformation.value,
    };
}

export function getFullObjectsDetails(contractId: number): FullObjectDetails[] {
    const fullObjectsDetails = getFullObjectsDetailsByContractId(contractId);

    if (isEmpty(fullObjectsDetails)) {
        return [];
    }

    const objectsIds = fullObjectsDetails.map((value) => value.id);

    const objectInfos = getObjectInformationByObjectsId(objectsIds);
    const subtenants = getSubtenantsByObjectsIds(objectsIds);

    fullObjectsDetails.forEach((object) => {
        object.objectIndividualInformation = objectInfos
            .filter((objectInformation) => objectInformation.objectId === object.id)
            .map(objectInformationToAssociativeArrayItem);
        object.subtenants = subtenants.filter((subtenant) => subtenant.objectId === object.id);
    });

    return fullObjectsDetails;
}
