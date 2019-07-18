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

