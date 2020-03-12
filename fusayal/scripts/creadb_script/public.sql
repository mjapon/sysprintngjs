create database imprentadb
	with owner postgres;

create schema public;

comment on schema public is 'standard public schema';

alter schema public owner to postgres;

create table tuser
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

create table trol
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

create table tuserrol
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

create table tempresa
(
	emp_id serial not null
		constraint tempresa_pkey
			primary key,
	emp_ruc varchar(15) not null,
	emp_razonsocial varchar(100) not null,
	emp_nombrecomercial varchar(100),
	emp_nroautorizacion varchar(5) not null,
	emp_fechaautorizacion date not null,
	emp_esquema varchar(30),
	emp_codigo varchar(30),
	emp_menu text
);

alter table tempresa owner to postgres;

create table tcontribuyente
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
	cnt_nombrecomercial varchar(80) not null,
	cnt_direstab varchar(150)
);

comment on column tcontribuyente.cnt_clase is '0-persona natural, 1-especial, 2-rise, 3-regimen simplificado';

comment on column tcontribuyente.cnt_oblcontab is '0-NO, 1-Si';

alter table tcontribuyente owner to postgres;

create table tautorizacion
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

create table ttiposdoc
(
	td_id integer not null
		constraint tiposdoc_pkey
			primary key,
	td_nombre varchar(40)
);

alter table ttiposdoc owner to postgres;

create table tclasecontrib
(
	cls_id serial not null
		constraint tclasecontrib_pkey
			primary key,
	cls_nombre varchar(80) not null
);

alter table tclasecontrib owner to postgres;

create table tjob
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

create table tstatusjob
(
	sjb_id serial not null
		constraint tstatusjob_pkey
			primary key,
	sjb_nombre varchar(50) not null
);

alter table tstatusjob owner to postgres;

create table report_request
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

create table tplantilla
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

create table taudit
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

create unique index taudit_aud_id_uindex
	on taudit (aud_id);

create table ttabla
(
	tbl_id serial not null
		constraint ttablas_pk
			primary key,
	tbl_nombre varchar(80) not null
);

comment on table ttabla is 'Registra tablas usadas en el sistema por tema de auditorias';

alter table ttabla owner to postgres;

create unique index ttablas_tbl_id_uindex
	on ttabla (tbl_id);

create table tlogos
(
	lg_id serial not null
		constraint tlogos_pk
			primary key,
	logo bytea
);

alter table tlogos owner to postgres;

create unique index tlogos_lg_id_uindex
	on tlogos (lg_id);

create table tjobreprint
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

create unique index tjobreprint_jobrp_id_uindex
	on tjobreprint (jobrp_id);

create table tjobdoc
(
	tjd_id serial not null
		constraint tjobdoc_pk
			primary key,
	tjob_id integer not null,
	tjd_ruta varchar(100) not null,
	tjd_fechacrea timestamp not null,
	tjd_usercrea integer not null,
	tjd_tipo integer default 0 not null
);

comment on table tjobdoc is 'Registra el trabajo de impresion generado ruta de los archivos PDF';

comment on column tjobdoc.tjd_id is 'Clave primaria de la tabla';

comment on column tjobdoc.tjob_id is 'Trabajo de impresion asociado';

comment on column tjobdoc.tjd_ruta is 'ruta del archivo registrado';

comment on column tjobdoc.tjd_fechacrea is 'Fecha y hora de creacion del registro';

comment on column tjobdoc.tjd_usercrea is 'Usuario que crea el registro';

comment on column tjobdoc.tjd_tipo is '0-generado,1-manual';

alter table tjobdoc owner to postgres;

create unique index tjobdoc_tjd_id_uindex
	on tjobdoc (tjd_id);

create table tparams
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

create unique index tparams_tprm_id_uindex
	on tparams (tprm_id);

create table tauditaccion
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

create unique index tauditaccion_taa_id_uindex
	on tauditaccion (taa_id);

create table ttablacol
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

create unique index ttablacol_ttc_id_uindex
	on ttablacol (ttc_id);

create table timprentas
(
	timp_id serial not null
		constraint timprentas_pk
			primary key,
	timp_code varchar(20) not null,
	timp_esquema varchar(10) not null,
	timp_nombrecomercial varchar(80)
);

comment on table timprentas is 'Tabla para registro de imprentas que usan el sistema
';

comment on column timprentas.timp_id is 'Clave primaria de la tabla';

comment on column timprentas.timp_code is 'codigo de la empresa para ingresar al sistema';

comment on column timprentas.timp_esquema is 'Esquema que usa esta empresa';

comment on column timprentas.timp_nombrecomercial is 'Nombre comercial de la empresa';

alter table timprentas owner to postgres;

create unique index timprentas_timp_id_uindex
	on timprentas (timp_id);

