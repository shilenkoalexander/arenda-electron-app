import {
    AddContractMainInfoDto,
    ContractExtension,
    ContractPageMainInfo,
    ContractWithTenant,
    FullContractDetails,
    FullContractExtension,
} from '@/model/types/contract-types';
import { ResultMapperFactory } from '@/model/mapper/result-mapper-factory';
import { InputItem, Page, Pagination } from '@/types/common';
import { executeInTransaction, findFirst, queryWithPagination, selectArray } from '@/model/repository/repository';
import { ContractsOrderMapper } from '@/model/mapper/order-mapper';
import { contractFilterToWhereClause, ContractsFilter } from '@/model/filter/filter';
import db from 'better-sqlite3-helper';
import { getContactsByTenantId } from '@/model/repository/contact-repository';
import { getShortObjectDetailsByContractId, saveObject } from '@/model/repository/objects-repository';
import { EditObjectDto } from '@/model/types/objects-types';
import { PaymentContractInfo } from '@/model/types/finance-types';
import Optional from '@/model/utils/optional';
import { insertIndexingSign } from '@/model/repository/finance-repository';
import Period from '@/model/utils/period';

export function getAllContracts(pagination: Pagination, filter: ContractsFilter | null): Page<ContractWithTenant> {
    const query = `
        select c.id,
               c.contract_number,
               c.start_date,
               c.validity,
               t.organization_name,
               t.responsible_person,
               t.legal_address,
               t.inn,
               tt.name as tenant_type,
               cs.name as status
        from contracts c
                 inner join tenants t on t.id = c.id_tenant
                 inner join tenant_types tt on tt.id = t.id_tenant_type
                 inner join contract_statuses cs on cs.id = c.id_status
        ${contractFilterToWhereClause(filter)}
        group by c.id`;
    return queryWithPagination(query, pagination, ResultMapperFactory.contractMapper, new ContractsOrderMapper());
}

export function getContractDetails(id: number): FullContractDetails {
    const query = `
        select c.id,
               c.contract_number,
               c.start_date,
               c.validity,
               c.end_date,
               c.end_reason,
               cs.name as status,
               ct.name as contract_type,
               ext.last_contract_extension_from,
               ext.last_contract_extension_to,
               T.id    as tenant_id,
               T.organization_name,
               T.responsible_person,
               T.inn,
               T.legal_address,
               tt.name as tenant_type
        from contracts c
                 left join tenants t on c.id_tenant = t.id
                 left join tenant_types tt on t.id_tenant_type = tt.id
                 left join contract_statuses cs on c.id_status = cs.id
                 left join contract_type ct on c.id_type = ct.id
                 left join
             (
                 select ce.start_date as last_contract_extension_from, to_date as last_contract_extension_to
                 from contract_extensions ce
                 where ce.id_contract = ${id}
                 order by ce.start_date desc
                 limit 1
             ) as ext
        where c.id = ${id}
    `;

    const contractInfo = findFirst(query).orElseThrowWithMessage(`Отсутствует информация о контракте с id = ${id}`);
    const contacts = getContactsByTenantId(contractInfo.tenant_id);
    const objectsInfo = getShortObjectDetailsByContractId(id);

    return ResultMapperFactory.fullContractDetailsMapper.map(
        {
            ...contractInfo,
            contacts,
            objectsInfo,
        },
    );
}

// todo маппер сделать для этого
export function getContractTypes(): InputItem[] {
    const result = db().query(`select *
                               from contract_type`);

    return result.map((value) => ({
        text: value.name,
        value: value.id,
    }));
}

// todo добавить даты всякие
export function saveNewContractWithObjects(contractInfo: AddContractMainInfoDto, objects: EditObjectDto[]) {
    executeInTransaction(() => {
        const contractId = db().insert('contracts', {
            id_tenant: contractInfo.tenantId,
            id_status: 1,
            id_type: contractInfo.contractTypeId,
            contract_number: contractInfo.contractNumber,
            start_date: contractInfo.startDate,
            validity: contractInfo.validity,
        });

        // todo: тут поменять на calculationStartDate
        insertIndexingSign(contractId, Period.ofString(contractInfo.startDate), true);
        objects.forEach((object) => saveObject(contractId, object));
    });
}

// todo добавить даты всякие
export function saveNewContract(contractInfo: AddContractMainInfoDto): number | null {
    let contractId: number | null = null;
    executeInTransaction(() => {
        contractId = db().insert('contracts', {
            id_tenant: contractInfo.tenantId,
            id_status: 1,
            id_type: contractInfo.contractTypeId,
            contract_number: contractInfo.contractNumber,
            start_date: contractInfo.startDate,
            validity: contractInfo.validity,
        });

        // todo: тут поменять на calculationStartDate
        insertIndexingSign(contractId, Period.ofString(contractInfo.startDate), contractInfo.indexing);
    });

    return contractId;
}

export function getContractMainPageInfo(contractId: number): Optional<ContractPageMainInfo> {
    const result = findFirst(
        `select t.id as tenant_id,
                       t.responsible_person,
                       t.organization_name,
                       c.contract_number,
                       ct.name as contract_type,
                       c.calculation_start_date,
                       c.validity
                from contracts c
                         inner join tenants t on t.id = c.id_tenant
                         inner join contract_type ct on c.id_type = ct.id
                where c.id = ${contractId}`);

    return result.map((value) => ResultMapperFactory.contractPageMainInfoMapper.map(value));
}

export function getPaymentContractInfo(contractId: number): Optional<PaymentContractInfo> {
    const result = findFirst(`
        select total_payment, payment_actuality_date, start_date
        from contracts
        where id = ${contractId}
    `);

    return result.map((value) => ResultMapperFactory.paymentContractInfoMapper.map(value));
}

export function getContractExtensions(
    contractId: number,
): ContractExtension[] {
    return selectArray(`
            select start_date, to_date, payment, payment_actuality_date
            from contract_extensions
            where id_contract = ${contractId}
        `,
        ResultMapperFactory.contractExtensionMapper,
    );
}

export function getFullContractExtensions(contractId: number): FullContractExtension[] {
    return selectArray(`
            select *
            from contract_extensions
            where id_contract = ${contractId}
            order by start_date desc
        `,
        ResultMapperFactory.fullContractExtensionMapper,
    );
}
