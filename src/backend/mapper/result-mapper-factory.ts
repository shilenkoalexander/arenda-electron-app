import {
    Contact,
    ContractExtension,
    ContractPageMainInfo,
    ContractWithTenant,
    FullContractDetails,
    FullContractExtension,
} from '@/backend/types/contract-types';
import { FullObjectDetails, ObjectInformation, ShortObjectDetails } from '@/backend/types/objects-types';
import {
    FinancePeriod,
    IndexingSign,
    InflationIndex,
    Payment,
    PaymentContractInfo,
} from '@/backend/types/finance-types';
import {
    ContactMapper,
    ContractExtensionMapper,
    ContractMapper,
    ContractPageMainInfoMapper,
    FinancePeriodMapper,
    FullContractDetailsMapper,
    FullContractExtensionMapper,
    FullObjectDetailsMapper,
    IndexingSignMapper,
    InflationIndexMapper,
    ObjectInformationMapper,
    PaymentContractInfoMapper,
    PaymentMapper,
    ResultMapper,
    ShortObjectDetailsMapper,
    SubtenantMapper,
} from '@/backend/mapper/result-mapper';
import { Subtenant } from '@/backend/types/tenants-types';

export class ResultMapperFactory {
    static readonly contactMapper: ResultMapper<Contact> = new ContactMapper();
    static readonly fullContractDetailsMapper: ResultMapper<FullContractDetails> = new FullContractDetailsMapper();
    static readonly contractMapper: ResultMapper<ContractWithTenant> = new ContractMapper();
    static readonly shortObjectDetailsMapper: ResultMapper<ShortObjectDetails> = new ShortObjectDetailsMapper();
    static readonly fullObjectDetailsMapper: ResultMapper<FullObjectDetails> = new FullObjectDetailsMapper();
    static readonly contractPageMainInfoMapper: ResultMapper<ContractPageMainInfo> = new ContractPageMainInfoMapper();
    static readonly financePeriodMapper: ResultMapper<FinancePeriod> = new FinancePeriodMapper();
    static readonly inflationIndexMapper: ResultMapper<InflationIndex> = new InflationIndexMapper();
    static readonly contractExtensionMapper: ResultMapper<ContractExtension> = new ContractExtensionMapper();
    static readonly paymentContractInfoMapper: ResultMapper<PaymentContractInfo> = new PaymentContractInfoMapper();
    static readonly paymentMapper: ResultMapper<Payment> = new PaymentMapper();
    static readonly indexingSignMapper: ResultMapper<IndexingSign> = new IndexingSignMapper();
    static readonly objectInformationMapper: ResultMapper<ObjectInformation> = new ObjectInformationMapper();
    static readonly subtenantMapper: ResultMapper<Subtenant> = new SubtenantMapper();
    static readonly fullContractExtensionMapper: ResultMapper<FullContractExtension>
        = new FullContractExtensionMapper();
}
