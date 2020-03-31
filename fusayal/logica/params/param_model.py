# coding: utf-8
"""
Fecha de creacion 3/18/20
@autor: mjapon
"""
import datetime
import logging
from sqlalchemy.sql.functions import current_date

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy
from sqlalchemy import Column, Integer, String, TIMESTAMP, Text, Numeric, Date, Boolean, DATETIME

log = logging.getLogger(__name__)


class TParams(Declarative, JsonAlchemy):
    __tablename__ = 'tparams'
    tprm_id = Column(Integer, nullable=False, primary_key=True, autoincrement=True)
    tprm_abrev=Column(String(20), nullable=False)
    tprm_nombre=Column(String(80), nullable=False)
    tprm_val=Column(Text, nullable=False)
    tprm_fechacrea=Column(TIMESTAMP, default=datetime.datetime.now())

