create table if not exists fusay.tuser
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

comment on column fusay.tuser.us_status is '0-activo
1-inactivo';

comment on column fusay.tuser.us_statusclave is 'Estado de la clave 0:temporal, 1:definitivo';

comment on column fusay.tuser.us_nomapel is 'Nombres y apellidos del usuario';

comment on column fusay.tuser.us_superuser is 'Indica si la cuenta de usuario es de tipo superusuario';

alter table fusay.tuser
    owner to postgres;

create table if not exists fusay.trol
(
    rl_id          serial            not null
        constraint trol_pkey
            primary key,
    rl_name        varchar(50)       not null,
    rl_desc        varchar(100),
    rl_abreviacion varchar(50)       not null,
    rl_grupo       integer default 0 not null
);

comment on table fusay.trol is 'Tabla para registro de roles en el sistema';

alter table fusay.trol
    owner to postgres;

create table if not exists fusay.tuserrol
(
    usrl_id serial  not null
        constraint tuserrol_pkey
            primary key,
    us_id   integer not null
        constraint tuserrol_tuser_us_id_fk
            references fusay.tuser,
    rl_id   integer not null
        constraint tuserrol_trol_rl_id_fk
            references fusay.trol
);

alter table fusay.tuserrol
    owner to postgres;

create table if not exists fusay.tcontribuyente
(
    cnt_id              serial            not null
        constraint tcontribuyente_pkey
            primary key,
    cnt_ruc             varchar(13)       not null,
    cnt_razonsocial     varchar(80)       not null,
    cnt_telf            varchar(40),
    cnt_email           varchar(40),
    cnt_dirmatriz       varchar(100)      not null,
    cnt_clase           integer           not null,
    cnt_nrocntespecial  varchar(40),
    cnt_oblcontab       integer default 0 not null,
    cnt_nombrecomercial varchar(80)       not null
);

comment on column fusay.tcontribuyente.cnt_clase is '0-persona natural, 1-especial, 2-rise, 3-regimen simplificado';

comment on column fusay.tcontribuyente.cnt_oblcontab is '0-NO, 1-Si';

alter table fusay.tcontribuyente
    owner to postgres;

create table if not exists fusay.tautorizacion
(
    aut_id                serial      not null
        constraint tautorizacion_pkey
            primary key,
    aut_numero            numeric(10) not null,
    aut_fechaautorizacion date        not null,
    aut_fechacaducidad    date        not null,
    aut_tipodoc           integer     not null,
    aut_estab             varchar(3)  not null,
    aut_ptoemi            varchar(3)  not null,
    aut_secuencia_ini     numeric(9)  not null,
    cnt_id                integer     not null
        constraint tautorizacion_tcontribuyente_cnt_id_fk
            references fusay.tcontribuyente,
    aut_secuencia_fin     numeric(9)  not null
);

alter table fusay.tautorizacion
    owner to postgres;

create table if not exists fusay.ttiposdoc
(
    td_id     integer not null
        constraint tiposdoc_pkey
            primary key,
    td_nombre varchar(40)
);

alter table fusay.ttiposdoc
    owner to postgres;

create table if not exists fusay.tclasecontrib
(
    cls_id     serial      not null
        constraint tclasecontrib_pkey
            primary key,
    cls_nombre varchar(80) not null
);

alter table fusay.tclasecontrib
    owner to postgres;

create table if not exists fusay.tjob
(
    job_id                 serial                                      not null
        constraint jobs_pkey
            primary key,
    aut_id                 integer                                     not null
        constraint jobs_tautorizacion_aut_id_fk
            references fusay.tautorizacion,
    job_fechacreacion      timestamp                                   not null,
    job_estado             integer                                     not null,
    job_fechaactualizacion timestamp,
    job_nrocopias          integer    default 1                        not null,
    cnt_id                 integer                                     not null
        constraint jobs_tcontribuyente_cnt_id_fk
            references fusay.tcontribuyente,
    user_crea              integer                                     not null,
    user_actualiza         integer,
    temp_id                integer,
    job_ptoemi             varchar(3) default '001'::character varying not null,
    job_secuencia_ini      numeric(9) default 0                        not null,
    job_secuencia_fin      numeric(9) default 0                        not null,
    job_tipodoc            integer    default 1                        not null
);

