import { Contract, ContractStatus, FullContractDetails } from '@/types/contracts';
import { TenantType } from '@/types/tenants';

export function getContracts(): Contract[] {
    return [
        {
            id: 1,
            number: '123456',
            startDate: new Date(2019, 5, 10),
            endDate: new Date(2020, 5, 10),
            status: ContractStatus.ACTIVE,
            tenantInfo: {
                fullName: 'Путин Владимир Владимирович',
                inn: '65485',
                legalAddress: 'ул Пушкина дом Колотушкина',
                tenantType: TenantType.LTD,
            },
        },
        {
            id: 2,
            number: '123456',
            startDate: new Date(2019, 5, 10),
            endDate: new Date(2020, 5, 10),
            status: ContractStatus.CLOSED,
            tenantInfo: {
                fullName: 'Путин Владимир Владимирович',
                inn: '65485',
                legalAddress: 'ул Пушкина дом Колотушкина',
                tenantType: TenantType.PE,
            },
        },
        {
            id: 3,
            number: '123456',
            startDate: new Date(2019, 5, 10),
            endDate: new Date(2020, 5, 10),
            status: ContractStatus.PAUSED,
            tenantInfo: {
                fullName: 'Путин Владимир Владимирович',
                inn: '65485',
                legalAddress: 'ул Пушкина дом Колотушкина',
                tenantType: TenantType.SE,
            },
        },
        {
            id: 4,
            number: '123456',
            startDate: new Date(2019, 5, 10),
            endDate: new Date(2020, 5, 10),
            status: ContractStatus.EXTENDED,
            tenantInfo: {
                fullName: 'Путин Владимир Владимирович',
                inn: '65485',
                legalAddress: 'ул Пушкина дом Колотушкина',
                tenantType: TenantType.LTD,
            },
        },
        {
            id: 5,
            number: '123456',
            startDate: new Date(2019, 5, 10),
            endDate: new Date(2020, 5, 10),
            status: ContractStatus.UNKNOWN,
            tenantInfo: {
                fullName: 'Путин Владимир Владимирович',
                inn: '65485',
                legalAddress: 'ул Пушкина дом Колотушкина',
                tenantType: TenantType.LTD,
            },
        },
    ];
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
            status: ContractStatus.ACTIVE,
            type: 'type',
            responsiblePerson: 'Сан Саныч Можков',
            startDate: new Date(2019, 2, 8),
            endDate: new Date(2020, 12, 8),
            endReason: 'Патамучка',
            validity: new Date(2020, 12, 8),
            lastContractExtensionFrom: new Date(2020, 3, 8),
            lastContractExtensionTo: new Date(2020, 5, 8),
        },
        contacts: [
            '0713368012',
            '0713368012',
            '0713368012',
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
        ],
    };
}
