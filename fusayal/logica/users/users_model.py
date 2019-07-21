# coding: utf-8
"""
Fecha de creacion 3/16/19
@autor: mjapon
"""
from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy

from sqlalchemy import Column, Integer, String, DateTime


class TUser(Declarative, JsonAlchemy):
    __tablename__ = 'tuser'

    """
    us_id          SERIAL      NOT NULL CONSTRAINT tuser_pkey    PRIMARY KEY,
    us_name        VARCHAR(50) NOT NULL,
    us_pass        VARCHAR(50) NOT NULL,
    us_datecreated TIMESTAMP   NOT NULL,
    us_status      INTEGER     NOT NULL
    """
    us_id = Column(Integer, nullable=False, primary_key=True)
    us_name = Column(String(50))
    us_pass = Column(String(50))
    us_datecreated = Column(DateTime)
    us_status = Column(Integer) #0:activao,1:inactivo
    us_statusclave = Column(Integer) #0:temporal, 1:definitivo
    us_nomapel = Column(String(100))
    us_superuser = Column(Integer)