comment on column fusay.tjob.job_ptoemi is 'Numero del punto de emision';

comment on column fusay.tjob.job_secuencia_ini is 'Secuacia inicial del documento';

comment on column fusay.tjob.job_tipodoc is 'Tipo de documento a imprimir';

alter table fusay.tjob
    owner to postgres;

create table if not exists fusay.tstatusjob
(
    sjb_id     serial      not null
        constraint tstatusjob_pkey
            primary key,
    sjb_nombre varchar(50) not null
);

alter table fusay.tstatusjob
    owner to postgres;

create table if not exists fusay.report_request
(
    id                serial      not null
        constraint report_request_pkey
            primary key,
    key               varchar(36) not null,
    report_definition text        not null,
    data              text,
    is_test_data      boolean     not null,
    pdf_file          bytea,
    pdf_file_size     integer,
    created_on        timestamp
);

alter table fusay.report_request
    owner to postgres;

create table if not exists fusay.tplantilla
(
    temp_id     serial            not null
        constraint treporte_pk
            primary key,
    temp_name   varchar(80)       not null,
    temp_jrxml  text              not null,
    temp_tipo   integer default 1 not null,
    temp_desc   text,
    temp_params text
);

comment on table fusay.tplantilla is 'Registra plantillas de reportes de jasperreports';

comment on column fusay.tplantilla.temp_tipo is '1:plantilla para factura
2:reporte del sistema';

comment on column fusay.tplantilla.temp_params is 'Parametros para la generacion de reportes';

alter table fusay.tplantilla
    owner to postgres;

create table if not exists fusay.taudit
(
    aud_id        serial            not null
        constraint taudit_pk
            primary key,
    tbl_id        integer           not null,
    aud_accion    smallint,
    aud_userid    integer,
    aud_fechahora timestamp,
    aud_valorant  text,
    aud_valordesp text,
    aud_obs       varchar(800),
    aud_campo     varchar(100),
    aud_codreg    integer default 0 not null
);

comment on table fusay.taudit is 'Registra auditoria de las acciones realizadas en el sistema';

comment on column fusay.taudit.aud_accion is '0:insert
1:update
2:delete
';

comment on column fusay.taudit.aud_userid is 'usuario que realiza la accion';

comment on column fusay.taudit.aud_codreg is 'Codigo del registro de la tabla relacionada a la auditoria';

alter table fusay.taudit
    owner to postgres;

create unique index if not exists taudit_aud_id_uindex
    on fusay.taudit (aud_id);

create table if not exists fusay.ttabla
(
    tbl_id     serial      not null
        constraint ttablas_pk
            primary key,
    tbl_nombre varchar(80) not null
);

comment on table fusay.ttabla is 'Registra tablas usadas en el sistema por tema de auditorias';

alter table fusay.ttabla
    owner to postgres;

create unique index if not exists ttablas_tbl_id_uindex
    on fusay.ttabla (tbl_id);

create table if not exists fusay.tlogos
(
    lg_id serial not null
        constraint tlogos_pk
            primary key,
    logo  bytea
);

alter table fusay.tlogos
    owner to postgres;

create unique index if not exists tlogos_lg_id_uindex
    on fusay.tlogos (lg_id);

create table if not exists fusay.tjobreprint
(
    jobrp_id        serial    not null
        constraint tjobreprint_pk
            primary key,
    job_id          integer   not null,
    jobrp_secini    integer   not null,
    jobrp_secfin    integer   not null,
    jobrp_obs       text,
    user_crea       integer   not null,
    jobrp_fechacrea timestamp not null
);

comment on column fusay.tjobreprint.jobrp_id is 'Clave primaria';

comment on column fusay.tjobreprint.job_id is 'Trabajo de impresion que se realiza la reimpresion';

comment on column fusay.tjobreprint.jobrp_secini is 'Secuencia inicial que se realiza la reimpresion';

