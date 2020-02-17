--Cambios realizados sistema de facturacion y contable

-- auto-generated definition
create table ttipoitemconfig
(
    tipic_id     serial            not null
        constraint ttipoitemconfig_pk
            primary key,
    tipic_nombre varchar(80)       not null,
    tipic_estado integer default 1 not null
);

comment on column ttipoitemconfig.tipic_nombre is 'Nombre del tipo de item de configuracion';

comment on column ttipoitemconfig.tipic_estado is 'Estado del tipo de item de configuracion';

alter table ttipoitemconfig
    owner to postgres;

create unique index ttipoitemconfig_tipic_id_uindex
    on ttipoitemconfig (tipic_id);



-- auto-generated definition
create table tcatitemconfig
(
    catic_id     serial            not null
        constraint tcatitemconfig_pk
            primary key,
    catic_nombre varchar(60)       not null,
    catic_estado integer default 1 not null
);

comment on column tcatitemconfig.catic_nombre is 'Nombre de la categoria del item de configuracion';

comment on column tcatitemconfig.catic_estado is '1-activo
2-inactivo';

alter table tcatitemconfig
    owner to postgres;

create unique index tcatitemconfig_catic_id_uindex
    on tcatitemconfig (catic_id);

create unique index tcatitemconfig_catic_id_uindex_2
    on tcatitemconfig (catic_id);


-- auto-generated definition
create table tclaseitemconfig
(
    clsic_id          serial            not null
        constraint tclaseitemconfig_pk
            primary key,
    clsic_abreviacion varchar(2)        not null,
    clsic_nombre      varchar(40)       not null,
    clsic_estado      integer default 1 not null
);

comment on table tclaseitemconfig is 'Clase  de item de configuracion esto es activo, pasivo , ingreso, gasto';

alter table tclaseitemconfig
    owner to postgres;

create unique index tclaseitemconfig_cic_id_uindex
    on tclaseitemconfig (clsic_id);




create table titemconfig
(
    ic_id        serial                                not null
        constraint titemconfig_pk
            primary key,
    ic_nombre    text                                  not null,
    ic_code      text                                  not null,
    ic_padre     integer,
    tipic_id     integer   default 1                   not null
        constraint titemconfig_ttipoitemconfig_tipic_id_fk
            references ttipoitemconfig,
    ic_fechacrea timestamp default ('now'::text)::date not null,
    ic_usercrea  integer,
    ic_estado    integer   default 1                   not null,
    ic_nota      text,
    catic_id     integer   default 1                   not null
        constraint titemconfig_tcatitemconfig_catic_id_fk
            references tcatitemconfig,
    clsic_id     integer
);

comment on table titemconfig is 'Representa un articulo un servicio o una cuenta contable';

comment on column titemconfig.ic_nombre is 'Nombre del item de configuracion';

comment on column titemconfig.ic_code is 'Codigo de barra o codigo de la cuenta contable';

comment on column titemconfig.tipic_id is '1-articulo
2-servicio
3-cuenta contable';

comment on column titemconfig.ic_usercrea is 'Usuario que registra este item de configuracion';

comment on column titemconfig.ic_estado is 'Estado del item de configuracion
1-Activo
2-Inactivo';

comment on column titemconfig.ic_nota is 'Nota para al producto, servicio o cuenta contable';

comment on column titemconfig.catic_id is 'Codigo de la categoria del item de configuracion';

comment on column titemconfig.clsic_id is 'Clase del item de configuracion para el caso de cuentas contables';

alter table titemconfig
    owner to postgres;

create unique index titemconfig_ic_code_uindex
    on titemconfig (ic_code);

create unique index titemconfig_ic_id_uindex
    on titemconfig (ic_id);

-- auto-generated definition
create table tdatosproducto
(
    dprod_id             serial                       not null
        constraint tdatosproducto_pk
            primary key,
    ic_id                integer                      not null
        constraint tdatosproducto_titemconfig_ic_id_fk
            references titemconfig,
    dprod_grabaiva       boolean        default false not null,
    dprod_grabaimpserv   boolean        default false not null,
    dprod_preciocompra   numeric(15, 5) default 0.0   not null,
    dprod_precioventa    numeric(15, 5) default 0.0   not null,
    dprod_existencias    integer        default 0     not null,
    dprod_fechacaducidad date,
    dprod_proveedor      integer default -2 not null
);

