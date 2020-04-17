import db from 'better-sqlite3-helper';
import { AddObjectDto, ShortObjectDetails } from '@/types/objects';
import { ResultMapperFactory } from '@/backend/mapper/result-mapper';

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

    objectsInfo.forEach((value) => {
        value.objectIndividualInformation = getObjectInformationByObjectId(value.id);
    });

    return objectsInfo.map(ResultMapperFactory.objectShortDetailsMapper.map);
}


// todo удалить name из базы. end date надо ли validity

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

export function getTotalPayment(contractId: number): number { // todo: добавить получение даты (расчет на состояние ...)
    const result = db().queryFirstRow(`
        select sum(payment) as sum from objects where id_contract = ${contractId}
    `) as any;

    return result.sum;
}
