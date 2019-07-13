# coding: utf-8
"""
Fecha de creacion 2019-06-07
@autor: mjapon
"""
import logging

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy
from sqlalchemy import Column, Integer, String, Text

log = logging.getLogger(__name__)


class \
        TPlantilla(Declarative, JsonAlchemy):
    __tablename__ = 'tplantilla'

    """
    temp_id    serial       not null
    temp_name  varchar(80)  not null,
    temp_jrxml varchar(800) not null

    """
    temp_id = Column(Integer, nullable=False, primary_key=True)
    temp_name = Column(String(80), nullable=False)
    temp_tipo = Column(Integer, nullable=False)
    temp_jrxml = Column(Text, nullable=False)
    temp_desc = Column(Text)