comment on column fusay.tjobreprint.jobrp_secfin is 'Secuencia final que se realiza la reimpresion';

comment on column fusay.tjobreprint.jobrp_obs is 'Motivo de la reimpresion';

comment on column fusay.tjobreprint.user_crea is 'Usuario que realiza la reimpresion';

comment on column fusay.tjobreprint.jobrp_fechacrea is 'Fecha en la que se realiza la reimpresion';

alter table fusay.tjobreprint
    owner to postgres;

create unique index if not exists tjobreprint_jobrp_id_uindex
    on fusay.tjobreprint (jobrp_id);

create table if not exists fusay.tjobdoc
(
    tjd_id        serial       not null
        constraint tjobdoc_pk
            primary key,
    tjob_id       integer      not null,
    tjd_ruta      varchar(100) not null,
    tjd_fechacrea timestamp    not null,
    tjd_usercrea  integer      not null
);

comment on table fusay.tjobdoc is 'Registra el trabajo de impresion generado ruta de los archivos PDF';

comment on column fusay.tjobdoc.tjd_id is 'Clave primaria de la tabla';

comment on column fusay.tjobdoc.tjob_id is 'Trabajo de impresion asociado';

comment on column fusay.tjobdoc.tjd_ruta is 'ruta del archivo registrado';

comment on column fusay.tjobdoc.tjd_fechacrea is 'Fecha y hora de creacion del registro';

comment on column fusay.tjobdoc.tjd_usercrea is 'Usuario que crea el registro';

alter table fusay.tjobdoc
    owner to postgres;

create unique index if not exists tjobdoc_tjd_id_uindex
    on fusay.tjobdoc (tjd_id);

create table if not exists fusay.tparams
(
    tprm_id        serial      not null
        constraint tparams_pk
            primary key,
    tprm_abrev     varchar(20) not null,
    tprm_nombre    varchar(80) not null,
    tprm_val       text        not null,
    tprm_fechacrea timestamp default now()
);

comment on table fusay.tparams is 'Registra parametros del sistema';

comment on column fusay.tparams.tprm_id is 'Clave primaria de la tabla';

comment on column fusay.tparams.tprm_abrev is 'Abreviacion del parametro';

comment on column fusay.tparams.tprm_nombre is 'Nombre del parametro';

alter table fusay.tparams
    owner to postgres;

create unique index if not exists tparams_tprm_id_uindex
    on fusay.tparams (tprm_id);

create unique index if not exists tparams_tprm_abrev_uindex
    on fusay.tparams (tprm_abrev);

create table if not exists fusay.tauditaccion
(
    taa_id     integer     not null
        constraint tauditaccion_pk
            primary key,
    taa_accion varchar(20) not null
);

comment on table fusay.tauditaccion is 'Acciones realizadas en auditorias';

comment on column fusay.tauditaccion.taa_id is 'Clave primaria de la tabla
';

alter table fusay.tauditaccion
    owner to postgres;

create unique index if not exists tauditaccion_taa_id_uindex
    on fusay.tauditaccion (taa_id);

create table if not exists fusay.ttablacol
(
    ttc_id    serial  not null
        constraint ttablacol_pk
            primary key,
    tbl_id    integer not null,
    ttc_name  text,
    ttc_label text
);

comment on table fusay.ttablacol is 'Tabla para registro de columnas por tabla';

comment on column fusay.ttablacol.ttc_id is 'clave primaria';

comment on column fusay.ttablacol.tbl_id is 'codigo de la tabla';

alter table fusay.ttablacol
    owner to postgres;

create unique index if not exists ttablacol_ttc_id_uindex
    on fusay.ttablacol (ttc_id);

create table if not exists fusay.tevents
(
    ev_id             serial                    not null
        constraint tevents_pk
            primary key,
    ev_fecha          date                      not null,
    ev_fechacrea      timestamp                 not null,
    ev_creadopor      integer,
    ev_lugar          integer,
    ev_horainicio     time,
    ev_horafin        time,
    ev_nota           text,
    ev_publicidad     text,
    ev_tipo           integer                   not null,
    ev_precionormal   numeric(8, 3) default 0.0 not null,
    ev_precioespecial numeric(8, 3) default 0.0 not null,
    ev_img            text,
    ev_estado         integer       default 0   not null,
    ev_url            varchar(40)
);

