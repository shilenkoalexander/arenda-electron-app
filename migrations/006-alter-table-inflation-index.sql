-- Up

drop table if exists inflation_index;

create table inflation_index
(
    `id`     INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `index`  double,
    `period` date,
    `date`   date
);

insert into inflation_index
values (1, 1.001, '2020-03-01', '2020-04-08'),
       (2, 0.98, '2020-04-01', '2020-05-08'),
       (3, 1.02, '2020-05-01', '2020-06-08'),
       (4, 1.03, '2020-06-01', '2020-07-08')
;

-- Down

drop table if exists inflation_index;
