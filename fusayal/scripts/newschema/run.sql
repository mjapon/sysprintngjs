create schema emp01;

comment on schema emp01 is 'emp01 schema';

alter schema emp01 owner to postgres;

SET search_path TO emp01;

create table if not exists tuser
(
	us_id serial not null
		constraint tuser_pkey
			primary key,
	us_name varchar(50) not null,
	us_pass varchar(50) not null,
	us_datecreated timestamp not null,
	us_status integer not null,
	us_statusclave integer default 0 not null,
	us_nomapel varchar(100) default 'setusername'::character varying not null,
	us_superuser integer default 0
);

comment on column tuser.us_status is '0-activo
1-inactivo';

comment on column tuser.us_statusclave is 'Estado de la clave 0:temporal, 1:definitivo';

comment on column tuser.us_nomapel is 'Nombres y apellidos del usuario';

comment on column tuser.us_superuser is 'Indica si la cuenta de usuario es de tipo superusuario';

alter table tuser owner to postgres;

create table if not exists trol
(
	rl_id serial not null
		constraint trol_pkey
			primary key,
	rl_name varchar(50) not null,
	rl_desc varchar(100),
	rl_abreviacion varchar(50) not null,
	rl_grupo integer default 0 not null
);

comment on table trol is 'Tabla para registro de roles en el sistema';

alter table trol owner to postgres;

create table if not exists tuserrol
(
	usrl_id serial not null
		constraint tuserrol_pkey
			primary key,
	us_id integer not null
		constraint tuserrol_tuser_us_id_fk
			references tuser,
	rl_id integer not null
		constraint tuserrol_trol_rl_id_fk
			references trol
);

alter table tuserrol owner to postgres;

create table if not exists tempresa
(
	emp_id serial not null
		constraint tempresa_pkey
			primary key,
	emp_ruc varchar(15) not null,
	emp_razonsocial varchar(100) not null,
	emp_nombrecomercial varchar(100),
	emp_nroautorizacion varchar(5) not null,
	emp_fechaautorizacion date not null
);

alter table tempresa owner to postgres;

create table if not exists tcontribuyente
(
	cnt_id serial not null
		constraint tcontribuyente_pkey
			primary key,
	cnt_ruc varchar(13) not null,
	cnt_razonsocial varchar(80) not null,
	cnt_telf varchar(40),
	cnt_email varchar(40),
	cnt_dirmatriz varchar(100) not null,
	cnt_clase integer not null,
	cnt_nrocntespecial varchar(40),
	cnt_oblcontab integer default 0 not null,
	cnt_nombrecomercial varchar(80) not null
);

comment on column tcontribuyente.cnt_clase is '0-persona natural, 1-especial, 2-rise, 3-regimen simplificado';

comment on column tcontribuyente.cnt_oblcontab is '0-NO, 1-Si';

alter table tcontribuyente owner to postgres;

create table if not exists tautorizacion
(
	aut_id serial not null
		constraint tautorizacion_pkey
			primary key,
	aut_numero numeric(10) not null,
	aut_fechaautorizacion date not null,
	aut_fechacaducidad date not null,
	aut_tipodoc integer not null,
	aut_estab varchar(3) not null,
	aut_ptoemi varchar(3) not null,
	aut_secuencia_ini numeric(9) not null,
	cnt_id integer not null
		constraint tautorizacion_tcontribuyente_cnt_id_fk
			references tcontribuyente,
	aut_secuencia_fin numeric(9) not null
);

alter table tautorizacion owner to postgres;

create table if not exists ttiposdoc
(
	td_id integer not null
		constraint tiposdoc_pkey
			primary key,
	td_nombre varchar(40)
);

alter table ttiposdoc owner to postgres;

create table if not exists tclasecontrib
(
	cls_id serial not null
		constraint tclasecontrib_pkey
			primary key,
	cls_nombre varchar(80) not null
);

alter table tclasecontrib owner to postgres;

create table if not exists tjob
(
	job_id serial not null
		constraint jobs_pkey
			primary key,
	aut_id integer not null
		constraint jobs_tautorizacion_aut_id_fk
			references tautorizacion,
	job_fechacreacion timestamp not null,
	job_estado integer not null,
	job_fechaactualizacion timestamp,
	job_nrocopias integer default 1 not null,
	cnt_id integer not null
		constraint jobs_tcontribuyente_cnt_id_fk
			references tcontribuyente,
	user_crea integer not null,
	user_actualiza integer,
	temp_id integer,
	job_ptoemi varchar(3) default '001'::character varying not null,
	job_secuencia_ini numeric(9) default 0 not null,
	job_secuencia_fin numeric(9) default 0 not null,
	job_tipodoc integer default 1 not null
);

