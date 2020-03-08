-- auto-generated definition
create table fusay.tblog
(
    blg_id        serial    not null
        constraint tblog_pk
            primary key,
    blg_fecha     date      not null,
    blg_autor     text      not null,
    blg_titulo    text      not null,
    blg_img       text,
    blg_fechacrea timestamp not null,
    blg_contenido text      not null
);

alter table fusay.tblog
    owner to postgres;

create unique index tblog_blg_id_uindex
    on fusay.tblog (blg_id);



-- auto-generated definition
create table fusay.ttickets
(
    tk_id          serial                    not null
        constraint ttickets_pk
            primary key,
    tk_nro         integer                   not null,
    tk_fechahora   timestamp                 not null,
    tk_perid       integer                   not null,
    tk_observacion text,
    tk_usercrea    integer                   not null,
    tk_costo       numeric(4, 2) default 0.0 not null,
    tk_dia         date                      not null,
    tk_estado      integer       default 1   not null,
    tk_servicios   text
);

comment on table fusay.ttickets is 'Tabla para registro de tickets';

alter table fusay.ttickets
    owner to postgres;

create unique index ttickets_tk_id_uindex
    on fusay.ttickets (tk_id);



-- auto-generated definition
create table fusay.tseccion
(
    sec_id     serial            not null
        constraint tseccion_pk
            primary key,
    sec_nombre varchar(100)      not null,
    sec_estado integer default 1 not null
);

comment on table fusay.tseccion is 'Registra las secciones de una empresa';

comment on column fusay.tseccion.sec_estado is '1-activo
2-inactivo';

alter table fusay.tseccion
    owner to postgres;

create unique index tseccion_sec_id_uindex
    on fusay.tseccion (sec_id);



-- auto-generated definition
create table fusay.ttipoitemconfig
(
    tipic_id     serial            not null
        constraint ttipoitemconfig_pk
            primary key,
    tipic_nombre varchar(80)       not null,
    tipic_estado integer default 1 not null
);

comment on column fusay.ttipoitemconfig.tipic_nombre is 'Nombre del tipo de item de configuracion';

comment on column fusay.ttipoitemconfig.tipic_estado is 'Estado del tipo de item de configuracion';

alter table fusay.ttipoitemconfig
    owner to postgres;

create unique index ttipoitemconfig_tipic_id_uindex
    on fusay.ttipoitemconfig (tipic_id);


-- auto-generated definition
create table fusay.tcatitemconfig
(
    catic_id     serial            not null
        constraint tcatitemconfig_pk
            primary key,
    catic_nombre varchar(60)       not null,
    catic_estado integer default 1 not null
);

comment on column fusay.tcatitemconfig.catic_nombre is 'Nombre de la categoria del item de configuracion';

comment on column fusay.tcatitemconfig.catic_estado is '1-activo
2-inactivo';

alter table fusay.tcatitemconfig
    owner to postgres;

create unique index tcatitemconfig_catic_id_uindex
    on fusay.tcatitemconfig (catic_id);

create unique index tcatitemconfig_catic_id_uindex_2
    on fusay.tcatitemconfig (catic_id);




-- auto-generated definition
create table fusay.tclasecontrib
(
    cls_id     serial      not null
        constraint tclasecontrib_pkey
            primary key,
    cls_nombre varchar(80) not null
);

alter table fusay.tclasecontrib
    owner to postgres;




-- auto-generated definition
create table fusay.tclaseitemconfig
(
    clsic_id          serial            not null
        constraint tclaseitemconfig_pk
            primary key,
    clsic_abreviacion varchar(2)        not null,
    clsic_nombre      varchar(40)       not null,
    clsic_estado      integer default 1 not null
);

comment on table fusay.tclaseitemconfig is 'Clase  de item de configuracion esto es activo, pasivo , ingreso, gasto';

alter table fusay.tclaseitemconfig
    owner to postgres;

create unique index tclaseitemconfig_cic_id_uindex
    on fusay.tclaseitemconfig (clsic_id);







