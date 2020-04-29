-- Up

CREATE TABLE `payments_temp`
(
    `id`          INTEGER,
    `id_contract` INTEGER,
    `date`        date,
    `period`      date,
    `sum`         double
);

insert into payments_temp
select id, id_contract, date, period, sum
from payments;

drop table payments;

CREATE TABLE `payments`
(
    `id`          INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `id_contract` INTEGER,
    `date`        date,
    `period`      date,
    `sum`         double,

    foreign key (id_contract) references contracts (id)
);

insert into payments
select id, id_contract, date, period, sum
from payments_temp;

drop table payments_temp;

-- Down

