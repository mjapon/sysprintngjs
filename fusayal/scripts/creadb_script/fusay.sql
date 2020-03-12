create schema fusay;

comment on schema fusay is 'fusay schema';

alter schema fusay owner to postgres;

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
	emp_fechaautorizacion date not null
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
	cnt_nombrecomercial varchar(80) not null
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
	tjd_usercrea integer not null
);

comment on table tjobdoc is 'Registra el trabajo de impresion generado ruta de los archivos PDF';

comment on column tjobdoc.tjd_id is 'Clave primaria de la tabla';

comment on column tjobdoc.tjob_id is 'Trabajo de impresion asociado';

comment on column tjobdoc.tjd_ruta is 'ruta del archivo registrado';

comment on column tjobdoc.tjd_fechacrea is 'Fecha y hora de creacion del registro';

comment on column tjobdoc.tjd_usercrea is 'Usuario que crea el registro';

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

create unique index tparams_tprm_abrev_uindex
	on tparams (tprm_abrev);

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

create table tevents
(
	ev_id serial not null
		constraint tevents_pk
			primary key,
	ev_fecha date not null,
	ev_fechacrea timestamp not null,
	ev_creadopor integer,
	ev_lugar integer,
	ev_horainicio time,
	ev_horafin time,
	ev_nota text,
	ev_publicidad text,
	ev_tipo integer not null,
	ev_precionormal numeric(8,3) default 0.0 not null,
	ev_precioespecial numeric(8,3) default 0.0 not null,
	ev_img text,
	ev_estado integer default 0 not null,
	ev_url varchar(40)
);

comment on table tevents is 'Registra los eventos de la fundacion';

comment on column tevents.ev_estado is '0-valido
1-anulado';

alter table tevents owner to postgres;

create unique index tevents_ev_id_uindex
	on tevents (ev_id);

create table ttipoev
(
	tiev_id serial not null
		constraint ttipoev_pk
			primary key,
	tiev_nombre varchar(80) not null,
	tiev_img varchar(50)
);

comment on table ttipoev is 'Registra tipos de evento';

alter table ttipoev owner to postgres;

create unique index ttipoev_tiev_id_uindex
	on ttipoev (tiev_id);

create table tlugarev
(
	lugc_id serial not null
		constraint tlugarev_pk
			primary key,
	lugc_nombre text not null
);

alter table tlugarev owner to postgres;

create unique index tlugarev_lugc_id_uindex
	on tlugarev (lugc_id);

create table tmbmdir
(
	idm serial not null
		constraint tmbmdir_pk
			primary key,
	tipo varchar(15) not null,
	nombre varchar(80) not null,
	img varchar(50) not null,
	longdet text,
	shortdet text
);

alter table tmbmdir owner to postgres;

create unique index tmbmdir_idm_uindex
	on tmbmdir (idm);

create table tpersona
(
	per_id serial not null
		constraint tperrsona_pk
			primary key,
	per_ciruc varchar(15),
	per_nombres varchar(100) not null,
	per_apellidos varchar(100),
	per_direccion varchar(100),
	per_telf varchar(40),
	per_movil varchar(20),
	per_email varchar(40),
	per_fecreg timestamp,
	per_tipo integer default 1 not null,
	per_lugnac integer,
	per_nota text
);

alter table tpersona owner to postgres;

create unique index tpersona_per_id_uindex
	on tpersona (per_id);

create unique index tpersona_perciruc_uindex
	on tpersona (per_ciruc);

create unique index tpersona_peremail_uindex
	on tpersona (per_email);

create table tpersonaevents
(
	pev_id serial not null
		constraint tpersonaevents_pk
			primary key,
	per_id integer not null,
	ev_id integer not null,
	pev_fecreg timestamp
);

alter table tpersonaevents owner to postgres;

create unique index tpersonaevents_pev_id_uindex
	on tpersonaevents (pev_id);

create table tlugar
(
	lug_id serial not null
		constraint tlugar_pk
			primary key,
	lug_nombre varchar(80) not null,
	lug_parent integer
);

alter table tlugar owner to postgres;

create unique index tlugar_lug_id_uindex
	on tlugar (lug_id);

create table tfuser
(
	us_id serial not null
		constraint tfuser_pk
			primary key,
	us_cuenta varchar(20) not null,
	us_clave varchar(20) not null,
	per_id integer not null,
	us_fechacrea timestamp,
	us_estado integer default 0 not null
);

alter table tfuser owner to postgres;

create unique index tfuser_us_id_uindex
	on tfuser (us_id);

create table ttickets
(
	tk_id serial not null
		constraint ttickets_pk
			primary key,
	tk_nro integer not null,
	tk_fechahora timestamp not null,
	tk_perid integer not null,
	tk_observacion text,
	tk_usercrea integer not null,
	tk_costo numeric(4,2) default 0.0 not null,
	tk_dia date not null,
	tk_estado integer default 1 not null,
	tk_servicios text,
	sec_id integer default 1 not null
);

comment on table ttickets is 'Tabla para registro de tickets';

alter table ttickets owner to postgres;

create unique index ttickets_tk_id_uindex
	on ttickets (tk_id);

create table tclaseitemconfig
(
	clsic_id serial not null
		constraint tclaseitemconfig_pk
			primary key,
	clsic_abreviacion varchar(2) not null,
	clsic_nombre varchar(40) not null,
	clsic_estado integer default 1 not null
);

comment on table tclaseitemconfig is 'Clase  de item de configuracion esto es activo, pasivo , ingreso, gasto';

