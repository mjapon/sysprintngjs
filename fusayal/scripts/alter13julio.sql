alter table fusay.tconsultam_clasificaval
	add cmcv_color varchar(20);


alter table fusay.tconsultam_clasificaval
	add cmcv_minb numeric(8,2) default 0;

alter table fusay.tconsultam_clasificaval
	add cmcv_maxb numeric(8,2) default 0;


INSERT INTO fusay.tconsultam_clasificaval (cmcv_id, cmcv_nombrecat, cmcv_cat, cmcv_min, cmcv_max, cmcv_color, cmcv_minb, cmcv_maxb) VALUES (1, 'NORMAL', 1, 0.00, 119.00, '#33cc33', 0.00, 79.00);
INSERT INTO fusay.tconsultam_clasificaval (cmcv_id, cmcv_nombrecat, cmcv_cat, cmcv_min, cmcv_max, cmcv_color, cmcv_minb, cmcv_maxb) VALUES (2, 'ELEVADA', 1, 120.00, 129.00, '#ffcc00', 0.00, 79.00);
INSERT INTO fusay.tconsultam_clasificaval (cmcv_id, cmcv_nombrecat, cmcv_cat, cmcv_min, cmcv_max, cmcv_color, cmcv_minb, cmcv_maxb) VALUES (3, 'ALTA (Hipertensión Grado 1)', 1, 130.00, 139.00, '#ff9933', 80.00, 89.00);
INSERT INTO fusay.tconsultam_clasificaval (cmcv_id, cmcv_nombrecat, cmcv_cat, cmcv_min, cmcv_max, cmcv_color, cmcv_minb, cmcv_maxb) VALUES (4, 'ALTA (Hipertensión Grado 2)', 1, 140.00, 180.00, '#ff6600', 90.00, 10000.00);
INSERT INTO fusay.tconsultam_clasificaval (cmcv_id, cmcv_nombrecat, cmcv_cat, cmcv_min, cmcv_max, cmcv_color, cmcv_minb, cmcv_maxb) VALUES (5, 'CRISIS HIPERTENSIVA', 1, 181.00, 10000.00, '#ff0000', 121.00, 10000.00);
INSERT INTO fusay.tconsultam_clasificaval (cmcv_id, cmcv_nombrecat, cmcv_cat, cmcv_min, cmcv_max, cmcv_color, cmcv_minb, cmcv_maxb) VALUES (11, 'BAJO PESO', 3, 0.00, 18.50, '#990000', 0.00, 0.00);
INSERT INTO fusay.tconsultam_clasificaval (cmcv_id, cmcv_nombrecat, cmcv_cat, cmcv_min, cmcv_max, cmcv_color, cmcv_minb, cmcv_maxb) VALUES (12, 'IDEAL', 3, 18.60, 24.90, '#ff0000', 0.00, 0.00);
INSERT INTO fusay.tconsultam_clasificaval (cmcv_id, cmcv_nombrecat, cmcv_cat, cmcv_min, cmcv_max, cmcv_color, cmcv_minb, cmcv_maxb) VALUES (13, 'SOBREPESO', 3, 25.00, 29.90, '#ff6600', 0.00, 0.00);
INSERT INTO fusay.tconsultam_clasificaval (cmcv_id, cmcv_nombrecat, cmcv_cat, cmcv_min, cmcv_max, cmcv_color, cmcv_minb, cmcv_maxb) VALUES (14, 'OBESIDAD', 3, 30.00, 34.90, '#00cc00', 0.00, 0.00);
INSERT INTO fusay.tconsultam_clasificaval (cmcv_id, cmcv_nombrecat, cmcv_cat, cmcv_min, cmcv_max, cmcv_color, cmcv_minb, cmcv_maxb) VALUES (15, 'OBESIDAD SEVERA', 3, 35.00, 39.90, '#ffff66', 0.00, 0.00);
INSERT INTO fusay.tconsultam_clasificaval (cmcv_id, cmcv_nombrecat, cmcv_cat, cmcv_min, cmcv_max, cmcv_color, cmcv_minb, cmcv_maxb) VALUES (16, 'OBESIDAD MORVIDA', 3, 40.00, 10000.00, '#3399ff', 0.00, 0.00);