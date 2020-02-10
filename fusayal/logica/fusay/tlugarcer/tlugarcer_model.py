# coding: utf-8
"""
Fecha de creacion 10/26/19
@autor: mjapon
"""
import logging
from sqlalchemy import Column, Integer, String, TIMESTAMP, Text, Numeric, Date, Boolean

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy

log = logging.getLogger(__name__)

class TFusayLugarEvent(Declarative, JsonAlchemy):
    __tablename__ = 'Columnas'

    """    
	lugc_id INTEGER NOT NULL,
	lugc_nombre TEXT(80) NOT NULL
    """
    lugc_id = Column(Integer, primary_key=True, nullable=False)
    lugc_nombre = Column(Text, nullable=False)