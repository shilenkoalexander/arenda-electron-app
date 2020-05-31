import { EditObjectDto, FullObjectDetailsWithSubtenants } from '@/model/types/objects-types';
import {
    getFullObjectDetailsByObjectId,
    getFullObjectsDetailsByContractId,
    getObjectInformationByObjectId,
    getObjectInformationByObjectsId,
    getSubtenantsByObjectId,
    getSubtenantsByObjectsIds,
} from '@/model/repository/objects-repository';
import { isEmpty } from '@/model/utils/other-util';
import Optional from '@/model/utils/optional';

export function getFullObjectsDetails(contractId: number): FullObjectDetailsWithSubtenants[] {
    const fullObjectsDetails = getFullObjectsDetailsByContractId(contractId);

    if (isEmpty(fullObjectsDetails)) {
        return [];
    }

    const objectsIds = fullObjectsDetails.map((value) => value.id);

    const objectInfos = getObjectInformationByObjectsId(objectsIds);
    const subtenants = getSubtenantsByObjectsIds(objectsIds);

    fullObjectsDetails.forEach((object) => {
        object.objectIndividualInformation = objectInfos
            .filter((objectInformation) => objectInformation.objectId === object.id);
        object.subtenants = subtenants.filter((subtenant) => subtenant.objectId === object.id);
    });

    return fullObjectsDetails;
}

export function getFullObjectForEditing(objectId: number): Optional<EditObjectDto> {
    return getFullObjectDetailsByObjectId(objectId)
        .map((value) => ({
            ...value,
            subtenants: getSubtenantsByObjectId(objectId),
            objectIndividualInformation: getObjectInformationByObjectId(objectId),
        }));
}
