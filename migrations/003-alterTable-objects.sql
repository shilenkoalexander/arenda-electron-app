-- Up

alter table objects RENAME COLUMN disposition_date to decision_date;
alter table objects RENAME COLUMN disposition_maker to decision_maker;
alter table objects RENAME COLUMN disposition_number to decision_number;

-- Down
