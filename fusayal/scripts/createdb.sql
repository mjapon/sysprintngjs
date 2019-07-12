create database imprentadb
  with owner postgres;

create table tuser
(
  us_id          serial            not null
    constraint tuser_pkey
      primary key,
  us_name        varchar(50)       not null,
  us_pass        varchar(50)       not null,
  us_datecreated timestamp         not null,
  us_status      integer           not null,
  us_statusclave integer default 0 not null,
  us_nomapel     varchar(100)
);

comment on column tuser.us_status is '0-activo
1-inactivo';

comment on column tuser.us_statusclave is 'Estado de la clave: 0:temporal, 1:definitiva';

alter table tuser
  owner to postgres;

create unique index tuser_us_id_uindex
  on tuser (us_id);

create unique index tuser_us_name_uindex
  on tuser (us_name);

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

create unique index trol_rl_id_uindex
  on trol (rl_id);

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

create unique index tuserrol_usrl_id_uindex
  on tuserrol (usrl_id);

create table tempresa
(
  emp_id                serial       not null
    constraint tempresa_pkey
      primary key,
  emp_ruc               varchar(15)  not null,
  emp_razonsocial       varchar(100) not null,
  emp_nombrecomercial   varchar(100),
  emp_nroautorizacion   varchar(5)   not null,
  emp_fechaautorizacion date         not null
);

alter table tempresa
  owner to postgres;

create unique index tempresa_emp_id_uindex
  on tempresa (emp_id);

create unique index tempresa_emp_ruc_uindex
  on tempresa (emp_ruc);

create table tcontribuyente
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

comment on column tcontribuyente.cnt_clase is '0-persona natural, 1-especial, 2-rise, 3-regimen simplificado';

comment on column tcontribuyente.cnt_oblcontab is '0-NO, 1-Si';

alter table tcontribuyente
  owner to postgres;

create unique index tcontribuyente_cnt_id_uindex
  on tcontribuyente (cnt_id);

create unique index tcontribuyente_cnt_ruc_uindex
  on tcontribuyente (cnt_ruc);

create table tautorizacion
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
      references tcontribuyente,
  aut_secuencia_fin     numeric(9)  not null
);

alter table tautorizacion
  owner to postgres;

create unique index tautorizacion_aut_id_uindex
  on tautorizacion (aut_id);

create table ttiposdoc
(
  td_id     integer not null
    constraint tiposdoc_pkey
      primary key,
  td_nombre varchar(40)
);

alter table ttiposdoc
  owner to postgres;

create unique index tiposdoc_td_id_uindex
  on ttiposdoc (td_id);

create table tjob
(
  job_id                 serial                                      not null
    constraint jobs_pkey
      primary key,
  aut_id                 integer                                     not null
    constraint jobs_tautorizacion_aut_id_fk
      references tautorizacion,
  job_fechacreacion      timestamp                                   not null,
  job_estado             integer                                     not null,
  job_fechaactualizacion timestamp,
  job_nrocopias          integer    default 1                        not null,
  cnt_id                 integer                                     not null
    constraint jobs_tcontribuyente_cnt_id_fk
      references tcontribuyente,
  user_crea              integer                                     not null,
  user_actualiza         integer,
  temp_id                integer,
  job_ptoemi             varchar(3) default '001'::character varying not null,
  job_secuencia_ini      numeric(9) default 0                        not null,
  job_secuencia_fin      numeric(9) default 0                        not null,
  job_tipodoc            integer    default 1                        not null
);

comment on column tjob.job_ptoemi is 'Numero del punto de emision';

comment on column tjob.job_secuencia_ini is 'Secuacia inicial del documento';

comment on column tjob.job_tipodoc is 'Tipo de documento a imprimir';

alter table tjob
  owner to postgres;

create unique index jobs_job_id_uindex
  on tjob (job_id);

create table tstatusjob
(
  sjb_id     serial      not null
    constraint tstatusjob_pkey
      primary key,
  sjb_nombre varchar(50) not null
);

alter table tstatusjob
  owner to postgres;

create unique index tstatusjob_sjb_id_uindex
  on tstatusjob (sjb_id);

