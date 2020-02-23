-- Up

insert into tenant_types
values (1, 'LTD');
insert into tenant_types
values (2, 'SE');
insert into tenant_types
values (3, 'PE');

insert into tenants
values (1, 1, 'Организация 1', 'Типочек 1', 'Адрес 1', 'ИНН');

insert into contract_statuses
values (1, 'ACTIVE');
insert into contract_statuses
values (2, 'EXTENDED');
insert into contract_statuses
values (3, 'PAUSED');
insert into contract_statuses
values (4, 'CLOSED');
insert into contract_statuses
values (5, 'UNKNOWN');

insert into contract_type
values (1, 'Бюджетные помещения');

insert into contracts
values (1, 1, 1, 1, '123', '2019-01-01', '2020-01-01', null, null);
insert into contracts
values (2, 1, 2, 1, '456', '2018-02-02', '2020-01-01', null, null);
insert into contracts
values (3, 1, 3, 1, '789', '2018-03-03', '2020-01-01', null, null);
insert into contracts
values (4, 1, 4, 1, '111', '2018-04-04', '2020-01-01', null, null);
insert into contracts
values (5, 1, 5, 1, '122', '2018-05-05', '2020-01-01', null, null);
insert into contracts
values (6, 1, 2, 1, '133', '2018-06-06', '2020-01-01', null, null);
insert into contracts
values (7, 1, 2, 1, '144', '2018-07-07', '2020-01-01', null, null);
insert into contracts
values (8, 1, 2, 1, '155', '2018-08-08', '2020-01-01', null, null);
insert into contracts
values (9, 1, 2, 1, '166', '2018-09-09', '2020-01-01', null, null);
insert into contracts
values (10, 1, 2, 1, '177', '2018-10-10', '2020-01-01', null, null);
insert into contracts
values (11, 1, 2, 1, '188', '2018-11-1', '2020-01-01', null, null);
insert into contracts
values (12, 1, 2, 1, '199', '2018-12-12', '2020-01-01', null, null);

insert into PAYMENTS
values (1, 1, '2019-07-09', '2019-07-01', 300);
insert into PAYMENTS
values (2, 1, '2019-08-10', '2019-08-01', 400);
insert into PAYMENTS
values (3, 1, '2019-08-11', '2019-08-01', 500);
insert into PAYMENTS
values (4, 1, '2019-09-12', '2019-09-01', 600);
insert into PAYMENTS
values (5, 1, '2019-10-13', '2019-10-01', 700);
insert into PAYMENTS
values (6, 1, '2019-11-14', '2019-11-01', 800);

insert into ACCRUALS
values (1, 1, '2019-07-09', '2019-07-01', 300);
insert into ACCRUALS
values (2, 1, '2019-08-10', '2019-08-01', 400);
insert into ACCRUALS
values (3, 1, '2019-08-11', '2019-08-01', 500);
insert into ACCRUALS
values (4, 1, '2019-09-12', '2019-09-01', 600);
insert into ACCRUALS
values (5, 1, '2019-10-13', '2019-10-01', 700);
insert into ACCRUALS
values (6, 1, '2019-11-14', '2019-11-01', 800);

insert into ADJUSTMENTS
values (1, 1, '2019-07-09', '2019-07-01', 300);
insert into ADJUSTMENTS
values (2, 1, '2019-08-10', '2019-08-01', 400);
insert into ADJUSTMENTS
values (3, 1, '2019-08-11', '2019-08-01', 500);
insert into ADJUSTMENTS
values (4, 1, '2019-09-12', '2019-09-01', 600);
insert into ADJUSTMENTS
values (5, 1, '2019-10-13', '2019-10-01', 700);
insert into ADJUSTMENTS
values (6, 1, '2019-11-14', '2019-11-01', 800);

insert into AREAS
VALUES (1, 'ЦГР');

insert into BUSINESS_TYPES
VALUES (1, 'Мясопереработка');

insert into OBJECTS
values (1, 1, 1, 1, 10, 'АСТЕЛИТ', 'ул. Жарова пожарова', null, 300, '2019-09-11', 150, '2019-09-12', '112233',
        'Крайников Краник Крыжовник',
        '2019-09-12', null);

insert into OBJECTS_INFORMATION
values (1, 1, 'Площадь', '20');

insert into OBJECTS_INFORMATION
values (2, 1, 'Количество стен', '3');

insert into OBJECTS_INFORMATION
values (3, 1, 'Количество потолков', '1');

insert into CONTRACT_EXTENSIONS
values (1, 1, '2019-10-01', '2019-12-12', '2019-10-01', 1000);

insert into contact_type
values (1, 'PHONE'),
       (2, 'EMAIL'),
       (3, 'SOCIAL'),
       (4, 'UNKNOWN');

insert into CONTACTS
values (1, 1, '+380743368012', 1),
       (2, 1, 'sasha@sasze.com', 2);

-- Down
