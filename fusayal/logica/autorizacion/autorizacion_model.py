# coding: utf-8
"""
Fecha de creacion 3/25/19
@autor: mjapon
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, Numeric

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy


class TAutorizacion(Declarative, JsonAlchemy):
    __tablename__ = 'tautorizacion'

    """
    aut_id                SERIAL      NOT NULL    
    aut_numero            NUMERIC(10) NOT NULL,
    aut_fechaautorizacion DATE        NOT NULL,
    aut_fechacaducidad    DATE        NOT NULL,
    aut_tipodoc           INTEGER     NOT NULL,
    aut_estab             VARCHAR(3)  NOT NULL,
    aut_ptoemi            VARCHAR(3)  NOT NULL,
    aut_secuencial        NUMERIC(9)  NOT NULL,
    cnt_id                INTEGER     NOT NULL
    """

    aut_id = Column(Integer, nullable=False, primary_key=True)
    aut_numero = Column(Numeric(10), nullable=False)
    aut_fechaautorizacion = Column(DateTime, nullable=False)
    aut_fechacaducidad = Column(DateTime, nullable=False)
    aut_tipodoc = Column(Integer, nullable=False)
    aut_estab = Column(String(3), nullable=False)
    aut_ptoemi = Column(String(3), nullable=False)
    aut_secuencia_ini = Column(Numeric(9), nullable=False)
    cnt_id = Column(Integer, nullable=False)
    aut_secuencia_fin = Column(Numeric(9), nullable=False)