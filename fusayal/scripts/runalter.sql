create table tauditaccion
(
	taa_id int not null,
	taa_accion varchar(20) not null
);

comment on table tauditaccion is 'Acciones realizadas en auditorias';

comment on column tauditaccion.taa_id is 'Clave primaria de la tabla
';

create unique index tauditaccion_taa_id_uindex
	on tauditaccion (taa_id);

alter table tauditaccion
	add constraint tauditaccion_pk
		primary key (taa_id);



create table ttablacol
(
	ttc_id serial not null,
	tbl_id int not null,
	ttc_name text,
	ttc_label text
);

comment on table ttablacol is 'Tabla para registro de columnas por tabla';

comment on column ttablacol.ttc_id is 'clave primaria';

comment on column ttablacol.tbl_id is 'codigo de la tabla';

create unique index ttablacol_ttc_id_uindex
	on ttablacol (ttc_id);

alter table ttablacol
	add constraint ttablacol_pk
		primary key (ttc_id);



alter table tplantilla
	add temp_params text;

comment on column tplantilla.temp_params is 'Parametros para la generacion de reportes';


alter table tuser
	add us_superuser int default 0;

comment on column tuser.us_superuser is 'Indica si la cuenta de usuario es de tipo superusuario';


create table timprentas
(
	timp_id serial not null,
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

create unique index timprentas_timp_id_uindex
	on timprentas (timp_id);

alter table timprentas
	add constraint timprentas_pk
		primary key (timp_id);



INSERT INTO public.tauditaccion (taa_id, taa_accion) VALUES (1, 'Creación');
INSERT INTO public.tauditaccion (taa_id, taa_accion) VALUES (2, 'Actualización');
INSERT INTO public.tauditaccion (taa_id, taa_accion) VALUES (3, 'Eliminación');
INSERT INTO public.tauditaccion (taa_id, taa_accion) VALUES (4, 'Acceso');


INSERT INTO public.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (1, 5, 'us_name', 'Nombre cuenta de usuario');
INSERT INTO public.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (2, 5, 'us_pass', 'Clave de Usuario');
INSERT INTO public.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (3, 5, 'us_datecreated', 'Fecha de creación');
INSERT INTO public.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (4, 5, 'us_status', 'Estado del usuario');
INSERT INTO public.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (5, 5, 'us_statusclave', 'Estado de la clave de usuario');
INSERT INTO public.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (6, 5, 'us_nomapel', 'Nombres del Usuario');
INSERT INTO public.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (7, 2, 'emp_ruc', 'RUC');
INSERT INTO public.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (8, 2, 'emp_razonsocial', 'Razón Social');
INSERT INTO public.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (9, 2, 'emp_nombrecomercial', 'Nombre Comercial');
INSERT INTO public.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (10, 2, 'emp_fechaautorizacion', 'Fecha de autorización');
INSERT INTO public.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (11, 1, 'cnt_ruc', 'RUC');
INSERT INTO public.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (12, 1, 'cnt_razonsocial', 'Razón Social');
INSERT INTO public.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (13, 1, 'cnt_telf', 'Teléfono');
INSERT INTO public.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (14, 1, 'cnt_email', 'Email');
INSERT INTO public.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (15, 1, 'cnt_dirmatriz', 'Dirección Matriz');
INSERT INTO public.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (16, 1, 'cnt_clase', 'Clase del contribuyente');
INSERT INTO public.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (17, 1, 'cnt_nrocntespecial', 'Nro Contrib Especial');
INSERT INTO public.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (18, 1, 'cnt_oblcontab', 'Obligado LLevar Contabilidad');
INSERT INTO public.ttablacol (ttc_id, tbl_id, ttc_name, ttc_label) VALUES (19, 1, 'cnt_nombrecomercial', 'Nombre Comercial');


INSERT INTO public.timprentas (timp_id, timp_code, timp_esquema, timp_nombrecomercial) VALUES (1, 'demo', 'public', 'EMPRESA 01');
INSERT INTO public.timprentas (timp_id, timp_code, timp_esquema, timp_nombrecomercial) VALUES (2, 'emp01', 'emp01', 'EMPRESA 02');


INSERT INTO public.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (10, 'CREAR USUARIO', 'PERMITE DAR DE ALTA UN USUARIO EN EL SISTEMA', 'CREATEUSER', 0);
INSERT INTO public.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (12, 'EDITAR USUARIO', 'PERMITE CAMBIAR EL NOMBRE DE LA CUENTA Y LOS NOMBRES Y APELLIDOS', 'EDITUSER', 0);
INSERT INTO public.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (13, 'RESETEAR CLAVE', 'PERMITE RESETEAR LA CLAVE DE UN USUARIO', 'RESETCLAVE', 0);
INSERT INTO public.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (1, 'ACCESO REPORTES', null, 'ACCESREPORTES', 0);
INSERT INTO public.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (15, 'EDICIÓN DE CONTRIBUYENTES', null, 'EDITCONTRIB', 0);
INSERT INTO public.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (14, 'CREACIÓN DE CONTRIBUYENTES', null, 'CREACONTRIB', 0);
INSERT INTO public.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (16, 'CREACIÓN AUTORIZACIONES', null, 'CREAAUT', 0);
INSERT INTO public.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (18, 'CREACIÓN DE DOCUMENTOS', null, 'CREADOC', 0);
INSERT INTO public.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (17, 'EDICIÓN DE AUTORIZACIONES', null, 'EDITAUT', 0);
INSERT INTO public.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (19, 'ACTUALIZACIÓN DE DOCUMENTOS', null, 'UPDATEDOC', 0);
INSERT INTO public.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (2, 'EDICION DATOS ESTABLECIMIENTO GRÁFICO', null, 'EMPRESAEDIT', 0);
INSERT INTO public.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (3, 'LISTADO DE CONTRIBUYENTES', null, 'LISTACONTRIB', 0);
INSERT INTO public.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (4, 'LISTADO DE AUTORIZACIONES', null, 'LISTAAUT', 0);
INSERT INTO public.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (5, 'LISTADO DE USUARIOS', null, 'LISTAUSER', 0);
INSERT INTO public.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (6, 'LISTADO DE DOCUMENTOS', null, 'LISTADOC', 0);
INSERT INTO public.trol (rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo) VALUES (7, 'ACCESO PLANTILLAS', null, 'ACCESPLANTILLAS', 0);

INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (1, 'FACTURA A4', '/opt/sysprintngjs/fusayal/scripts/reportes/facturaA4.jrxml', 1, null, null);
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (2, 'Reporte autorizaciones', '/opt/sysprintngjs/fusayal/scripts/reportes/logAutorizaciones.jrxml', 3, null, '{}');
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (3, 'Log auditoría usuarios', '/opt/sysprintngjs/fusayal/scripts/reportes/logAuditoriaUsuarios.jrxml', 2, null, '{"fec":2}');
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (4, 'Log auditoría imprenta', '/opt/sysprintngjs/fusayal/scripts/reportes/logAuditoriaImprenta.jrxml', 2, null, '{}');
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (5, 'Log auditoría empresa', '/opt/sysprintngjs/fusayal/scripts/reportes/logAuditoriaContrib.jrxml', 2, null, '{"cnt":1}');
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (6, 'Log autorizaciones generadas', '/opt/sysprintngjs/fusayal/scripts/reportes/logAutorizacionesGen.jrxml', 2, null, '{"fec":2, "cnt":1}');
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (7, 'Log transaccional', '/opt/sysprintngjs/fusayal/scripts/reportes/logTransaccional.jrxml', 2, null, '{"fec":2, "cnt":1, "statusjob":1}');
INSERT INTO public.tplantilla (temp_id, temp_name, temp_jrxml, temp_tipo, temp_desc, temp_params) VALUES (8, 'Log registro y control de acceso', '/opt/sysprintngjs/fusayal/scripts/reportes/logAccesoAudit.jrxml', 2, null, '{"fec":2}');
