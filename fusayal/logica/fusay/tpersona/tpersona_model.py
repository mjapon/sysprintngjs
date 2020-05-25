# coding: utf-8
"""
Fecha de creacion 10/26/19
@autor: mjapon
"""
import logging


from sqlalchemy import Column, Integer, String, DateTime, Text, Date

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy

log = logging.getLogger(__name__)


class TPersona(Declarative, JsonAlchemy):
    __tablename__ = 'tpersona'

    per_id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    per_ciruc = Column(String(15), unique=True)
    per_nombres = Column(String(100))
    per_apellidos = Column(String(100))
    per_direccion = Column(String(100))
    per_telf = Column(String(40))
    per_movil = Column(String(20))
    per_email = Column(String(40), unique=True)
    per_fecreg = Column(DateTime)
    per_tipo = Column(Integer, nullable=False, default=1) #1:cliente, 2:personal, 3:proveedor
    per_lugnac = Column(Integer)
    per_nota = Column(Text)
    per_fechanac = Column(Date)
    per_genero = Column(Integer)
    per_estadocivil = Column(Integer)
    per_lugresidencia = Column(Integer)
