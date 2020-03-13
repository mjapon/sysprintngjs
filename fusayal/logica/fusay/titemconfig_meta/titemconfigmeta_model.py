# coding: utf-8
"""
Fecha de creacion 3/12/20
@autor: mjapon
"""
import logging
from sqlalchemy.sql.functions import current_date

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy
from sqlalchemy import Column, Integer, String, TIMESTAMP, Text, Numeric, Date, Boolean, DATETIME

log = logging.getLogger(__name__)


class TItemConfigMeta(Declarative, JsonAlchemy):
    __tablename__ = 'titemconfig_meta'

    """
    icm_id             serial                        not null
    ic_id              integer                       not null
    icm_existencias    integer default 0             not null,
    icm_fechacaducidad date,
    icm_proveedor      integer default '-2'::integer not null,
    icm_modcontab      integer
    sec_id             integer default 1             not null

    """

    icm_id = Column(Integer, nullable=False, primary_key=True, autoincrement=True)
    ic_id = Column(Integer, nullable=False)
    icm_existencias = Column(Integer, default=0,  nullable=False)
    icm_fechacaducidad = Column(Date)
    icm_proveedor = Column(Integer, default=-2, nullable=False)
    icm_modcontab = Column(Integer)
    sec_id = Column(Integer, default=1)

