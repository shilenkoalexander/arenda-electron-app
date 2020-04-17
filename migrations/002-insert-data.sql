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

insert into finance_action_type
values (1, 'ACCRUAL'),
       (2, 'ADJUSTMENT'),
       (3, 'PAYMENT');

insert into finance_action
values (1, 1, 1, '2019-07-09', '2019-07-01', 300),
       (2, 1, 1, '2019-08-10', '2019-08-01', 400),
       (3, 1, 1, '2019-08-11', '2019-08-01', 500),
       (4, 1, 1, '2019-09-12', '2019-09-01', 600),
       (5, 1, 1, '2019-10-13', '2019-10-01', 700),
       (6, 1, 1, '2019-11-14', '2019-11-01', 800);

insert into finance_action
values (7, 1, 2, '2019-07-09', '2019-07-01', 300),
       (8, 1, 2, '2019-08-10', '2019-08-01', 400),
       (9, 1, 2, '2019-08-11', '2019-08-01', 500),
       (10, 1, 2, '2019-09-12', '2019-09-01', 600),
       (11, 1, 2, '2019-10-13', '2019-10-01', 700),
       (12, 1, 2, '2019-11-14', '2019-11-01', 800);

insert into finance_action
values (13, 1, 3, '2019-07-09', '2019-07-01', 300),
       (14, 1, 3, '2019-08-10', '2019-08-01', 400),
       (15, 1, 3, '2019-08-11', '2019-08-01', 500),
       (16, 1, 3, '2019-09-12', '2019-09-01', 600),
       (17, 1, 3, '2019-10-13', '2019-10-01', 700),
       (18, 1, 3, '2019-11-14', '2019-11-01', 800);

insert into AREAS
VALUES (1, 'ЦГР');

insert into BUSINESS_TYPES
VALUES (1, 'Мясопереработка');

insert into OBJECTS
values (1, 1, 1, 1, 10,
        'АСТЕЛИТ', 'ул. Жарова пожарова', null, 300, '2019-09-11', 150, '2019-09-12', '112233',
        'Крайников Краник Крыжовник',
        '2019-09-12', null, 'Одноэтажное здание');

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

delete
from contacts;
delete
from contact_type;
delete
from CONTRACT_EXTENSIONS;
delete
from OBJECTS_INFORMATION;
delete
from OBJECTS;
delete
from BUSINESS_TYPES;
delete
from AREAS;
delete
from finance_action;
delete
from finance_action_type;
delete
from contracts;
delete
from contract_type;
delete
from contract_statuses;
delete
from tenants;
delete
from tenant_types;
