# coding: utf-8
"""
Fecha de creacion 3/25/19
@autor: mjapon
"""
import logging

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy
from sqlalchemy import Column, Integer, String, DateTime, TEXT

log = logging.getLogger(__name__)


class TEmpresa(Declarative, JsonAlchemy):
    __tablename__ = 'tempresa'

    emp_id = Column(Integer, nullable=False, primary_key=True)
    emp_ruc = Column(String(15), nullable=False)
    emp_razonsocial = Column(String(100), nullable=False)
    emp_nombrecomercial = Column(String(100))
    emp_nroautorizacion = Column(String(5), nullable=False)
    emp_fechaautorizacion = Column(DateTime, nullable=False)
    emp_esquema = Column(String(30))
    emp_codigo = Column(String(30))
    emp_menu = Column(TEXT)
