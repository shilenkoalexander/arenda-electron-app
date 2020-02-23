import db from 'better-sqlite3-helper';
import { ShortObjectDetails } from '@/types/objects';
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
    ) as any;

    objectsInfo.forEach((value: any) => {
        value.objectIndividualInformation = getObjectInformationByObjectId(value.id);
    });

    return objectsInfo.map(ResultMapperFactory.objectShortDetailsMapper.map);
}
