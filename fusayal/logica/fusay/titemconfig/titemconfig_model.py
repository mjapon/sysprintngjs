# coding: utf-8
"""
Fecha de creacion 2/15/20
@autor: mjapon
"""
import logging

from sqlalchemy.sql.functions import current_date

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy
from sqlalchemy import Column, Integer, String, TIMESTAMP, Text, Numeric, Date, Boolean, DATETIME

log = logging.getLogger(__name__)


class TItemConfig(Declarative, JsonAlchemy):
    __tablename__ = 'titemconfig'

    ic_id = Column(Integer, nullable=False, primary_key=True, autoincrement=True)
    ic_nombre = Column(Text, nullable=False)
    ic_code = Column(Text, unique=True)
    ic_padre = Column(Integer)
    tipic_id = Column(Integer, default=1, nullable=False)
    ic_estado = Column(Integer, default=1, nullable=False)
    ic_nota = Column(Text)
    catic_id = Column(Integer, default=1, nullable=False)
    clsic_id = Column(Integer)
    ic_grabaiva= Column(Boolean, default=False)
    ic_grabaimpserv= Column(Boolean, default=False)
    ic_fechacrea = Column(TIMESTAMP, nullable=False, default=current_date)
    ic_usercrea = Column(Integer)
