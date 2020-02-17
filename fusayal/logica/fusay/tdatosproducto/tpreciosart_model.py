# coding: utf-8
"""
Fecha de creacion 2/15/20
@autor: mjapon
"""
import logging
from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy
from sqlalchemy import Column, Integer, String, TIMESTAMP, Text, Numeric, Date, Boolean, DATETIME

log = logging.getLogger(__name__)


class TPreciosArt(Declarative, JsonAlchemy):
    __tablename__ = 'tpreciosart'

    """
        part_id             serial                     not null        
        part_preciocompra   numeric(10, 4) default 0.0 not null,
        part_precioventa    numeric(10, 4) default 0.0 not null,
        part_precioventamin numeric(10, 4) default 0.0 not null,
        ic_id               integer                    not null
    """
    part_id = Column(Integer, nullable=False, primary_key=True, autoincrement=True)
    part_preciocompra = Column(Numeric(10, 4), default=0.0, nullable=False)
    part_precioventa = Column(Numeric(10, 4), default=0.0, nullable=False)
    part_precioventamin = Column(Numeric(10, 4), default=0.0, nullable=False)
    ic_id = Column(Integer, nullable=False)
