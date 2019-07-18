select t.tbl_id,
       t.aud_fechahora::date,
       t.aud_fechahora::time,
       tu.us_nomapel as userrealiza,
       t.aud_accion,
       taa.taa_accion,
       tua.us_nomapel as userafectado,
       t.aud_campo,
       ttc.ttc_label,
       t.aud_valorant,
       t.aud_valordesp
from taudit t
join tuser tu on t.aud_userid = tu.us_id
join tuser tua on t.aud_codreg = tua.us_id
    left join ttablacol ttc on ttc.tbl_id = 5 and ttc.ttc_name = t.aud_campo
join tauditaccion taa on t.aud_accion = taa.taa_id
where t.tbl_id = 5;


