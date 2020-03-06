create table fusay.tblog
(
	blg_id serial not null,
	blg_fecha date not null,
	blg_autor text not null,
	blg_titulo text not null,
	blg_img text,
	blg_fechacrea timestamp not null,
	blg_contenido text not null
);

create unique index tblog_blg_id_uindex
	on fusay.tblog (blg_id);

alter table fusay.tblog
	add constraint tblog_pk
		primary key (blg_id);

