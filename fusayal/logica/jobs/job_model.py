# coding: utf-8
"""
Fecha de creacion 3/27/19
@autor: mjapon
"""
import logging

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy

from sqlalchemy import Column, Integer, String, DateTime, Text, Numeric

log = logging.getLogger(__name__)


class TJob(Declarative, JsonAlchemy):
    __tablename__ = 'tjob'

    """
      job_id                 SERIAL            NOT NULL
      aut_id                 INTEGER           NOT NULL
      job_fechacreacion      TIMESTAMP         NOT NULL,
      job_estado             INTEGER           NOT NULL,
      job_fechaactualizacion TIMESTAMP,
      job_nrocopias          INTEGER DEFAULT 1 NOT NULL,
      cnt_id                 INTEGER           NOT NULL
      user_crea              INTEGER           NOT NULL,
      user_actualiza         INTEGER
    """

    job_id = Column(Integer, nullable=False, primary_key=True)
    aut_id = Column(Integer, nullable=False)
    job_fechacreacion = Column(DateTime, nullable=False)
    job_estado = Column(Integer, nullable=False)
    job_fechaactualizacion = Column(DateTime, nullable=False)
    job_nrocopias = Column(Integer, nullable=False)
    temp_id = Column(Integer)
    cnt_id = Column(Integer, nullable=False)
    user_crea = Column(Integer, nullable=False)
    user_actualiza = Column(Integer)