comment on column tdatosproducto.dprod_grabaimpserv is 'Para el caso de servicios, si el producto graba o no el impuesto al servicio';

comment on column tdatosproducto.dprod_preciocompra is 'Precio de compra del producto o servicio sin iva';

comment on column tdatosproducto.dprod_precioventa is 'Precio de venta del producto o servicio sin iva';

comment on column tdatosproducto.dprod_existencias is 'Existencias del producto';

comment on column tdatosproducto.dprod_fechacaducidad is 'Fecha de caducidad del articulo';

alter table tdatosproducto
    owner to postgres;

create unique index tdatosproducto_dprod_id_uindex
    on tdatosproducto (dprod_id);


INSERT INTO fusay.ttipoitemconfig (tipic_id, tipic_nombre, tipic_estado) VALUES (1, 'PRODUCTO', 1);
INSERT INTO fusay.ttipoitemconfig (tipic_id, tipic_nombre, tipic_estado) VALUES (2, 'SERVICIO', 1);
INSERT INTO fusay.ttipoitemconfig (tipic_id, tipic_nombre, tipic_estado) VALUES (3, 'CUENTA CONTABLE', 1);


INSERT INTO fusay.tclaseitemconfig (clsic_id, clsic_abreviacion, clsic_nombre, clsic_estado) VALUES (1, 'A', 'ACTIVO', 1);
INSERT INTO fusay.tclaseitemconfig (clsic_id, clsic_abreviacion, clsic_nombre, clsic_estado) VALUES (2, 'P', 'PASIVO', 1);
INSERT INTO fusay.tclaseitemconfig (clsic_id, clsic_abreviacion, clsic_nombre, clsic_estado) VALUES (3, 'I', 'INGRESO', 1);
INSERT INTO fusay.tclaseitemconfig (clsic_id, clsic_abreviacion, clsic_nombre, clsic_estado) VALUES (4, 'G', 'GASTO', 1);


INSERT INTO fusay.tcatitemconfig (catic_id, catic_nombre, catic_estado) VALUES (1, 'NINGUNO', 1);

INSERT INTO fusay.tpersona (per_id, per_ciruc, per_nombres, per_apellidos, per_direccion, per_telf, per_movil, per_email, per_fecreg, per_tipo, per_lugnac, per_nota) VALUES (-1, '9999999999', 'CONSUMIDOR FINAL', null, null, null, '0000000000', null, null, 1, 0, null);
INSERT INTO fusay.tpersona (per_id, per_ciruc, per_nombres, per_apellidos, per_direccion, per_telf, per_movil, per_email, per_fecreg, per_tipo, per_lugnac, per_nota) VALUES (-2, '0000000000', 'PROVEEDOR POR DEFECTO', null, null, null, '0000000000', null, null, 2, 0, null);



create table tgrid
(
    grid_id        serial                  not null
        constraint tgrid_pk
            primary key,
    grid_nombre    varchar(40)             not null,
    grid_basesql   text                    not null,
    grid_columnas  text                    not null,
    grid_fechacrea timestamp default now() not null,
    grid_tupladesc text default '' not null
);

comment on table tgrid is 'Registra los grids del sistema';

alter table tgrid
    owner to postgres;

create unique index tgrid_grid_id_uindex
    on tgrid (grid_id);


create unique index tparams_tprm_abrev_uindex
	on fusay.tparams (tprm_abrev);



INSERT INTO fusay.tparams (tprm_id, tprm_abrev, tprm_nombre, tprm_val, tprm_fechacrea) VALUES (2, 'porciva', 'porciva', '0.12', '2020-02-15 12:57:28.000000');


--Funciones de base de datos creadas;
CREATE OR REPLACE FUNCTION PONER_IVA(val numeric) returns numeric as $$
BEGIN
    return 1.12*val;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION QUITAR_IVA(val numeric) returns numeric as $$
BEGIN
    return (val+0.0)/1.12;
END;
$$ LANGUAGE plpgsql;


alter table tempresa
	add emp_esquema varchar(30);

alter table tempresa
	add emp_codigo varchar(30);

alter table tempresa
	add emp_menu text;
