# coding: utf-8
"""
Fecha de creacion 3/24/19
@autor: mjapon
"""

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy
from sqlalchemy import Column, Integer, String


class TRol(Declarative, JsonAlchemy):
    __tablename__ = 'trol'

    """
      rl_id          SERIAL            NOT NULL
      rl_name        VARCHAR(50)       NOT NULL,
      rl_desc        VARCHAR(100),
      rl_abreviacion VARCHAR(50)       NOT NULL,
      rl_grupo       INTEGER DEFAULT 0 NOT NULL
    """
    rl_id = Column(Integer, nullable=False, primary_key=True)
    rl_name = Column(String(50))
    rl_desc = Column(String(100))
    rl_abreviacion = Column(String(50))
    rl_grupo = Column(Integer)