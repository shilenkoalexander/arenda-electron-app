-- Up

alter table contracts
    add column
        calculation_start_date date not null default '2020-01-01';

-- Down

