# coding: utf-8
"""
Fecha de creacion 3/12/20
@autor: mjapon
"""
import logging
from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy
from sqlalchemy import Column, Integer, String, TIMESTAMP, Text, Numeric, Date, Boolean, DATETIME

log = logging.getLogger(__name__)


class TItemConfigStock(Declarative, JsonAlchemy):
    __tablename__ = 'titemconfig_stock'

    ice_id = Column(Integer, nullable=False, primary_key=True, autoincrement=True)
    ic_id = Column(Integer, nullable=False)
    sec_id = Column(Integer, nullable=False, default=1)
    ice_stock = Column(Integer, nullable=False, default=0)

    user_crea = Column(Integer, nullable=False)
    fecha_crea = Column(TIMESTAMP, nullable=False)
    user_actualiza = Column(Integer)
    fecha_actualiza = Column(TIMESTAMP)