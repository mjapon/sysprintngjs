# coding: utf-8
"""
Fecha de creacion
@autor:
"""
import logging


from sqlalchemy import Column, Integer, DateTime

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy

log = logging.getLogger(__name__)


class TPersonaEvent(Declarative, JsonAlchemy):
    __tablename__ = 'tpersonaevents'

    pev_id = Column(Integer, primary_key=True, nullable=False)
    per_id = Column(Integer, nullable=False)
    ev_id = Column(Integer, nullable=False)
    pev_fecreg = Column(DateTime)
