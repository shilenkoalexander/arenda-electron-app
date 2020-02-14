CREATE TABLE IF NOT EXISTS `tenant_types`
(
    `id`   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `name` TEXT                              NOT NULL
);

CREATE TABLE IF NOT EXISTS `tenants`
(
    `id`                 INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `id_tenant_type`     INTEGER                           NOT NULL,
    `organization_name`  TEXT                              NOT NULL,
    `responsible_person` TEXT                              NOT NULL,
    `legal_address`      TEXT                              NOT NULL,
    `inn`                TEXT                              NOT NULL,

    foreign key (id_tenant_type) references tenant_types (id)
);

CREATE TABLE IF NOT EXISTS `contract_statuses`
(
    `id`   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `name` TEXT                              NOT NULL
);

CREATE TABLE IF NOT EXISTS `contract_type`
(
    `id`   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `name` TEXT                              NOT NULL
);

CREATE TABLE IF NOT EXISTS `contracts`
(
    `id`              INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `id_tenant`       INTEGER                           NOT NULL,
    `id_status`       INTEGER                           NOT NULL,
    `id_type`         INTEGER                           NULL,

    `contract_number` TEXT                              NOT NULL,
    `start_date`      date                              NOT NULL,
    `validity`        date                              NULL,
    `end_date`        date                              NULL,
    `end_reason`      TEXT                              NULL,

    foreign key (id_status) references contract_statuses (id),
    foreign key (id_tenant) references tenants (id),
    foreign key (id_type) references contract_type (id)
);


CREATE TABLE IF NOT EXISTS `adjustments`
(
    `id`          INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `id_contract` INTEGER                           NOT NULL,
    `date`        date                              NOT NULL,
    `period`      date                              NOT NULL,
    `sum`         double                            NOT NULL,

    foreign key (id_contract) references contracts (id)
);

CREATE TABLE IF NOT EXISTS `accruals`
(
    `id`          INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `id_contract` INTEGER                           NOT NULL,
    `date`        date                              NOT NULL,
    `period`      date                              NOT NULL,
    `sum`         double                            NOT NULL,

    foreign key (id_contract) references contracts (id)
);

CREATE TABLE IF NOT EXISTS `areas`
(
    `id`   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `name` TEXT                              NOT NULL
);

CREATE TABLE IF NOT EXISTS `business_types`
(
    `id`   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `name` TEXT                              NOT NULL
);

CREATE TABLE IF NOT EXISTS `payments`
(
    `id`          INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `id_contract` INTEGER                           NOT NULL,
    `date`        date                              NOT NULL,
    `period`      date                              NOT NULL,
    `sum`         double                            NOT NULL,

    foreign key (id_contract) references contracts (id)
);

CREATE TABLE IF NOT EXISTS `indexing`
(
    `id`          INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `period`      date                              NOT NULL,
    `indexing`    boolean                           NOT NULL,
    `id_contract` INTEGER                           NOT NULL,

    foreign key (id_contract) references contracts (id)
);

CREATE TABLE IF NOT EXISTS `premise_types`
(
    `id`   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `name` TEXT                              NOT NULL
);

CREATE TABLE IF NOT EXISTS `contacts`
(
    `id`        INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `id_tenant` INTEGER                           NOT NULL,
    `contact`   TEXT                              NOT NULL,
    `comment`   TEXT                              NULL,

    foreign key (id_tenant) references tenants (id)
);

CREATE TABLE IF NOT EXISTS `contract_extensions`
(
    `id`              INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `id_contract`     INTEGER                           NOT NULL,
    `start_date`      date                              NOT NULL,
    `to_date`         date                              NOT NULL,
    `conclusion_date` date                              NOT NULL,
    `payment`         double                            NOT NULL,

    foreign key (id_contract) references contracts (id)
);

CREATE TABLE IF NOT EXISTS `objects`
(
    `id`                 INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `id_contract`        INTEGER                           NOT NULL,
    `id_business_type`   INTEGER                           NOT NULL,
    `id_area`            INTEGER                           NOT NULL,
    `rental_rate`        double                            NULL,
    `on_balance`         TEXT                              NULL,
    `address`            TEXT                              NULL,
    `name`               TEXT                              NULL,
    `expert_review_sum`  double                            NOT NULL,
    `expert_review_date` date                              NOT NULL,
    `payment`            double                            NULL,
    `disposition_date`   date                              NULL,
    `disposition_number` TEXT                              NULL,
    `disposition_maker`  TEXT                              NULL,
    `start_date`         date                              NULL,
    `end_date`           date                              NULL,

    foreign key (id_contract) references contracts (id),
    foreign key (id_business_type) references business_types (id),
    foreign key (id_area) references areas (id)
);

CREATE TABLE IF NOT EXISTS `objects_information`
(
    `id`        INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `id_object` INTEGER                           NOT NULL,
    `name`      TEXT                              NOT NULL,
    `value`     TEXT                              NOT NULL,

    foreign key (id_object) references objects (id)
);

CREATE TABLE IF NOT EXISTS `subtenants`
(
    `id`               INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `id_object`        INTEGER                           NOT NULL,
    `full_name`        TEXT                              NOT NULL,
    `square`           double                            NOT NULL,
    `start_date`       date                              NOT NULL,
    `end_date`         date                              NOT NULL,
    `id_business_type` INTEGER                           NOT NULL,

    foreign key (id_object) references objects (id),
    foreign key (id_business_type) references business_types (id)
);
