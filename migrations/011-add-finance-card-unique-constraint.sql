-- Up

create unique index finance_card_id_contract_period_uindex
    on finance_card (id_contract, period);

-- Down

