alter table tcontribuyente
	add cnt_direstab varchar(150);

comment on column tcontribuyente.cnt_direstab is 'Direccion del establecimiento';


create table tmotivreprint
(
	mr_id serial not null,
	mr_des text
);

comment on table tmotivreprint is 'Tabla que registra motivos de reimpresion';

comment on column tmotivreprint.mr_id is 'Clave primaria de la tabla';

comment on column tmotivreprint.mr_des is 'descripcion';

create unique index tmotivreprint_mr_id_uindex
	on tmotivreprint (mr_id);

alter table tmotivreprint
	add constraint tmotivreprint_pk
		primary key (mr_id);

