# coding: utf-8
"""
Fecha de creacion 8/27/19
@autor: mjapon
"""
import logging
from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy
from sqlalchemy import Column, Integer, String, DATETIME, Numeric, Text


log = logging.getLogger(__name__)


class TSocio(Declarative, JsonAlchemy):
    __tablename__ = 'tsocio'

    soc_id = Column(Integer, nullable=False, primary_key=True)
    soc_nombres = Column(String(150), nullable=False)
    soc_nui = Column(String(20), nullable=False)
    soc_clave = Column(String(80))
    soc_parent = Column(Integer)
    soc_fechareg = Column(DATETIME, nullable=False)
    soc_permisos = Column(String(100))
    soc_rutafoto = Column(String(80))