alter table public.tjobdoc
	add tjd_tipo int default 0 not null;

comment on column public.tjobdoc.tjd_tipo is '0-generado,1-manual';

update public.tplantilla
set temp_params = '{"fec":2}'
where temp_name = 'Log autorizaciones generadas';
