create database smartfactdb;
	-- auto-generated definition
create table tempresa
(
    temp_id              serial      not null
        constraint timprentas_pk
            primary key,
    temp_code            varchar(20) not null,
    temp_ruc			 varchar(13) not null,
    temp_esquema         varchar(10) not null,
    temp_razonsocial     varchar(80)       not null,
    temp_nombrecomercial varchar(80),
    temp_telf            varchar(40),
    temp_email           varchar(40),
    temp_dirmatriz       varchar(100)      not null,
    temp_oblcontab       integer default 0 not null,

);

comment on table tempresa is 'Tabla para registro de empresas que usa el sistema';

comment on column tempresa.temp_id is 'Clave primaria de la tabla';

comment on column tempresa.temp_code is 'codigo de la empresa para ingresar al sistema';

comment on column tempresa.temp_esquema is 'Esquema que usa esta empresa';

comment on column tempresa.temp_nombrecomercial is 'Nombre comercial de la empresa';

alter table tempresa owner to postgres;

create unique index tempresa_temp_id_uindex
    on tempresa (temp_id);


create schema demo;

-- auto-generated definition
create table tuser
(
    us_id          serial                                                not null
        constraint tuser_pkey
            primary key,
    us_name        varchar(50)                                           not null,
    us_pass        varchar(50)                                           not null,
    us_datecreated timestamp                                             not null,
    us_status      integer                                               not null,
    us_statusclave integer      default 0                                not null,
    us_nomapel     varchar(100) default 'setusername'::character varying not null,
    us_superuser   integer      default 0
);

comment on column tuser.us_status is '0-activo
1-inactivo';

comment on column tuser.us_statusclave is 'Estado de la clave 0:temporal, 1:definitivo';

comment on column tuser.us_nomapel is 'Nombres y apellidos del usuario';

comment on column tuser.us_superuser is 'Indica si la cuenta de usuario es de tipo superusuario';

alter table tuser
    owner to postgres;



-- auto-generated definition
create table trol
(
    rl_id          serial            not null
        constraint trol_pkey
            primary key,
    rl_name        varchar(50)       not null,
    rl_desc        varchar(100),
    rl_abreviacion varchar(50)       not null,
    rl_grupo       integer default 0 not null
);

comment on table trol is 'Tabla para registro de roles en el sistema';

alter table trol
    owner to postgres;





-- auto-generated definition
create table tuserrol
(
    usrl_id serial  not null
        constraint tuserrol_pkey
            primary key,
    us_id   integer not null
        constraint tuserrol_tuser_us_id_fk
            references tuser,
    rl_id   integer not null
        constraint tuserrol_trol_rl_id_fk
            references trol
);

alter table tuserrol
    owner to postgres;