comment on table fusay.tevents is 'Registra los eventos de la fundacion';

comment on column fusay.tevents.ev_estado is '0-valido
1-anulado';

alter table fusay.tevents
    owner to postgres;

create unique index if not exists tevents_ev_id_uindex
    on fusay.tevents (ev_id);

create table if not exists fusay.ttipoev
(
    tiev_id     serial      not null
        constraint ttipoev_pk
            primary key,
    tiev_nombre varchar(80) not null,
    tiev_img    varchar(50)
);

comment on table fusay.ttipoev is 'Registra tipos de evento';

alter table fusay.ttipoev
    owner to postgres;

create unique index if not exists ttipoev_tiev_id_uindex
    on fusay.ttipoev (tiev_id);

create table if not exists fusay.tlugarev
(
    lugc_id     serial not null
        constraint tlugarev_pk
            primary key,
    lugc_nombre text   not null
);

alter table fusay.tlugarev
    owner to postgres;

create unique index if not exists tlugarev_lugc_id_uindex
    on fusay.tlugarev (lugc_id);

create table if not exists fusay.tmbmdir
(
    idm      serial      not null
        constraint tmbmdir_pk
            primary key,
    tipo     varchar(15) not null,
    nombre   varchar(80) not null,
    img      varchar(50) not null,
    longdet  text,
    shortdet text
);

alter table fusay.tmbmdir
    owner to postgres;

create unique index if not exists tmbmdir_idm_uindex
    on fusay.tmbmdir (idm);

create table if not exists fusay.tpersona
(
    per_id        serial            not null
        constraint tperrsona_pk
            primary key,
    per_ciruc     varchar(15),
    per_nombres   varchar(100)      not null,
    per_apellidos varchar(100),
    per_direccion varchar(100),
    per_telf      varchar(40),
    per_movil     varchar(20),
    per_email     varchar(40),
    per_fecreg    timestamp,
    per_tipo      integer default 1 not null,
    per_lugnac    integer,
    per_nota      text
);

alter table fusay.tpersona
    owner to postgres;

create unique index if not exists tpersona_per_id_uindex
    on fusay.tpersona (per_id);

create unique index if not exists tpersona_perciruc_uindex
    on fusay.tpersona (per_ciruc);

create unique index if not exists tpersona_peremail_uindex
    on fusay.tpersona (per_email);

create table if not exists fusay.tpersonaevents
(
    pev_id     serial  not null
        constraint tpersonaevents_pk
            primary key,
    per_id     integer not null,
    ev_id      integer not null,
    pev_fecreg timestamp
);

alter table fusay.tpersonaevents
    owner to postgres;

create unique index if not exists tpersonaevents_pev_id_uindex
    on fusay.tpersonaevents (pev_id);

create table if not exists fusay.tlugar
(
    lug_id     serial      not null
        constraint tlugar_pk
            primary key,
    lug_nombre varchar(80) not null,
    lug_parent integer
);

alter table fusay.tlugar
    owner to postgres;

create unique index if not exists tlugar_lug_id_uindex
    on fusay.tlugar (lug_id);

create table if not exists fusay.tfuser
(
    us_id        serial            not null
        constraint tfuser_pk
            primary key,
    us_cuenta    varchar(20)       not null,
    us_clave     varchar(20)       not null,
    per_id       integer           not null,
    us_fechacrea timestamp,
    us_estado    integer default 0 not null
);

alter table fusay.tfuser
    owner to postgres;

create unique index if not exists tfuser_us_id_uindex
    on fusay.tfuser (us_id);

create table if not exists fusay.ttickets
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
    tk_servicios   text,
    sec_id         integer       default 1   not null
);

comment on table fusay.ttickets is 'Tabla para registro de tickets';

alter table fusay.ttickets
    owner to postgres;

create unique index if not exists ttickets_tk_id_uindex
    on fusay.ttickets (tk_id);

create table if not exists fusay.tclaseitemconfig
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

