# coding: utf-8
"""
Fecha de creacion 2/15/20
@autor: mjapon
"""
import logging
from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy
from sqlalchemy import Column, Integer, String, TIMESTAMP, Text, Numeric, Date, Boolean, DATETIME

log = logging.getLogger(__name__)


class TDatosProducto(Declarative, JsonAlchemy):
    __tablename__ = 'tdatosproducto'

    dprod_id = Column(Integer, nullable=False, primary_key=True, autoincrement=True)
    ic_id = Column(Integer,nullable=False)
    dprod_grabaiva = Column(Boolean, default=False, nullable=False)
    dprod_grabaimpserv = Column(Boolean, default=False, nullable=False)
    dprod_preciocompra = Column(Numeric(15,5), default=0.0, nullable=False)
    dprod_precioventa = Column(Numeric(15,5), default=0.0, nullable=False)
    dprod_existencias = Column(Integer, default=0, nullable=False)
    dprod_fechacaducidad = Column(Date)
    dprod_proveedor = Column(Integer, default=-2, nullable=False)


    """
    dprod_idw             serial                       not null        
    ic_id                integer                      not null        
    dprod_grabaiva       boolean        default false not null,
    dprod_grabaimpserv   boolean        default false not null,
    dprod_preciocompra   numeric(15, 5) default 0.0   not null,
    dprod_precioventa    numeric(15, 5) default 0.0   not null,
    dprod_existencias    integer        default 0     not null,
    dprod_fechacaducidad date,
    dprod_proveedor      integer
    """

