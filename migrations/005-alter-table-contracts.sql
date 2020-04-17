-- Up

alter table contracts
    add column conclusion_date date;
alter table contracts
    add column payment_actuality_date date;
alter table contracts
    add column total_payment double;

-- Down

drop table if exists contracts;
