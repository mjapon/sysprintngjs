# coding: utf-8
"""
Fecha de creacion 
@autor: 
"""
import logging


from sqlalchemy import Column, Integer, String

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy

log = logging.getLogger(__name__)


class TLugar(Declarative, JsonAlchemy):
    __tablename__ = 'tlugar'

    lug_id = Column(Integer, primary_key=True, nullable=False)
    lug_nombre = Column(String(80), nullable=False)
    lug_parent = Column(Integer)
    lug_status = Column(Integer) #1-activo, 2-inactivo