comment on column tjob.job_ptoemi is 'Numero del punto de emision';

comment on column tjob.job_secuencia_ini is 'Secuacia inicial del documento';

comment on column tjob.job_tipodoc is 'Tipo de documento a imprimir';

alter table tjob owner to postgres;

create table if not exists tstatusjob
(
	sjb_id serial not null
		constraint tstatusjob_pkey
			primary key,
	sjb_nombre varchar(50) not null
);

alter table tstatusjob owner to postgres;

create table if not exists report_request
(
	id serial not null
		constraint report_request_pkey
			primary key,
	key varchar(36) not null,
	report_definition text not null,
	data text,
	is_test_data boolean not null,
	pdf_file bytea,
	pdf_file_size integer,
	created_on timestamp
);

alter table report_request owner to postgres;

create table if not exists tplantilla
(
	temp_id serial not null
		constraint treporte_pk
			primary key,
	temp_name varchar(80) not null,
	temp_jrxml text not null,
	temp_tipo integer default 1 not null,
	temp_desc text,
	temp_params text
);

comment on table tplantilla is 'Registra plantillas de reportes de jasperreports';

comment on column tplantilla.temp_tipo is '1:plantilla para factura
2:reporte del sistema';

comment on column tplantilla.temp_params is 'Parametros para la generacion de reportes';

alter table tplantilla owner to postgres;

create table if not exists taudit
(
	aud_id serial not null
		constraint taudit_pk
			primary key,
	tbl_id integer not null,
	aud_accion smallint,
	aud_userid integer,
	aud_fechahora timestamp,
	aud_valorant text,
	aud_valordesp text,
	aud_obs varchar(800),
	aud_campo varchar(100),
	aud_codreg integer default 0 not null
);

comment on table taudit is 'Registra auditoria de las acciones realizadas en el sistema';

comment on column taudit.aud_accion is '0:insert
1:update
2:delete
';

comment on column taudit.aud_userid is 'usuario que realiza la accion';

comment on column taudit.aud_codreg is 'Codigo del registro de la tabla relacionada a la auditoria';

alter table taudit owner to postgres;

create unique index if not exists taudit_aud_id_uindex
	on taudit (aud_id);

create table if not exists ttabla
(
	tbl_id serial not null
		constraint ttablas_pk
			primary key,
	tbl_nombre varchar(80) not null
);

comment on table ttabla is 'Registra tablas usadas en el sistema por tema de auditorias';

alter table ttabla owner to postgres;

create unique index if not exists ttablas_tbl_id_uindex
	on ttabla (tbl_id);

create table if not exists tlogos
(
	lg_id serial not null
		constraint tlogos_pk
			primary key,
	logo bytea
);

alter table tlogos owner to postgres;

create unique index if not exists tlogos_lg_id_uindex
	on tlogos (lg_id);

create table if not exists tjobreprint
(
	jobrp_id serial not null
		constraint tjobreprint_pk
			primary key,
	job_id integer not null,
	jobrp_secini integer not null,
	jobrp_secfin integer not null,
	jobrp_obs text,
	user_crea integer not null,
	jobrp_fechacrea timestamp not null
);

comment on column tjobreprint.jobrp_id is 'Clave primaria';

comment on column tjobreprint.job_id is 'Trabajo de impresion que se realiza la reimpresion';

comment on column tjobreprint.jobrp_secini is 'Secuencia inicial que se realiza la reimpresion';

comment on column tjobreprint.jobrp_secfin is 'Secuencia final que se realiza la reimpresion';

comment on column tjobreprint.jobrp_obs is 'Motivo de la reimpresion';

comment on column tjobreprint.user_crea is 'Usuario que realiza la reimpresion';

comment on column tjobreprint.jobrp_fechacrea is 'Fecha en la que se realiza la reimpresion';

alter table tjobreprint owner to postgres;

create unique index if not exists tjobreprint_jobrp_id_uindex
	on tjobreprint (jobrp_id);

