# coding: utf-8
"""
Fecha de creacion 3/25/19
@autor: mjapon
"""
import logging

log = logging.getLogger(__name__)

from sqlalchemy import Column, Integer, String, DateTime, Text, Numeric

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy

log = logging.getLogger(__name__)


class TContribuyente(Declarative, JsonAlchemy):
    __tablename__ = 'tcontribuyente'

    """
    cnt_id             SERIAL            NOT NULL
    cnt_ruc            VARCHAR(13)       NOT NULL,
    cnt_razonsocial    VARCHAR(80)       NOT NULL,
    cnt_telf           VARCHAR(40),
    cnt_email          VARCHAR(40),
    cnt_dirmatriz      VARCHAR(100)      NOT NULL,
    cnt_clase          INTEGER           NOT NULL,
    cnt_nrocntespecial VARCHAR(40),
    cnt_oblcontab      INTEGER DEFAULT 0 NOT NULL
    """

    cnt_id = Column(Integer, nullable=False, primary_key=True)
    cnt_ruc = Column(String(13),  nullable=False)
    cnt_razonsocial = Column(String(80),  nullable=False)
    cnt_telf = Column(String(40))
    cnt_email = Column(String(40))
    cnt_dirmatriz = Column(String(100), nullable=False)
    cnt_clase = Column(Integer, nullable=False)
    cnt_nrocntespecial = Column(String(40), nullable=False)
    cnt_oblcontab = Column(Integer, nullable=False, default=0)
    cnt_nombrecomercial = Column(String(80), nullable=False)