-- auto-generated definition
create table fusay.titemconfig
(
    ic_id           serial                                not null
        constraint titemconfig_pk
            primary key,
    ic_nombre       text                                  not null,
    ic_code         text                                  not null,
    ic_padre        integer,
    tipic_id        integer   default 1                   not null
        constraint titemconfig_ttipoitemconfig_tipic_id_fk
            references fusay.ttipoitemconfig,
    ic_fechacrea    timestamp default ('now'::text)::date not null,
    ic_usercrea     integer,
    ic_estado       integer   default 1                   not null,
    ic_nota         text,
    catic_id        integer   default 1                   not null
        constraint titemconfig_tcatitemconfig_catic_id_fk
            references fusay.tcatitemconfig,
    clsic_id        integer,
    ic_grabaiva     boolean   default false               not null,
    ic_grabaimpserv boolean   default false               not null
);

comment on table fusay.titemconfig is 'Representa un articulo un servicio o una cuenta contable';

comment on column fusay.titemconfig.ic_nombre is 'Nombre del item de configuracion';

comment on column fusay.titemconfig.ic_code is 'Codigo de barra o codigo de la cuenta contable';

comment on column fusay.titemconfig.tipic_id is '1-articulo
2-servicio
3-cuenta contable';

comment on column fusay.titemconfig.ic_usercrea is 'Usuario que registra este item de configuracion';

comment on column fusay.titemconfig.ic_estado is 'Estado del item de configuracion
1-Activo
2-Inactivo';

comment on column fusay.titemconfig.ic_nota is 'Nota para al producto, servicio o cuenta contable';

comment on column fusay.titemconfig.catic_id is 'Codigo de la categoria del item de configuracion';

comment on column fusay.titemconfig.clsic_id is 'Clase del item de configuracion para el caso de cuentas contables';

alter table fusay.titemconfig
    owner to postgres;

create unique index titemconfig_ic_code_uindex
    on fusay.titemconfig (ic_code);

create unique index titemconfig_ic_id_uindex
    on fusay.titemconfig (ic_id);



-- auto-generated definition
create table fusay.titemconfig_meta
(
    icm_id             serial                        not null
        constraint tdatosproducto_pk
            primary key,
    ic_id              integer                       not null
        constraint tdatosproducto_titemconfig_ic_id_fk
            references fusay.titemconfig,
    icm_existencias    integer default 0             not null,
    icm_fechacaducidad date,
    icm_proveedor      integer default '-2'::integer not null,
    icm_modcontab      integer
        constraint tdatosproductomodcontablefk
            references fusay.titemconfig,
    sec_id             integer default 1             not null
);

comment on column fusay.titemconfig_meta.icm_existencias is 'Existencias del producto';

comment on column fusay.titemconfig_meta.icm_fechacaducidad is 'Fecha de caducidad del articulo';

alter table fusay.titemconfig_meta
    owner to postgres;

create unique index tdatosproducto_dprod_id_uindex
    on fusay.titemconfig_meta (icm_id);


-- auto-generated definition
create table fusay.titemconfig_precios
(
    icpre_id             serial                     not null
        constraint tpreciosart_pk
            primary key,
    icpre_preciocompra   numeric(10, 4) default 0.0 not null,
    icpre_precioventa    numeric(10, 4) default 0.0 not null,
    icpre_precioventamin numeric(10, 4) default 0.0 not null,
    ic_id                integer                    not null
        constraint tpreciosart_titemconfig_ic_id_fk
            references fusay.titemconfig,
    sec_id               integer        default 1   not null
);

alter table fusay.titemconfig_precios
    owner to postgres;

create unique index tpreciosart_part_id_uindex
    on fusay.titemconfig_precios (icpre_id);


-- auto-generated definition
create table fusay.tgrid
(
    grid_id        serial                     not null
        constraint tgrid_pk
            primary key,
    grid_nombre    varchar(40)                not null,
    grid_basesql   text                       not null,
    grid_columnas  text                       not null,
    grid_fechacrea timestamp default now()    not null,
    grid_tupladesc text      default ''::text not null
);

comment on table fusay.tgrid is 'Registra los grids del sistema';

alter table fusay.tgrid
    owner to postgres;

create unique index tgrid_grid_id_uindex
    on fusay.tgrid (grid_id);







