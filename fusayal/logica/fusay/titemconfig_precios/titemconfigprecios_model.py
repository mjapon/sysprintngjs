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


class TItemConfigPrecios(Declarative, JsonAlchemy):
    __tablename__ = 'titemconfig_precios'

    """
     icpre_id             serial                     not null        
    icpre_preciocompra   numeric(10, 4) default 0.0 not null,
    icpre_precioventa    numeric(10, 4) default 0.0 not null,
    icpre_precioventamin numeric(10, 4) default 0.0 not null,
    ic_id                integer                    not null        
    sec_id               integer        default 1   not null
    """
    icpre_id = Column(Integer, nullable=False, primary_key=True, autoincrement=True)
    icpre_preciocompra = Column(Numeric(10, 4), default=0.0, nullable=False)
    icpre_precioventa = Column(Numeric(10, 4), default=0.0, nullable=False)
    icpre_precioventamin = Column(Numeric(10, 4), default=0.0, nullable=False)
    ic_id = Column(Integer, nullable=False)
    sec_id = Column(Integer, nullable=False, default=1)