create table if not exists tjobdoc
(
	tjd_id serial not null
		constraint tjobdoc_pk
			primary key,
	tjob_id integer not null,
	tjd_ruta varchar(100) not null,
	tjd_fechacrea timestamp not null,
	tjd_usercrea integer not null
);

comment on table tjobdoc is 'Registra el trabajo de impresion generado ruta de los archivos PDF';

comment on column tjobdoc.tjd_id is 'Clave primaria de la tabla';

comment on column tjobdoc.tjob_id is 'Trabajo de impresion asociado';

comment on column tjobdoc.tjd_ruta is 'ruta del archivo registrado';

comment on column tjobdoc.tjd_fechacrea is 'Fecha y hora de creacion del registro';

comment on column tjobdoc.tjd_usercrea is 'Usuario que crea el registro';

alter table tjobdoc owner to postgres;

create unique index if not exists tjobdoc_tjd_id_uindex
	on tjobdoc (tjd_id);

create table if not exists tparams
(
	tprm_id serial not null
		constraint tparams_pk
			primary key,
	tprm_abrev varchar(20) not null,
	tprm_nombre varchar(80) not null,
	tprm_val text not null,
	tprm_fechacrea timestamp default now()
);

comment on table tparams is 'Registra parametros del sistema';

comment on column tparams.tprm_id is 'Clave primaria de la tabla';

comment on column tparams.tprm_abrev is 'Abreviacion del parametro';

comment on column tparams.tprm_nombre is 'Nombre del parametro';

alter table tparams owner to postgres;

create unique index if not exists tparams_tprm_id_uindex
	on tparams (tprm_id);

create table if not exists tauditaccion
(
	taa_id integer not null
		constraint tauditaccion_pk
			primary key,
	taa_accion varchar(20) not null
);

comment on table tauditaccion is 'Acciones realizadas en auditorias';

comment on column tauditaccion.taa_id is 'Clave primaria de la tabla
';

alter table tauditaccion owner to postgres;

create unique index if not exists tauditaccion_taa_id_uindex
	on tauditaccion (taa_id);

create table if not exists ttablacol
(
	ttc_id serial not null
		constraint ttablacol_pk
			primary key,
	tbl_id integer not null,
	ttc_name text,
	ttc_label text
);

comment on table ttablacol is 'Tabla para registro de columnas por tabla';

comment on column ttablacol.ttc_id is 'clave primaria';

comment on column ttablacol.tbl_id is 'codigo de la tabla';

alter table ttablacol owner to postgres;

create unique index if not exists ttablacol_ttc_id_uindex
	on ttablacol (ttc_id);


INSERT INTO emp01.tauditaccion (taa_id, taa_accion) VALUES (1, 'Creación');
INSERT INTO emp01.tauditaccion (taa_id, taa_accion) VALUES (2, 'Actualización');
INSERT INTO emp01.tauditaccion (taa_id, taa_accion) VALUES (3, 'Eliminación');
INSERT INTO emp01.tauditaccion (taa_id, taa_accion) VALUES (4, 'Acceso');

INSERT INTO emp01.tclasecontrib (cls_id, cls_nombre) VALUES (1, 'PERSONA NATURAL');
INSERT INTO emp01.tclasecontrib (cls_id, cls_nombre) VALUES (2, 'EXTRANJERO');
INSERT INTO emp01.tclasecontrib (cls_id, cls_nombre) VALUES (3, 'CONTRIBUYENTE ESPECIAL');
INSERT INTO emp01.tclasecontrib (cls_id, cls_nombre) VALUES (4, 'CONTRIBUYENTE RISE');
INSERT INTO emp01.tclasecontrib (cls_id, cls_nombre) VALUES (5, 'CONTRIBUYENTE REGIMEN SIMPLIFICADO');

INSERT INTO emp01.tparams (tprm_id, tprm_abrev, tprm_nombre, tprm_val, tprm_fechacrea) VALUES (1, 'pathSaveJobs', 'pathSaveJobs', '/opt/josgenerados/emp01', '2019-07-12 00:21:04.423000');

