create table tempresa
(
    emp_id                serial       not null
        constraint tempresa_pkey
            primary key,
    emp_ruc               varchar(15)  not null,
    emp_razonsocial       varchar(100) not null,
    emp_nombrecomercial   varchar(100),
    emp_nroautorizacion   varchar(5)   not null,
    emp_fechaautorizacion date         not null,
    emp_esquema           varchar(30),
    emp_codigo            varchar(30),
    emp_menu              text
);

alter table tempresa
    owner to postgres;



INSERT INTO public.tempresa (emp_id, emp_ruc, emp_razonsocial, emp_nombrecomercial, emp_nroautorizacion, emp_fechaautorizacion, emp_esquema, emp_codigo, emp_menu) VALUES (1, '1104450877001', 'MANUEL JAPON', 'MANUEL JAPON ED 1', '12121', '2019-07-08', 'fusay', 'fusay', null);