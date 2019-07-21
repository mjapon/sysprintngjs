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


