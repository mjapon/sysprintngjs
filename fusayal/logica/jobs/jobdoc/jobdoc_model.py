# coding: utf-8
"""
Fecha de creacion 3/27/19
@autor: mjapon
"""

import logging

from sqlalchemy import Column, Integer, DateTime, Text

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy

log = logging.getLogger(__name__)


class TJobDoc(Declarative, JsonAlchemy):
    __tablename__ = 'tjobdoc'

    """
     tjd_id        integer      not null    
     tjob_id       integer      not null,
     tjd_ruta      varchar(100) not null,
     tjd_fechacrea timestamp    not null,
     tjd_usercrea  integer      not null
    """
    tjd_id = Column(Integer, nullable=False, primary_key=True)
    tjob_id = Column(Integer, nullable=False)
    tjd_ruta = Column(Text, nullable=False)
    tjd_fechacrea = Column(DateTime, nullable=False)
    tjd_usercrea = Column(Integer, nullable=False)
