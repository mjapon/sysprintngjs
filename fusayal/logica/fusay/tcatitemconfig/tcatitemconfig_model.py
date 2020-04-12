# coding: utf-8
"""
Fecha de creacion 2/17/20
@autor: mjapon
"""
import logging

log = logging.getLogger(__name__)

from fusayal.models.conf import Declarative
from sqlalchemy import Column, Integer, DateTime, Numeric, Text, String

from fusayal.utils.jsonutil import JsonAlchemy


class TCatItemConfig(Declarative, JsonAlchemy):
    __tablename__ = 'tcatitemconfig'

    catic_id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    catic_nombre = Column(String(60), nullable=False)
    catic_estado = Column(Integer, default=1, nullable=False)
