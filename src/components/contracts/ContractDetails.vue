<template>
    <v-container fluid class="px-10">
        <v-row>
            <v-col class="d-flex" align-self="center" cols="9">
                <p class="mb-0 title grey--text">№ договора: </p>
                <p class="mb-0 ml-1 title">{{item.contractInfo.number}}</p>
            </v-col>
            <v-col class="d-flex justify-end" align-self="center">
                <p class="mb-0 subtitle-1 grey--text">Статус:</p>
                <v-icon :color="statusIconColor" size="30" class="ml-1">
                    {{statusIcon}}
                </v-icon>
                <p class="mb-0 subtitle-1 ml-1">{{status}}</p>
            </v-col>
        </v-row>
        <v-divider/>

        <ContractDetailsItem class="mt-2" text="Вид договора" :value="item.contractInfo.type"/>
        <ContractDetailsItem text="Дата заключения" :value="formatToFriendly(item.contractInfo.startDate)"/>
        <ContractDetailsItem
                v-if="!isClosed"
                text="Дата действия"
                :value="formatToFriendly(item.contractInfo.validity)"
        />

        <template v-if="isClosed">
            <ContractDetailsItem text="Дата расторжения" :value="formatToFriendly(item.contractInfo.endDate)"/>
            <ContractDetailsItem text="Причина расторжения" :value="item.contractInfo.endReason"/>
        </template>

        <ContractDetailsHeader text="Арендатор"/>
        <ContractDetailsItem text="Название организации" :value="item.contractInfo.organizationName"/>
        <ContractDetailsItem text="Руководитель" :value="item.contractInfo.responsiblePerson"/>
        <ContractDetailsItem text="Юридический адрес" :value="item.contractInfo.legalAddress"/>
        <ContractDetailsItem text="ИНН" :value="item.contractInfo.inn"/>

        <ContractDetailsHeader text="Контакты"/>
        <ContractDetailsItem
                v-for="(contact, index) in item.contacts"
                :key="index"
                :text="getContactTypeValue(contact.type)"
                :value="contact.contact"
        />

        <ContractDetailsHeader text="Активные объекты"/>
        <ContractDetailsObjectItem
                v-for="(object, index) in item.objectsInfo"
                :key="object.id"
                :order-number="index + 1"
                :object-item="object"
        />
    </v-container>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';
    import {
        ContractStatus,
        FullContractDetails,
        getContactTypeValue,
        getContractStatusValue,
    } from '@/types/contracts';
    import { getIconByStatus, getIconColorByStatus } from '@/utils/icon-utils';
    import { formatToFriendly } from '@/utils/date-utils';
    import ContractDetailsItem from '@/components/contracts/ContractDetailsItem.vue';
    import ContractDetailsHeader from '@/components/contracts/ContractDetailsHeader.vue';
    import ContractDetailsObjectItem from '@/components/contracts/ContractDetailsObjectItem.vue';

    @Component({
        components: {
            ContractDetailsItem,
            ContractDetailsHeader,
            ContractDetailsObjectItem,
        },
    })
    export default class ContractDetails extends Vue {
        @Prop({
            required: true,
            type: Object,
        })
        item!: FullContractDetails;

        getContractStatusValue = getContractStatusValue;
        getContactTypeValue = getContactTypeValue;
        formatToFriendly = formatToFriendly;

        get statusIcon(): string {
            return getIconByStatus(this.item.contractInfo.status);
        }

        get statusIconColor(): string {
            return getIconColorByStatus(this.item.contractInfo.status);
        }

        get status(): string {
            return getContractStatusValue(this.item.contractInfo.status);
        }

        get isClosed() {
            return this.item.contractInfo.status === ContractStatus.CLOSED;
        }
    }
</script>

<style scoped>

</style>
