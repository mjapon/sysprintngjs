# coding: utf-8
"""
Fecha de creacion 8/27/19
@autor: mjapon
"""
import logging
from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy
from sqlalchemy import Column, Integer, String, DATETIME, Numeric, Text

log = logging.getLogger(__name__)


class TPago(Declarative, JsonAlchemy):
    __tablename__ = 'tpago'

    pag_id = Column(Integer, nullable=False, primary_key=True)
    tipc_id = Column(Integer, nullable=False)
    tstp_id = Column(Integer, nullable=False)
    soc_id = Column(Integer, nullable=False)
    socreg_id = Column(Integer, nullable=False)
    pag_fecreg = Column(DATETIME, nullable=False)
    pag_rutacompro = Column(String(80))
    pag_monto = Column(Numeric(6, 2), nullable=False)
    pag_anio = Column(Integer, nullable=False)
    pag_mes = Column(Integer, nullable=False)
    pag_obs = Column(Text)
