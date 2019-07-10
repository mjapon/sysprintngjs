# coding: utf-8
"""
Fecha de creacion 25/8/18
@autor: mjapon
"""
from sqlalchemy import Column, Integer, String, DateTime, Text

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy

class TUsuarios():

    """
    us_id     SERIAL            NOT NULL
    us_clave  TEXT              NOT NULL,
    us_fecreg TIMESTAMP         NOT NULL,
    us_estado INTEGER DEFAULT 0 NOT NULL,
    sc_id     INTEGER           NOT NULL
    """
    us_id = Column(Integer, nullable=False, primary_key=True)
    us_clave = Column(Text)
    us_fecreg = Column(DateTime)
    us_estado = Column(Integer)
    sc_id = Column(Integer)

