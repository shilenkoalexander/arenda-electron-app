import db from 'better-sqlite3-helper';
import { AddObjectDto, FullObjectDetails, ObjectInformation, ShortObjectDetails } from '@/backend/types/objects-types';
import { ResultMapperFactory } from '@/backend/mapper/result-mapper-factory';
import { toArrayString } from '@/backend/utils/sql-util';
import { Subtenant } from '@/backend/types/tenants-types';

export function getObjectInformationByObjectId(id: number): Record<string, string> {
    const result = db().query(`select * from objects_information where id_object = ${id}`);

    const obj = {} as Record<string, string>;
    result.forEach((value) => (obj[value.name] = value.value));

    return obj;
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

export function getSubtenantsByObjectsIds(ids: number[]): Subtenant[] {
    const result = db().query(`
        select
            id_object,
            full_name,
            square,
            start_date,
            end_date,
            bt.name as business_type
        from subtenants
        inner join business_types bt on subtenants.id_business_type = bt.id
        where id_object in ${toArrayString(ids)}
    `);

    return result.map((value) => ResultMapperFactory.subtenantMapper.map(value));
}

export function getObjectInformationByObjectsId(ids: number[]): ObjectInformation[] {
    const result = db().query(`
        select * from objects_information
        where id_object in ${toArrayString(ids)}
    `);

    return result.map((value) => ResultMapperFactory.objectInformationMapper.map(value));
}

export function getFullObjectsDetailsByContractId(contractId: number): FullObjectDetails[] {
    const result = db().query(`
        select o.id,
               bt.name as business_type,
               ar.name as area,
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
        where id_contract = ${contractId};
    `);

    return result.map((value) => ResultMapperFactory.fullObjectDetailsMapper.map(value));
}

// todo удалить name из базы. end date надо ли validity (upd. не надо. и так норм)
export function saveObject(contractId: number, object: AddObjectDto) {
    db().transaction(() => {
        const objectId = db().insert('objects', {
            id_contract: contractId,
            id_business_type: object.businessTypeId,
            id_area: object.areaId,
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
                name: value.key,
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
                id_business_type: value.businessTypeId,
            });
        });
    })();
}
