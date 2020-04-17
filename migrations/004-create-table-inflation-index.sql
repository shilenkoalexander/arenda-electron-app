-- Up

create table inflation_index
(
    `id`         INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `index`      double,
    `date_start` date
);

insert into inflation_index
values (1, 1.001, '2018-01-01');

-- Down

drop table if exists inflation_index;
