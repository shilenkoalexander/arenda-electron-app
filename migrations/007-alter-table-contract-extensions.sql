-- Up

alter table contract_extensions
    add payment_actuality_date date not null default '2020-01-01';

-- Down

