# coding: utf-8
"""
Fecha de creacion 10/15/19
@autor: mjapon
"""
import logging

from sqlalchemy import Column, Integer, String, TIMESTAMP, Text

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy

log = logging.getLogger(__name__)

class TMbroDir(Declarative, JsonAlchemy):
    __tablename__ = 'tmbmdir'


    """
    idm INTEGER NOT NULL PRIMARY KEY,
    tipo TEXT(10) NOT NULL,
    nombre TEXT(80) NOT NULL,
    img TEXT(50) NOT NULL,
    longdet TEXT,
    shortdet TEXT
    """

    idm = Column(Integer, nullable=False, primary_key=True)
    tipo = Column(String(10), nullable=False)
    nombre = Column(String(80), nullable=False)
    img = Column(String(50), nullable=False)
    longdet = Column(Text)
    shortdet = Column(Text) 
