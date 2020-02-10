# coding: utf-8
"""
Fecha de creacion 10/26/19
@autor: mjapon
"""
import logging

from sqlalchemy import Column, Integer, String

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy

log = logging.getLogger(__name__)


class TFusayTipoEvent(Declarative, JsonAlchemy):
    __tablename__ = 'ttipoev'

    """    
	tiev_id INTEGER NOT NULL,
	tiev_nombre TEXT(80) NOT NULL
    """
    tiev_id = Column(Integer, primary_key=True, nullable=False)
    tiev_nombre = Column(String(80), nullable=False)
