# coding: utf-8
"""
Fecha de creacion 3/24/19
@autor: mjapon
"""

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy
from sqlalchemy import Column, Integer, String


class TUserRol(Declarative, JsonAlchemy):
    __tablename__ = 'tuserrol'

    """
      usrl_id SERIAL  NOT NULL
      us_id   INTEGER NOT NULL
      rl_id   INTEGER NOT NULL
    """
    usrl_id = Column(Integer, nullable=False, primary_key=True)
    us_id = Column(Integer)
    rl_id = Column(Integer)