create unique index if not exists tclaseitemconfig_cic_id_uindex
    on fusay.tclaseitemconfig (clsic_id);

create table if not exists fusay.tcatitemconfig
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

create unique index if not exists tcatitemconfig_catic_id_uindex
    on fusay.tcatitemconfig (catic_id);

create unique index if not exists tcatitemconfig_catic_id_uindex_2
    on fusay.tcatitemconfig (catic_id);

create table if not exists fusay.ttipoitemconfig
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

create table if not exists fusay.titemconfig
(
    ic_id             serial                                not null
        constraint titemconfig_pk
            primary key,
    ic_nombre         text                                  not null,
    ic_code           text                                  not null,
    ic_padre          integer,
    tipic_id          integer   default 1                   not null
        constraint titemconfig_ttipoitemconfig_tipic_id_fk
            references fusay.ttipoitemconfig,
    ic_fechacrea      timestamp default ('now'::text)::date not null,
    ic_usercrea       integer,
    ic_estado         integer   default 1                   not null,
    ic_nota           text,
    catic_id          integer   default 1                   not null
        constraint titemconfig_tcatitemconfig_catic_id_fk
            references fusay.tcatitemconfig,
    clsic_id          integer,
    ic_useractualiza  integer,
    ic_fechaactualiza timestamp
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

create unique index if not exists titemconfig_ic_code_uindex
    on fusay.titemconfig (ic_code);

create unique index if not exists titemconfig_ic_id_uindex
    on fusay.titemconfig (ic_id);

create table if not exists fusay.titemconfig_stock
(
    ice_id          serial                   not null
        constraint tpreciosart_pk
            primary key,
    ic_id           integer                  not null
        constraint tpreciosart_titemconfig_ic_id_fk
            references fusay.titemconfig,
    sec_id          integer        default 1 not null,
    ice_stock       numeric(10, 2) default 0 not null,
    user_crea       integer                  not null,
    fecha_crea      timestamp                not null,
    user_actualiza  integer,
    fecha_actualiza timestamp
);

alter table fusay.titemconfig_stock
    owner to postgres;

create unique index if not exists tpreciosart_part_id_uindex
    on fusay.titemconfig_stock (ice_id);

create table if not exists fusay.titemconfig_datosprod
(
    icdp_id             serial                               not null
        constraint tdatosproducto_pk
            primary key,
    ic_id               integer                              not null
        constraint tdatosproducto_titemconfig_ic_id_fk
            references fusay.titemconfig,
    icdp_fechacaducidad date,
    icdp_proveedor      integer        default '-2'::integer not null,
    icdp_modcontab      integer
        constraint tdatosproductomodcontablefk
            references fusay.titemconfig,
    icdp_preciocompra   numeric(10, 4) default 0.0           not null,
    icdp_precioventa    numeric(10, 4) default 0.0           not null,
    icdp_precioventamin numeric(10, 4) default 0.0           not null,
    icdp_grabaiva       boolean        default false         not null
);

comment on column fusay.titemconfig_datosprod.icdp_fechacaducidad is 'Fecha de caducidad del articulo';

alter table fusay.titemconfig_datosprod
    owner to postgres;

create unique index if not exists tdatosproducto_dprod_id_uindex
    on fusay.titemconfig_datosprod (icdp_id);

create unique index if not exists ttipoitemconfig_tipic_id_uindex
    on fusay.ttipoitemconfig (tipic_id);

create table if not exists fusay.tgrid
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

create unique index if not exists tgrid_grid_id_uindex
    on fusay.tgrid (grid_id);

create table if not exists fusay.tblog
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

create unique index if not exists tblog_blg_id_uindex
    on fusay.tblog (blg_id);

create table if not exists fusay.tseccion
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

create unique index if not exists tseccion_sec_id_uindex
    on fusay.tseccion (sec_id);

create table if not exists fusay.titemconfig_audit
(
    ica_id         serial         not null
        constraint titemconfig_audit_pk
            primary key,
    ic_id          integer        not null,
    user_crea      integer        not null,
    fecha_crea     timestamp      not null,
    ica_tipo       char           not null,
    ica_valantes   numeric(10, 4) not null,
    ica_valdespues numeric(10, 4) not null,
    sec_id         integer        not null
);

comment on table fusay.titemconfig_audit is 'Registra los cambios realizados en precios y stock de un producto';

comment on column fusay.titemconfig_audit.ica_tipo is 'P-precio
S-stock';

comment on column fusay.titemconfig_audit.ica_valantes is 'Valor que tuvo el articulo(stock o precio) antes de relizar el cambio';

comment on column fusay.titemconfig_audit.ica_valdespues is 'Valor que tiene el articulo(stock o precio) despues de realizar el cambio';

comment on column fusay.titemconfig_audit.sec_id is 'Seccion donde se encuentra el usuario';

alter table fusay.titemconfig_audit
    owner to postgres;

create unique index if not exists titemconfig_audit_ica_id_uindex
    on fusay.titemconfig_audit (ica_id);

create table if not exists fusay.tuserpaciente
(
    up_id        serial            not null
        constraint tuserpaciente_pk
            primary key,
    up_email     varchar(50)       not null,
    up_tipo      integer default 1 not null,
    up_pasword   text,
    up_estado    integer default 0 not null,
    up_fechacrea timestamp         not null,
    up_nombres   text              not null,
    up_celular   text,
    up_photourl  text
);

comment on column fusay.tuserpaciente.up_tipo is '1 - Facebook
2- Google
3- Email';

comment on column fusay.tuserpaciente.up_estado is '0 - activo
1 - inactivo';

alter table fusay.tuserpaciente
    owner to postgres;

create unique index if not exists tuserpaciente_up_id_uindex
    on fusay.tuserpaciente (up_id);

create table if not exists fusay.tcita
(
    cita_id       serial            not null
        constraint tcita_pk
            primary key,
    cita_fecha    date              not null,
    paciente_id   integer           not null,
    cita_obs      text,
    medico_id     integer,
    cita_serv     integer           not null,
    cita_hora     numeric(4, 2)     not null,
    cita_hora_fin numeric(4, 2)     not null,
    cita_estado   integer default 0 not null
);

comment on table fusay.tcita is 'Tabla que registra citas para telemedicina';

comment on column fusay.tcita.paciente_id is 'codigo del paciente';

comment on column fusay.tcita.cita_estado is '0-pendiente
1-atendido
2-anulado';

alter table fusay.tcita
    owner to postgres;

create unique index if not exists tcita_cita_id_uindex
    on fusay.tcita (cita_id);

create unique index if not exists tcita_cita_id_uindex_2
    on fusay.tcita (cita_id);

create table if not exists fusay.thorariomedico
(
    hm_id      serial        not null
        constraint thorariomedico_pk
            primary key,
    med_id     integer       not null,
    hm_dia     integer       not null,
    hm_horaini numeric(4, 2) not null,
    hm_horafin numeric(4, 2) not null
);

alter table fusay.thorariomedico
    owner to postgres;

create unique index if not exists thorariomedico_hm_id_uindex
    on fusay.thorariomedico (hm_id);

create table if not exists fusay.tserviciomedico
(
    tsm_id  serial  not null
        constraint tserviciomedico_pk
            primary key,
    med_id  integer not null,
    serv_id integer not null
);

alter table fusay.tserviciomedico
    owner to postgres;

create unique index if not exists tserviciomedico_tsm_id_uindex
    on fusay.tserviciomedico (tsm_id);

create or replace function fusay.inc(val integer) returns integer
    language plpgsql
as
$$
BEGIN
    return val + 1;
END;
$$;

alter function fusay.inc(integer) owner to postgres;

create or replace function fusay.poner_iva(val numeric) returns numeric
    language plpgsql
as
$$
BEGIN
    return 1.12 * val;
END;
$$;

alter function fusay.poner_iva(numeric) owner to postgres;

create or replace function fusay.quitar_iva(val numeric) returns numeric
    language plpgsql
as
$$
BEGIN
    return (val + 0.0) / 1.12;
END;
$$;

alter function fusay.quitar_iva(numeric) owner to postgres;

