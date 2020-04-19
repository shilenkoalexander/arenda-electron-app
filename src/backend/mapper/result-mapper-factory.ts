import { Contact, ContractPageMainInfo, ContractWithTenant, FullContractDetails } from '@/types/contracts';
import { ShortObjectDetails } from '@/types/objects';
import { FinancePeriod, InflationIndex, PaymentContractInfo } from '@/types/finance';
import {
    ContactMapper,
    ContractExtensionMapper,
    ContractMapper,
    ContractPageMainInfoMapper,
    FinancialPeriodMapper,
    FullContractDetailsMapper,
    InflationIndexMapper,
    PaymentContractInfoMapper,
    ResultMapper,
    ShortObjectDetailsMapper,
} from '@/backend/mapper/result-mapper';
import { ContractExtension } from '@/backend/types/contract-types';

export class ResultMapperFactory {
    static readonly contactMapper: ResultMapper<Contact> = new ContactMapper();
    static readonly fullContractDetailsMapper: ResultMapper<FullContractDetails> = new FullContractDetailsMapper();
    static readonly contractMapper: ResultMapper<ContractWithTenant> = new ContractMapper();
    static readonly objectShortDetailsMapper: ResultMapper<ShortObjectDetails> = new ShortObjectDetailsMapper();
    static readonly contractPageMainInfoMapper: ResultMapper<ContractPageMainInfo> = new ContractPageMainInfoMapper();
    static readonly financePeriodMapper: ResultMapper<FinancePeriod> = new FinancialPeriodMapper();
    static readonly inflationIndexMapper: ResultMapper<InflationIndex> = new InflationIndexMapper();
    static readonly contractExtensionMapper: ResultMapper<ContractExtension> = new ContractExtensionMapper();
    static readonly paymentContractInfoMapper: ResultMapper<PaymentContractInfo> = new PaymentContractInfoMapper();
}
