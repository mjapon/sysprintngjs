# coding: utf-8
"""
Fecha de creacion 3/25/19
@autor: mjapon
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, Numeric, SmallInteger

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy


class TAudit(Declarative, JsonAlchemy):
    __tablename__ = 'taudit'

    aud_id = Column(Integer, nullable=False, primary_key=True)
    tbl_id = Column(Integer, nullable=False)
    aud_accion = Column(SmallInteger)
    aud_userid = Column(Integer)
    aud_fechahora = Column(DateTime)
    aud_valorant = Column(Text)
    aud_valordesp = Column(Text)
    aud_obs = Column(String(800))
    aud_campo = Column(String(100))
    aud_codreg = Column(Integer)