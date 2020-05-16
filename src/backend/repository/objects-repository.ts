import db from 'better-sqlite3-helper';
import {
    EditObjectDto,
    FullObjectDetailsWithSubtenants,
    ObjectInformation,
    ShortObjectDetails,
} from '@/backend/types/objects-types';
import { ResultMapperFactory } from '@/backend/mapper/result-mapper-factory';
import { toArrayString } from '@/backend/utils/sql-util';
import { SubtenantWithObjectId } from '@/backend/types/tenants-types';
import { executeInTransaction, findFirst, selectArray } from '@/backend/repository/repository';
import Optional from '@/backend/utils/optional';

/*export function getObjectInformationByObjectId(id: number): Record<string, string> {
    const result = db().query(`select * from objects_information where id_object = ${id}`);

    const obj = {} as Record<string, string>;
    result.forEach((value) => (obj[value.name] = value.value));

    return obj;
}*/


export function getObjectInformationByObjectId(objectId: number): ObjectInformation[] {
    return selectArray(`
            select * from objects_information
            where id_object = ${objectId}
        `,
        ResultMapperFactory.objectInformationMapper,
    );
}

export function getShortObjectDetailsByContractId(contractId: number): ShortObjectDetails[] {
    const objectsInfo = db().query(
        `select o.id,
                    o.address,
                    o.name,
                    o.on_balance,
                    o.payment,
                    o.rental_rate,
                    bt.name                                                      as business_type,
                    o.start_date,
                    (select count(*) from subtenants s where s.id_object = o.id) as subtenants_count
             from objects o
                      left join business_types bt on o.id_business_type = bt.id
             where o.id_contract = ${contractId}`,
    );

    // todo безобразие
    objectsInfo.forEach((value) => {
        value.objectIndividualInformation = getObjectInformationByObjectId(value.id);
    });

    return objectsInfo.map((value) => ResultMapperFactory.shortObjectDetailsMapper.map(value));
}

export function getSubtenantsByObjectId(objectId: number): SubtenantWithObjectId[] {
    return selectArray(`
            select
                s.id,
                id_object,
                full_name,
                square,
                start_date,
                end_date,
                bt.name as business_type
            from subtenants s
            inner join business_types bt on s.id_business_type = bt.id
            where id_object = ${objectId}
        `,
        ResultMapperFactory.subtenantWithObjectIdResultMapper,
    );
}


export function getSubtenantsByObjectsIds(ids: number[]): SubtenantWithObjectId[] {
    return selectArray(`
            select
                s.id,
                id_object,
                full_name,
                square,
                start_date,
                end_date,
                bt.name as business_type
            from subtenants s
            inner join business_types bt on s.id_business_type = bt.id
            where id_object in ${toArrayString(ids)}
        `,
        ResultMapperFactory.subtenantWithObjectIdResultMapper,
    );
}

export function getObjectInformationByObjectsId(ids: number[]): ObjectInformation[] {
    return selectArray(`
            select * from objects_information
            where id_object in ${toArrayString(ids)}
        `,
        ResultMapperFactory.objectInformationMapper,
    );
}

export function getFullObjectDetailsByObjectId(objectId: number): Optional<FullObjectDetailsWithSubtenants> {
    return findFirst(`
            select o.id,
                bt.id as business_type_id,
                bt.name as business_type_name,
                ar.id as area_id,
                ar.name as area_name,
                address,
                on_balance,
                payment,
                rental_rate,
                start_date,
                end_date,
                expert_review_sum,
                expert_review_date,
                object_type,
                decision_date,
                decision_number,
                decision_maker
            from objects o
                     inner join areas ar on o.id_area = ar.id
                     inner join business_types bt on o.id_business_type = bt.id
            where o.id = ${objectId}
        `).map((value) => ResultMapperFactory.fullObjectDetailsWithSubtenantsMapper.map(value));
}

export function getFullObjectsDetailsByContractId(contractId: number): FullObjectDetailsWithSubtenants[] {
    return selectArray(`
            select o.id,
                bt.id as business_type_id,
                bt.name as business_type_name,
                ar.id as area_id,
                ar.name as area_name,
                address,
                on_balance,
                payment,
                rental_rate,
                start_date,
                end_date,
                expert_review_sum,
                expert_review_date,
                object_type,
                decision_date,
                decision_number,
                decision_maker
            from objects o
                     inner join areas ar on o.id_area = ar.id
                     inner join business_types bt on o.id_business_type = bt.id
            where id_contract = ${contractId}
        `,
        ResultMapperFactory.fullObjectDetailsWithSubtenantsMapper,
    );
}

// todo удалить name из базы. end date надо ли validity (upd. не надо. и так норм)
export function saveObject(contractId: number, object: EditObjectDto) {
    executeInTransaction(() => {
        const objectId = db().insert('objects', {
            id_contract: contractId,
            id_business_type: object.businessType.id,
            id_area: object.area.id,
            rental_rate: object.rentalRate,
            on_balance: object.onBalance,
            address: object.address,
            expert_review_sum: object.expertReviewSum,
            expert_review_date: object.expertReviewDate,
            payment: object.payment,
            decision_date: object.decisionDate,
            decision_number: object.decisionNumber,
            decision_maker: object.decisionMaker,
            start_date: object.startDate,
            end_date: object.endDate,
        });

        object.objectIndividualInformation.forEach((value) => {
            db().insert('objects_information', {
                id_object: objectId,
                name: value.name,
                value: value.value,
            });
        });

        object.subtenants.forEach((value) => {
            db().insert('subtenants', {
                id_object: objectId,
                full_name: value.name,
                square: value.square,
                start_date: value.startDate,
                end_date: value.endDate,
                id_business_type: value.businessType.id,
            });
        });
    });
}
