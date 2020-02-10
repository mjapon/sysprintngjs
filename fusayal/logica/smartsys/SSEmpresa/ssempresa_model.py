# coding: utf-8
"""
Fecha de creacion 10/12/19
@autor: mjapon
"""
import logging

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy
from sqlalchemy import Column, Integer, String

log = logging.getLogger(__name__)


class SSEmpresa(Declarative, JsonAlchemy):
    __tablename__ = 'sfempresa'

    """
    temp_id              serial            not null    
    temp_code            varchar(20)       not null,
    temp_ruc             varchar(13)       not null,
    temp_esquema         varchar(10)       not null,
    temp_razonsocial     varchar(80)       not null,
    temp_nombrecomercial varchar(80),
    temp_telf            varchar(40),
    temp_email           varchar(40),
    temp_dirmatriz       varchar(100)      not null,
    temp_oblcontab       integer default 0 not null    
    """

    temp_id = Column(Integer, nullable=False, primary_key=True)
    temp_code = Column(String(20), nullable=False)
    temp_ruc = Column(String(13), nullable=False)
    temp_esquema = Column(String(10), nullable=False)
    temp_razonsocial = Column(String(80), nullable=False)
    temp_nombrecomercial = Column(String(80))
    temp_telf = Column(String(40))
    temp_email = Column(String(40))
    temp_dirmatriz = Column(String(100), nullable=False)
    temp_oblcontab = Column(Integer, nullable=False, default=0)
