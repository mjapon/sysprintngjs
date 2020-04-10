# coding: utf-8
"""
Fecha de creacion 4/4/20
@autor: mjapon
"""
import logging

log = logging.getLogger(__name__)

from sqlalchemy.sql.functions import current_date

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy
from sqlalchemy import Column, Integer, String, TIMESTAMP, Text, Numeric, Date, Boolean, DATETIME, CHAR


class TItemConfigAudit(Declarative, JsonAlchemy):
    __tablename__ = 'titemconfig_audit'

    """
    ica_id         serial         not null        
    ic_id          integer        not null,
    user_crea      integer        not null,
    fecha_crea     timestamp      not null,
    ica_tipo       char           not null,
    ica_valantes   numeric(10, 4) not null,
    ica_valdespues numeric(10, 4) not null,
    sec_id         integer        not null

    """
    ica_id = Column(Integer, nullable=False, primary_key=True, autoincrement=True)
    ic_id = Column(Integer, nullable=False)
    user_crea = Column(Integer, nullable=False)
    fecha_crea = Column(TIMESTAMP, nullable=False)
    ica_tipo = Column(CHAR, nullable=False)
    ica_valantes = Column(Numeric(10, 4))
    ica_valdespues = Column(Numeric(10, 4))
    sec_id = Column(Integer, nullable=False)
