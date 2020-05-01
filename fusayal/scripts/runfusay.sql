alter table fusay.tuserpaciente
	add up_photourl text;

alter table fusay.tcita alter column cita_hora type decimal(4,2) using cita_hora::decimal(4,2);

alter table fusay.tcita alter column cita_hora_fin type decimal(4,2) using cita_hora_fin::decimal(4,2);
