INSERT INTO fusay.tgrid (grid_id, grid_nombre, grid_basesql, grid_columnas, grid_fechacrea, grid_tupladesc) VALUES (1, 'productos', 'select ic.ic_id,
       ic.ic_nombre,
       ic.ic_code,
       ic_nota,
       t.tipic_nombre,
       ic.ic_grabaiva,
       case ic.ic_grabaiva when true then ''SI'' else ''NO'' end AS grabaiva,
       pr.icpre_preciocompra,
       PONER_IVA(pr.icpre_preciocompra) as preciocompraiva,
       pr.icpre_precioventa,
       dp.icm_existencias,
       dp.icm_fechacaducidad
       from titemconfig ic
join titemconfig_meta dp on dp.ic_id = ic.ic_id
           join titemconfig_precios pr on pr.ic_id = ic.ic_id
join ttipoitemconfig t on ic.tipic_id = t.tipic_id
where ic.ic_estado = 1 and {where} order by {order}', '[
    {"label":"Código Barra", "field":"ic_code"},
    {"label":"Nombre", "field":"ic_nombre"},
    {"label":"Graba IVA", "field":"grabaiva"},
    {"label":"Precio Compra (Sin Iva)", "field":"dprod_preciocompra"},
    {"label":"Precio Compra (Con Iva)", "field":"preciocompraiva"},
    {"label":"Precio Venta (Iva Incluido)", "field":"dprod_precioventa"},
    {"label":"Existencias", "field":"dprod_existencias"},
    {"label":"Fecha de caducidad", "field":"dprod_fechacaducidad"}
]', '2020-02-15 21:24:49.000000', '["ic_id", "ic_nombre", "ic_code", "ic_nota", "tipic_nombre", "dprod_grabaiva", "grabaiva", "dprod_preciocompra","dprod_existencias","dprod_fechacaducidad"]');
INSERT INTO fusay.tgrid (grid_id, grid_nombre, grid_basesql, grid_columnas, grid_fechacrea, grid_tupladesc) VALUES (2, 'tickets', ' select
                a.tk_id,
                a.tk_nro,
                a.tk_dia,
                   p.per_nombres||'' ''||p.per_apellidos as per_nomapel,
                   p.per_ciruc,
                   p.per_email,
                   a.tk_costo,
                   a.tk_estado
            from ttickets a
            join tpersona p on a.tk_perid = p.per_id
            where a.tk_dia = ''{tk_dia}'' and a.sec_id={sec_id} and a.tk_estado=1 order by  a.tk_nro', '[
    {"label":"Nro", "field":"tk_nro"},
    {"label":"Nombres y Apellidos", "field":"per_nomapel"},
    {"label":"#Cedula", "field":"per_ciruc"},
    {"label":"Email", "field":"per_email"},
    {"label":"Costo", "field":"tk_costo"}    
]', '2020-03-06 20:38:17.000000', '["tk_id", "tk_nro", "tk_dia", "per_nomapel", "per_ciruc", "per_email", "tk_costo", "tk_estado"]');