alter table tcontribuyente
	add cnt_direstab varchar(150);

comment on column tcontribuyente.cnt_direstab is 'Direccion del establecimiento';