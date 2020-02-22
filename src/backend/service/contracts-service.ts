import { ContactType, Contract, ContractStatus, FullContractDetails } from '@/types/contracts';
import { TenantType } from '@/types/tenants';
import { getAllContracts } from '@/backend/repository/contract-repository';
import { Page, Pagination } from '@/types/common';
import { ContractsFilterInfo } from '@/backend/filter/filter';

export function getContracts(pagination: Pagination, filter: ContractsFilterInfo | null): Page<Contract> {
    return getAllContracts(pagination, filter);
}

export function getContractDetails(id: number): FullContractDetails {
    return {
        contractInfo: {
            id,
            number: '123321',
            inn: '546321',
            legalAddress: 'ул. Пушкина дом Колотушкина',
            organizationName: 'Моя оборона',
            tenantType: TenantType.LTD,
            status: ContractStatus.CLOSED,
            type: 'Бюджетные организации',
            responsiblePerson: 'Сан Саныч Можков',
            startDate: new Date(2019, 2, 8),
            endDate: new Date(2020, 12, 8),
            endReason: 'ываываываыва выа аыа ываываываы ываыва ы ваы ваы аыв аываыв аы аываываываы ываы аываываы',
            validity: new Date(2020, 12, 8),
            lastContractExtensionFrom: new Date(2020, 3, 8),
            lastContractExtensionTo: new Date(2020, 5, 8),
        },
        contacts: [
            { contact: '0713368012', type: ContactType.PHONE },
            { contact: 'sashazemzer@gmail.com', type: ContactType.EMAIL },
            { contact: 'vk.com/id33333', type: ContactType.SOCIAL },
        ],
        objectsInfo: [
            {
                id: 1,
                address: 'ул. НЕстерова',
                businessType: 'продажа котиков',
                onBalance: 'ЖЭК',
                payment: 300.2,
                rentalRate: 145.4,
                subtenantsCount: 2,
                startDate: new Date(2019, 2, 8),
                endDate: new Date(2020, 12, 8),
                objectIndividualInformation: {
                    custom1: 'dfdf',
                    custom2: 'dasdfsfsdffdf',
                    custom3: 'dgdfgfdhfghgffg',
                },
            },
            {
                id: 2,
                address: 'ул. НЕстерова',
                businessType: 'продажа котиков',
                onBalance: 'ЖЭК',
                payment: 300.2,
                rentalRate: 145.4,
                subtenantsCount: 2,
                startDate: new Date(2019, 2, 8),
                endDate: new Date(2020, 12, 8),
                objectIndividualInformation: {
                    custom1: 'dfdf',
                    custom2: 'dasdfsfsdffdf',
                    custom3: 'dgdfgfdhfghgffg',
                },
            },
        ],
    };
}