INSERT INTO emp01.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (1, 'FACTURA A4', '/opt/sysprintngjs/fusayal/scripts/reportes/facturaA4.jrxml', 1, null, null);
INSERT INTO emp01.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (2, 'Reporte autorizaciones', '/opt/sysprintngjs/fusayal/scripts/reportes/logAutorizaciones.jrxml', 3, null, '{}');
INSERT INTO emp01.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (3, 'Log auditoría usuarios', '/opt/sysprintngjs/fusayal/scripts/reportes/logAuditoriaUsuarios.jrxml', 2, null, '{"fec":2}');
INSERT INTO emp01.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (4, 'Log auditoría imprenta', '/opt/sysprintngjs/fusayal/scripts/reportes/logAuditoriaImprenta.jrxml', 2, null, '{}');
INSERT INTO emp01.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (5, 'Log auditoría empresa', '/opt/sysprintngjs/fusayal/scripts/reportes/logAuditoriaContrib.jrxml', 2, null, '{"cnt":1}');
INSERT INTO emp01.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (6, 'Log autorizaciones generadas', '/opt/sysprintngjs/fusayal/scripts/reportes/logAutorizacionesGen.jrxml', 2, null, '{"fec":2, "cnt":1}');
INSERT INTO emp01.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (7, 'Log transaccional', '/opt/sysprintngjs/fusayal/scripts/reportes/logTransaccional.jrxml', 2, null, '{"fec":2, "cnt":1, "statusjob":1}');
INSERT INTO emp01.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (8, 'Log registro y control de acceso', '/opt/sysprintngjs/fusayal/scripts/reportes/logAccesoAudit.jrxml', 2, null, '{"fec":2}');

INSERT INTO emp01.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (10, 'CREAR USUARIO', 'PERMITE DAR DE ALTA UN USUARIO EN EL SISTEMA', 'CREATEUSER', 0);
INSERT INTO emp01.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (12, 'EDITAR USUARIO', 'PERMITE CAMBIAR EL NOMBRE DE LA CUENTA Y LOS NOMBRES Y APELLIDOS', 'EDITUSER', 0);
INSERT INTO emp01.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (13, 'RESETEAR CLAVE', 'PERMITE RESETEAR LA CLAVE DE UN USUARIO', 'RESETCLAVE', 0);
INSERT INTO emp01.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (1, 'ACCESO REPORTES', null, 'ACCESREPORTES', 0);
INSERT INTO emp01.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (15, 'EDICIÓN DE CONTRIBUYENTES', null, 'EDITCONTRIB', 0);
INSERT INTO emp01.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (14, 'CREACIÓN DE CONTRIBUYENTES', null, 'CREACONTRIB', 0);
INSERT INTO emp01.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (16, 'CREACIÓN AUTORIZACIONES', null, 'CREAAUT', 0);
INSERT INTO emp01.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (18, 'CREACIÓN DE DOCUMENTOS', null, 'CREADOC', 0);
INSERT INTO emp01.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (17, 'EDICIÓN DE AUTORIZACIONES', null, 'EDITAUT', 0);
INSERT INTO emp01.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (19, 'ACTUALIZACIÓN DE DOCUMENTOS', null, 'UPDATEDOC', 0);
INSERT INTO emp01.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (2, 'EDICION DATOS ESTABLECIMIENTO GRÁFICO', null, 'EMPRESAEDIT', 0);
INSERT INTO emp01.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (3, 'LISTADO DE CONTRIBUYENTES', null, 'LISTACONTRIB', 0);
INSERT INTO emp01.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (4, 'LISTADO DE AUTORIZACIONES', null, 'LISTAAUT', 0);
INSERT INTO emp01.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (5, 'LISTADO DE USUARIOS', null, 'LISTAUSER', 0);
INSERT INTO emp01.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (6, 'LISTADO DE DOCUMENTOS', null, 'LISTADOC', 0);
INSERT INTO emp01.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (7, 'ACCESO PLANTILLAS', null, 'ACCESPLANTILLAS', 0);


INSERT INTO emp01.tstatusjob (sjb_id, sjb_nombre) VALUES (1, 'Nuevo');
INSERT INTO emp01.tstatusjob (sjb_id, sjb_nombre) VALUES (3, 'Incompleto');
INSERT INTO emp01.tstatusjob (sjb_id, sjb_nombre) VALUES (5, 'Reimpresion');
INSERT INTO emp01.tstatusjob (sjb_id, sjb_nombre) VALUES (2, 'Reportado');
INSERT INTO emp01.tstatusjob (sjb_id, sjb_nombre) VALUES (6, 'Impreso');
INSERT INTO emp01.tstatusjob (sjb_id, sjb_nombre) VALUES (4, 'Anulado');
INSERT INTO emp01.tstatusjob (sjb_id, sjb_nombre) VALUES (7, 'Elije Plantilla');


