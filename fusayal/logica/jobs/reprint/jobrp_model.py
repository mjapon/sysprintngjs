# coding: utf-8
"""
Fecha de creacion 3/27/19
@autor: mjapon
"""

import logging

from sqlalchemy import Column, Integer, Text, DateTime

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy

log = logging.getLogger(__name__)


class TJobReprint(Declarative, JsonAlchemy):
    __tablename__ = 'tjobreprint'

    """
      jobrp_id        serial    not null    
      job_id          integer   not null,
      jobrp_secini    integer   not null,
      jobrp_secfin    integer   not null,
      jobrp_obs       text,
      user_crea       integer   not null,
      jobrp_fechacrea timestamp not null
    """

    jobrp_id  = Column(Integer, nullable=False, primary_key=True)
    job_id  = Column(Integer, nullable=False)
    jobrp_secini = Column(Integer, nullable=False)
    jobrp_secfin = Column(Integer, nullable=False)
    jobrp_obs = Column(Text)
    user_crea = Column(Integer, nullable=False)
    jobrp_fechacrea = Column(DateTime)
