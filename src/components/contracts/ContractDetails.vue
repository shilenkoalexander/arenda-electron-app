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

        <v-row>
            <v-col cols="4">
                <Label class="mt-2" label="Вид договора" :value="item.contractInfo.type"/>
            </v-col>
            <v-col cols="4">
                <Label label="Дата заключения" :value="formatToFriendly(item.contractInfo.startDate)"/>
            </v-col>
            <v-col cols="4">
                <Label
                        v-if="!isClosed"
                        label="Дата действия"
                        :value="formatToFriendly(item.contractInfo.validity)"
                />
            </v-col>
        </v-row>

        <v-row v-if="isClosed">
            <v-col cols="4">
                <Label label="Дата расторжения" :value="formatToFriendly(item.contractInfo.endDate)"/>
            </v-col>
            <v-col cols="4">
                <Label label="Причина расторжения" :value="item.contractInfo.endReason"/>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <Header value="Арендатор"/>
            </v-col>
            <v-col cols="4">
                <Label label="Название организации" :value="item.tenantInfo.fullName"/>
            </v-col>
            <v-col cols="4">
                <Label label="Юридический адрес" :value="item.tenantInfo.legalAddress"/>
            </v-col>
            <v-col cols="4">
                <Label label="ИНН" :value="item.tenantInfo.inn"/>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <Header value="Контакты"/>
            </v-col>
            <v-col cols="4" v-for="(contact, index) in item.contacts" :key="'c' + index">
                <Label
                        :label="getContactTypeValue(contact.type)"
                        :value="contact.contact"
                />
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <Header value="Активные объекты"/>
            </v-col>
            <v-col>
                <template v-if="item.objectsInfo.length > 0">
                    <ContractDetailsObjects :items="item.objectsInfo"/>
                </template>
                <template v-else>
                    <p class="mb-0">Объекты отсутствуют</p>
                </template>
            </v-col>
        </v-row>
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
    import ContractDetailsHeader from '@/components/contracts/ContractDetailsHeader.vue';
    import ContractDetailsObjects from '@/components/contracts/ContractDetailsObjects.vue';
    import Label from '@/components/Label.vue';
    import Header from '@/components/Header.vue';

    @Component({
        components: {
            Header,
            Label,
            ContractDetailsHeader,
            ContractDetailsObjects,
        },
    })
    export default class ContractDetails extends Vue {
        @Prop({
            required: true,
            type: Object,
        })
        item!: FullContractDetails;

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

<style scoped lang="scss">

</style>
