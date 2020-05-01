# coding: utf-8
"""
Fecha de creacion 4/25/20
@autor: mjapon
"""
import logging

from sqlalchemy import Column, Integer, TIMESTAMP, String, Text

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy

log = logging.getLogger(__name__)


class TUserPaciente(Declarative, JsonAlchemy):
    __tablename__ = 'tuserpaciente'
    up_id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    up_email = Column(String(50), nullable=False)
    up_tipo = Column(Integer, default=1, nullable=False)
    up_pasword = Column(Text)
    up_estado = Column(Integer, default=0, nullable=False)
    up_fechacrea = Column(TIMESTAMP, nullable=False)
    up_nombres = Column(Text, nullable=False)
    up_celular = Column(Text)
    up_photourl = Column(Text)
