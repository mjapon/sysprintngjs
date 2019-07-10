# coding: utf-8
"""
Fecha de creacion 28/7/18
@autor: mjapon
"""
from sqlalchemy import Column, Integer, String, DateTime

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy


class TSocios(Declarative, JsonAlchemy):
    __tablename__ = 'tartcompuesto'

    """
    socio_id       SERIAL      NOT NULL
    socio_nui      VARCHAR(11),
    socio_nombre   VARCHAR(80) NOT NULL,
    socio_fechareg TIMESTAMP   NOT NULL
    """
    socio_id = Column(Integer, nullable=False, primary_key=True)
    socio_nui = Column(String(11))
    socio_nombre = Column(String(80))
    socio_fechareg = Column(DateTime)
    socio_foto = Column(String(40))