alter table tclaseitemconfig owner to postgres;

create unique index tclaseitemconfig_cic_id_uindex
	on tclaseitemconfig (clsic_id);

create table tcatitemconfig
(
	catic_id serial not null
		constraint tcatitemconfig_pk
			primary key,
	catic_nombre varchar(60) not null,
	catic_estado integer default 1 not null
);

comment on column tcatitemconfig.catic_nombre is 'Nombre de la categoria del item de configuracion';

comment on column tcatitemconfig.catic_estado is '1-activo
2-inactivo';

alter table tcatitemconfig owner to postgres;

create unique index tcatitemconfig_catic_id_uindex
	on tcatitemconfig (catic_id);

create unique index tcatitemconfig_catic_id_uindex_2
	on tcatitemconfig (catic_id);

create table ttipoitemconfig
(
	tipic_id serial not null
		constraint ttipoitemconfig_pk
			primary key,
	tipic_nombre varchar(80) not null,
	tipic_estado integer default 1 not null
);

comment on column ttipoitemconfig.tipic_nombre is 'Nombre del tipo de item de configuracion';

comment on column ttipoitemconfig.tipic_estado is 'Estado del tipo de item de configuracion';

alter table ttipoitemconfig owner to postgres;

create table titemconfig
(
	ic_id serial not null
		constraint titemconfig_pk
			primary key,
	ic_nombre text not null,
	ic_code text not null,
	ic_padre integer,
	tipic_id integer default 1 not null
		constraint titemconfig_ttipoitemconfig_tipic_id_fk
			references ttipoitemconfig,
	ic_fechacrea timestamp default ('now'::text)::date not null,
	ic_usercrea integer,
	ic_estado integer default 1 not null,
	ic_nota text,
	catic_id integer default 1 not null
		constraint titemconfig_tcatitemconfig_catic_id_fk
			references tcatitemconfig,
	clsic_id integer,
	ic_grabaiva boolean default false not null,
	ic_grabaimpserv boolean default false not null
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

alter table titemconfig owner to postgres;

create unique index titemconfig_ic_code_uindex
	on titemconfig (ic_code);

create unique index titemconfig_ic_id_uindex
	on titemconfig (ic_id);

create table titemconfig_precios
(
	icpre_id serial not null
		constraint tpreciosart_pk
			primary key,
	icpre_preciocompra numeric(10,4) default 0.0 not null,
	icpre_precioventa numeric(10,4) default 0.0 not null,
	icpre_precioventamin numeric(10,4) default 0.0 not null,
	ic_id integer not null
		constraint tpreciosart_titemconfig_ic_id_fk
			references titemconfig,
	sec_id integer default 1 not null
);

alter table titemconfig_precios owner to postgres;

create unique index tpreciosart_part_id_uindex
	on titemconfig_precios (icpre_id);

create table titemconfig_meta
(
	icm_id serial not null
		constraint tdatosproducto_pk
			primary key,
	ic_id integer not null
		constraint tdatosproducto_titemconfig_ic_id_fk
			references titemconfig,
	icm_existencias integer default 0 not null,
	icm_fechacaducidad date,
	icm_proveedor integer default '-2'::integer not null,
	icm_modcontab integer
		constraint tdatosproductomodcontablefk
			references titemconfig,
	sec_id integer default 1 not null
);

comment on column titemconfig_meta.icm_existencias is 'Existencias del producto';

comment on column titemconfig_meta.icm_fechacaducidad is 'Fecha de caducidad del articulo';

alter table titemconfig_meta owner to postgres;

create unique index tdatosproducto_dprod_id_uindex
	on titemconfig_meta (icm_id);

create unique index ttipoitemconfig_tipic_id_uindex
	on ttipoitemconfig (tipic_id);

create table tgrid
(
	grid_id serial not null
		constraint tgrid_pk
			primary key,
	grid_nombre varchar(40) not null,
	grid_basesql text not null,
	grid_columnas text not null,
	grid_fechacrea timestamp default now() not null,
	grid_tupladesc text default ''::text not null
);

comment on table tgrid is 'Registra los grids del sistema';

alter table tgrid owner to postgres;

create unique index tgrid_grid_id_uindex
	on tgrid (grid_id);

create table tblog
(
	blg_id serial not null
		constraint tblog_pk
			primary key,
	blg_fecha date not null,
	blg_autor text not null,
	blg_titulo text not null,
	blg_img text,
	blg_fechacrea timestamp not null,
	blg_contenido text not null
);

alter table tblog owner to postgres;

create unique index tblog_blg_id_uindex
	on tblog (blg_id);

create table tseccion
(
	sec_id serial not null
		constraint tseccion_pk
			primary key,
	sec_nombre varchar(100) not null,
	sec_estado integer default 1 not null
);

comment on table tseccion is 'Registra las secciones de una empresa';

comment on column tseccion.sec_estado is '1-activo
2-inactivo';

alter table tseccion owner to postgres;

create unique index tseccion_sec_id_uindex
	on tseccion (sec_id);

create function inc(val integer) returns integer
	language plpgsql
as $$
BEGIN
    return val+1;
END;
$$;

alter function inc(integer) owner to postgres;

create function poner_iva(val numeric) returns numeric
	language plpgsql
as $$
BEGIN
    return 1.12*val;
END;
$$;

alter function poner_iva(numeric) owner to postgres;

create function quitar_iva(val numeric) returns numeric
	language plpgsql
as $$
BEGIN
    return (val+0.0)/1.12;
END;
$$;

alter function quitar_iva(numeric) owner to postgres;

