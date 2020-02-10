# coding: utf-8
"""
Fecha de creacion 10/26/19
@autor: mjapon
"""
import logging

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy

log = logging.getLogger(__name__)


from sqlalchemy import Column, Integer, String, TIMESTAMP, Text, Numeric, Date, Boolean, DATETIME


class TFusayEvent(Declarative, JsonAlchemy):
    __tablename__ = 'tevents'

    """
    ev_id INTEGER NOT NULL,
	ev_fecha TEXT NOT NULL,
	ev_fechacrea TEXT NOT NULL,
	ev_creadopor INTEGER,
	ev_lugar INTEGER,
	ev_horainicio TEXT,
	ev_horafin TEXT,
	ev_nota TEXT,
	ev_publicidad TEXT,
	ev_tipo INTEGER NOT NULL,
	ev_precionormal REAL DEFAULT 0.0 NOT NULL,
	ev_precioespecial REAL DEFAULT 0.0,
	ev_img TEXT
    """
    ev_id = Column(Integer, nullable=False, primary_key=True, autoincrement=True)
    ev_fecha = Column(Date, nullable=False)
    ev_fechacrea = Column(DATETIME, nullable=False)
    ev_creadopor = Column(Integer)
    ev_lugar = Column(Integer)
    ev_horainicio = Column(Text)
    ev_horafin = Column(Text)
    ev_nota = Column(Text)
    ev_publicidad = Column(Text)
    ev_tipo = Column(Integer, nullable=False) #1:Cer, 2:Bañ, 3:Limp con med, 4:Limp ca, 5:Danza, 6: Temazcal
    ev_precionormal = Column(Numeric(15, 4), default=0.0)
    ev_precioespecial = Column(Numeric(15, 4), default=0.0)
    ev_img = Column(Text)
    ev_estado = Column(Integer)
    ev_url = Column(String(40))