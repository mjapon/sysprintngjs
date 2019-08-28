-- auto-generated definition
create table testadopago
(
    tstp_id     serial      not null
        constraint testadopago_pk
            primary key,
    tstp_nombre varchar(80) not null
);

comment on table testadopago is 'Estado de un pago de una cuota realizada';

comment on column testadopago.tstp_id is 'Clave primaria de la tabla';

comment on column testadopago.tstp_nombre is 'Nombre del estado del pago';

alter table testadopago
    owner to postgres;

create unique index testadopago_tstp_id_uindex
    on testadopago (tstp_id);



create table tsocio
(
	soc_id serial not null,
	soc_nombres varchar(150) not null,
	soc_nui varchar(20) not null,
	soc_clave varchar(80),
	soc_parent int,
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

create unique index tsocio_soc_id_uindex
	on tsocio (soc_id);

create unique index tsocio_soc_nui_uindex
	on tsocio (soc_nui);

alter table tsocio
	add constraint tsocio_pk
		primary key (soc_id);



create table ttipocuota
(
	tipc_id serial not null,
	tipc_nombre varchar(80) not null,
	tipc_abrev varchar(10)
);

comment on table ttipocuota is 'Registra tipos de cuotas de la corporacion';

comment on column ttipocuota.tipc_id is 'Clave primaria de la tabla';

comment on column ttipocuota.tipc_nombre is 'Nombre del tipo de cuota';

comment on column ttipocuota.tipc_abrev is 'Abreviacion del tipo de cuota
';

create unique index ttipocuota_tipc_id_uindex
	on ttipocuota (tipc_id);

alter table ttipocuota
	add constraint ttipocuota_pk
		primary key (tipc_id);



create table tpago
(
	pag_id serial not null,
	tipc_id int not null
		constraint tpago_ttipocuota_tipc_id_fk
			references ttipocuota,
	tstp_id int not null
		constraint tpago_testadopago_tstp_id_fk
			references testadopago,
	soc_id int
		constraint tpago_tsocio_soc_id_fk
			references tsocio,
	socreg_id int
		constraint tpago_tsocioreg__fk
			references tsocio,
	pag_fecreg timestamp default now() not null,
	pag_rutacompro varchar(80),
	pag_monto numeric(6,2) default 0.0 not null,
	pag_anio int not null,
	pag_mes int not null,
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

create unique index tpago_pag_id_uindex
	on tpago (pag_id);

alter table tpago
	add constraint tpago_pk
		primary key (pag_id);