create table tmotivreprint
(
	mr_id serial not null
		constraint tmotivreprint_pk
			primary key,
	mr_des text
);

comment on table tmotivreprint is 'Tabla que registra motivos de reimpresion';

comment on column tmotivreprint.mr_id is 'Clave primaria de la tabla';

comment on column tmotivreprint.mr_des is 'descripcion';

alter table tmotivreprint owner to postgres;

create unique index tmotivreprint_mr_id_uindex
	on tmotivreprint (mr_id);

create table tsocio
(
	soc_id serial not null
		constraint tsocio_pk
			primary key,
	soc_nombres varchar(150) not null,
	soc_nui varchar(20) not null,
	soc_clave varchar(80),
	soc_parent integer,
	soc_fechareg timestamp default now() not null,
	soc_permisos varchar(100),
	soc_rutafoto varchar(80)
);

comment on table tsocio is 'Tabla para registro de socios de la corporacion';

comment on column tsocio.soc_id is 'Clave primaria de la tabla
';

comment on column tsocio.soc_nombres is 'NOmbres y apellidos del socio';

comment on column tsocio.soc_nui is 'Numero de cedula de identidad del socio';

comment on column tsocio.soc_clave is 'Clave de acceso para el socio';

comment on column tsocio.soc_parent is 'El socio relacionado (padre, madre o representante)';

comment on column tsocio.soc_fechareg is 'Fecha de registro del socio';

comment on column tsocio.soc_permisos is 'Permisos del usuario en formato json';

comment on column tsocio.soc_rutafoto is 'Ruta donde esta registrada la foto';

alter table tsocio owner to postgres;

create unique index tsocio_soc_id_uindex
	on tsocio (soc_id);

create unique index tsocio_soc_nui_uindex
	on tsocio (soc_nui);

create table ttipocuota
(
	tipc_id serial not null
		constraint ttipocuota_pk
			primary key,
	tipc_nombre varchar(80) not null,
	tipc_abrev varchar(10)
);

comment on table ttipocuota is 'Registra tipos de cuotas de la corporacion';

comment on column ttipocuota.tipc_id is 'Clave primaria de la tabla';

comment on column ttipocuota.tipc_nombre is 'Nombre del tipo de cuota';

comment on column ttipocuota.tipc_abrev is 'Abreviacion del tipo de cuota
';

alter table ttipocuota owner to postgres;

create unique index ttipocuota_tipc_id_uindex
	on ttipocuota (tipc_id);

create table testadopago
(
	tstp_id serial not null
		constraint testadopago_pk
			primary key,
	tstp_nombre varchar(80) not null
);

comment on table testadopago is 'Estado de un pago de una cuota realizada';

comment on column testadopago.tstp_id is 'Clave primaria de la tabla';

comment on column testadopago.tstp_nombre is 'Nombre del estado del pago';

alter table testadopago owner to postgres;

create unique index testadopago_tstp_id_uindex
	on testadopago (tstp_id);

create table tpago
(
	pag_id serial not null
		constraint tpago_pk
			primary key,
	tipc_id integer not null
		constraint tpago_ttipocuota_tipc_id_fk
			references ttipocuota,
	tstp_id integer not null
		constraint tpago_testadopago_tstp_id_fk
			references testadopago,
	soc_id integer
		constraint tpago_tsocio_soc_id_fk
			references tsocio,
	socreg_id integer
		constraint tpago_tsocioreg__fk
			references tsocio,
	pag_fecreg timestamp default now() not null,
	pag_rutacompro varchar(80),
	pag_monto numeric(6,2) default 0.0 not null,
	pag_anio integer not null,
	pag_mes integer not null,
	pag_obs text
);

comment on table tpago is 'Registra los pagos realizados por los socios';

comment on column tpago.pag_id is 'Clave primaria de la tabla';

comment on column tpago.tipc_id is 'Tipo de cuota registrada';

comment on column tpago.tstp_id is 'Estado del pago';

comment on column tpago.soc_id is 'socio que realiza el pago';

comment on column tpago.socreg_id is 'Socio que registra el pago';

comment on column tpago.pag_fecreg is 'Fecha de registro del pago';

comment on column tpago.pag_rutacompro is 'Ruta del comprobante adjunto';

comment on column tpago.pag_monto is 'Monto del pago';

comment on column tpago.pag_anio is 'Anio del pago';

comment on column tpago.pag_mes is 'Mes del pago';

comment on column tpago.pag_obs is 'Observacion del pago';

alter table tpago owner to postgres;

create unique index tpago_pag_id_uindex
	on tpago (pag_id);

create function inc(val integer) returns integer
	language plpgsql
as $$
BEGIN
    return val+1;
END;
$$;

alter function inc(integer) owner to postgres;

