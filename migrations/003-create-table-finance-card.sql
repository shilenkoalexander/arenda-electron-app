-- Up

create table finance_card
(
    `id`          INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `id_contract` INTEGER                           NOT NULL,
    `period`      date,
    `accruals`    double,
    `adjustments` double,
    `payments`    double,
    `debt`        double,

    foreign key (id_contract) references contracts (id)
);

insert into finance_card
values (1, 1, '2020-04-01', 300, -50, 150, 100);

-- Down
