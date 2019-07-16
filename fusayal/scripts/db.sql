--Cambios realizados el 11/07/2019
create table tjobreprint
(
	jobrp_id serial not null,
	job_id int not null,
	jobrp_secini int not null,
	jobrp_secfin int not null,
	jobrp_obs text,
	user_crea int not null,
	jobrp_fechacrea timestamp not null
);

comment on column tjobreprint.jobrp_id is 'Clave primaria';

comment on column tjobreprint.job_id is 'Trabajo de impresion que se realiza la reimpresion';

comment on column tjobreprint.jobrp_secini is 'Secuencia inicial que se realiza la reimpresion';

comment on column tjobreprint.jobrp_secfin is 'Secuencia final que se realiza la reimpresion';

comment on column tjobreprint.jobrp_obs is 'Motivo de la reimpresion';

comment on column tjobreprint.user_crea is 'Usuario que realiza la reimpresion';

comment on column tjobreprint.jobrp_fechacrea is 'Fecha en la que se realiza la reimpresion';

create unique index tjobreprint_jobrp_id_uindex
	on tjobreprint (jobrp_id);

alter table tjobreprint
	add constraint tjobreprint_pk
		primary key (jobrp_id);



create table tjobdoc
(
	tjd_id int not null,
	tjob_id int not null,
	tjd_ruta varchar(100) not null,
	tjd_fechacrea timestamp not null,
	tjd_usercrea int not null
);

comment on table tjobdoc is 'Registra el trabajo de impresion generado ruta de los archivos PDF';

comment on column tjobdoc.tjd_id is 'Clave primaria de la tabla';

comment on column tjobdoc.tjob_id is 'Trabajo de impresion asociado';

comment on column tjobdoc.tjd_ruta is 'ruta del archivo registrado';

comment on column tjobdoc.tjd_fechacrea is 'Fecha y hora de creacion del registro';

comment on column tjobdoc.tjd_usercrea is 'Usuario que crea el registro';

create unique index tjobdoc_tjd_id_uindex
	on tjobdoc (tjd_id);

alter table tjobdoc
	add constraint tjobdoc_pk
		primary key (tjd_id);


create table tparams
(
	tprm_id serial not null,
	tprm_abrev varchar(20) not null,
	tprm_nombre varchar(80) not null,
	tprm_val text not null,
	tprm_fechacrea timestamp default CURRENT_TIMESTAMP
);

comment on table tparams is 'Registra parametros del sistema';

comment on column tparams.tprm_id is 'Clave primaria de la tabla';

comment on column tparams.tprm_abrev is 'Abreviacion del parametro';

comment on column tparams.tprm_nombre is 'Nombre del parametro';

create unique index tparams_tprm_id_uindex
	on tparams (tprm_id);

alter table tparams
	add constraint tparams_pk
		primary key (tprm_id);




create sequence tjobdoc_tjd_id_seq;

alter table tjobdoc alter column tjd_id set default nextval('public.tjobdoc_tjd_id_seq');

alter sequence tjobdoc_tjd_id_seq owned by tjobdoc.tjd_id;


--Se cambia en la parte de registro de los trabajos de impesion