create table tclasecontrib
(
  cls_id     serial      not null
    constraint tclasecontrib_pkey
      primary key,
  cls_nombre varchar(50) not null
);

alter table tclasecontrib
  owner to postgres;

create unique index tclasecontrib_cls_id_uindex
  on tclasecontrib (cls_id);

create table tplantilla
(
  temp_id    serial      not null
    constraint treporte_pk
      primary key,
  temp_name  varchar(80) not null,
  temp_jrxml text        not null
);

comment on table tplantilla is 'Registra plantillas de reportes de jasperreports';

alter table tplantilla
  owner to postgres;

create table taudit
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

comment on table taudit is 'Registra auditoria de las acciones realizadas en el sistema';

comment on column taudit.aud_accion is '0:insert
1:update
2:delete
';

comment on column taudit.aud_userid is 'usuario que realiza la accion';

comment on column taudit.aud_codreg is 'Codigo del registro de la tabla relacionada a la auditoria';

alter table taudit
  owner to postgres;

create unique index taudit_aud_id_uindex
  on taudit (aud_id);

create table ttabla
(
  tbl_id     serial      not null
    constraint ttablas_pk
      primary key,
  tbl_nombre varchar(80) not null
);

comment on table ttabla is 'Registra tablas usadas en el sistema por tema de auditorias';

alter table ttabla
  owner to postgres;

create unique index ttablas_tbl_id_uindex
  on ttabla (tbl_id);

create table tlogos
(
  lg_id serial not null
    constraint tlogos_pk
      primary key,
  logo  bytea
);

alter table tlogos
  owner to postgres;

create unique index tlogos_lg_id_uindex
  on tlogos (lg_id);

create table tjobreprint
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

comment on column tjobreprint.jobrp_id is 'Clave primaria';

comment on column tjobreprint.job_id is 'Trabajo de impresion que se realiza la reimpresion';

comment on column tjobreprint.jobrp_secini is 'Secuencia inicial que se realiza la reimpresion';

comment on column tjobreprint.jobrp_secfin is 'Secuencia final que se realiza la reimpresion';

comment on column tjobreprint.jobrp_obs is 'Motivo de la reimpresion';

comment on column tjobreprint.user_crea is 'Usuario que realiza la reimpresion';

comment on column tjobreprint.jobrp_fechacrea is 'Fecha en la que se realiza la reimpresion';

alter table tjobreprint
  owner to postgres;

create unique index tjobreprint_jobrp_id_uindex
  on tjobreprint (jobrp_id);

create table tjobdoc
(
  tjd_id        serial    not null
    constraint tjobdoc_pk
      primary key,
  tjob_id       integer   not null,
  tjd_ruta      text      not null,
  tjd_fechacrea timestamp not null,
  tjd_usercrea  integer   not null
);

comment on table tjobdoc is 'Registra el trabajo de impresion generado ruta de los archivos PDF';

comment on column tjobdoc.tjd_id is 'Clave primaria de la tabla';

comment on column tjobdoc.tjob_id is 'Trabajo de impresion asociado';

comment on column tjobdoc.tjd_ruta is 'ruta del archivo registrado';

comment on column tjobdoc.tjd_fechacrea is 'Fecha y hora de creacion del registro';

comment on column tjobdoc.tjd_usercrea is 'Usuario que crea el registro';

alter table tjobdoc
  owner to postgres;

create unique index tjobdoc_tjd_id_uindex
  on tjobdoc (tjd_id);

create table tparams
(
  tprm_id        serial      not null
    constraint tparams_pk
      primary key,
  tprm_abrev     varchar(20) not null,
  tprm_nombre    varchar(80) not null,
  tprm_val       text        not null,
  tprm_fechacrea timestamp default CURRENT_TIMESTAMP
);

comment on table tparams is 'Registra parametros del sistema';

comment on column tparams.tprm_id is 'Clave primaria de la tabla';

comment on column tparams.tprm_abrev is 'Abreviacion del parametro';

comment on column tparams.tprm_nombre is 'Nombre del parametro';

alter table tparams
  owner to postgres;

create unique index tparams_tprm_id_uindex
  on tparams (tprm_id);