INSERT INTO emp01.ttabla (tbl_id, tbl_nombre) VALUES (1, 'CONTRIBUYENTES');
INSERT INTO emp01.ttabla (tbl_id, tbl_nombre) VALUES (2, 'EMPRESA');
INSERT INTO emp01.ttabla (tbl_id, tbl_nombre) VALUES (3, 'AUTORIZACIONES');
INSERT INTO emp01.ttabla (tbl_id, tbl_nombre) VALUES (4, 'TRABAJOS DE IMPRESION');
INSERT INTO emp01.ttabla (tbl_id, tbl_nombre) VALUES (5, 'USUARIOS');
INSERT INTO emp01.ttabla (tbl_id, tbl_nombre) VALUES (6, 'ROLESUSUARIOS');
INSERT INTO emp01.ttabla (tbl_id, tbl_nombre) VALUES (7, 'DOCUMENTO');
INSERT INTO emp01.ttabla (tbl_id, tbl_nombre) VALUES (8, 'PLANTILLAS');


INSERT INTO emp01.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (1, 5, 'us_name', 'Nombre cuenta de usuario');
INSERT INTO emp01.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (2, 5, 'us_pass', 'Clave de Usuario');
INSERT INTO emp01.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (3, 5, 'us_datecreated', 'Fecha de creación');
INSERT INTO emp01.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (4, 5, 'us_status', 'Estado del usuario');
INSERT INTO emp01.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (5, 5, 'us_statusclave', 'Estado de la clave de usuario');
INSERT INTO emp01.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (6, 5, 'us_nomapel', 'Nombres del Usuario');
INSERT INTO emp01.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (7, 2, 'emp_ruc', 'RUC');
INSERT INTO emp01.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (8, 2, 'emp_razonsocial', 'Razón Social');
INSERT INTO emp01.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (9, 2, 'emp_nombrecomercial', 'Nombre Comercial');
INSERT INTO emp01.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (10, 2, 'emp_fechaautorizacion', 'Fecha de autorización');
INSERT INTO emp01.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (11, 1, 'cnt_ruc', 'RUC');
INSERT INTO emp01.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (12, 1, 'cnt_razonsocial', 'Razón Social');
INSERT INTO emp01.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (13, 1, 'cnt_telf', 'Teléfono');
INSERT INTO emp01.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (14, 1, 'cnt_email', 'Email');
INSERT INTO emp01.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (15, 1, 'cnt_dirmatriz', 'Dirección Matriz');
INSERT INTO emp01.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (16, 1, 'cnt_clase', 'Clase del contribuyente');
INSERT INTO emp01.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (17, 1, 'cnt_nrocntespecial', 'Nro Contrib Especial');
INSERT INTO emp01.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (18, 1, 'cnt_oblcontab', 'Obligado LLevar Contabilidad');
INSERT INTO emp01.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (19, 1, 'cnt_nombrecomercial', 'Nombre Comercial');

INSERT INTO emp01.ttiposdoc (td_id, td_nombre) VALUES (1, 'FACTURA');
INSERT INTO emp01.ttiposdoc (td_id, td_nombre) VALUES (2, 'NOTA DE CRÉDITO');
INSERT INTO emp01.ttiposdoc (td_id, td_nombre) VALUES (3, 'NOTA DE DÉBITO');
INSERT INTO emp01.ttiposdoc (td_id, td_nombre) VALUES (4, 'GUÍA DE REMISIÓN');
INSERT INTO emp01.ttiposdoc (td_id, td_nombre) VALUES (5, 'COMPROBANTE DE RETENCIÓN');
INSERT INTO emp01.ttiposdoc (td_id, td_nombre) VALUES (6, 'LIQUIDACION DE COMPRAS');

INSERT INTO emp01.tuser (us_id, us_name, us_pass, us_datecreated, us_status, us_statusclave, us_nomapel, us_superuser) VALUES (1, 'admin', 'admin', '2019-07-21 14:13:54.215000', 0, 0, 'ADMIN', 1);

ALTER SEQUENCE public.tplantilla_temp_id_seq RESTART WITH 10;
ALTER SEQUENCE public.tplantilla_temp_id_seq RESTART WITH 2;

