alter table tplantilla
	add temp_tipo int default 1 not null;

comment on column tplantilla.temp_tipo is '1:plantilla para factura
2:reporte del sistema';

alter table tplantilla
	add temp_desc text;