# coding: utf-8
"""
Fecha de creacion 25/8/18
@autor: mjapon
"""

from fusayal.models.conf import Declarative
from fusayal.utils.jsonutil import JsonAlchemy
from sqlalchemy import Column, BLOB, Boolean, DateTime, Integer, String, Text
from sqlalchemy import Numeric


class TCuotas(Declarative, JsonAlchemy):
    __tablename__ = 'cuotas'

    """
    cuot_id         SERIAL                     NOT NULL
    sc_id           INTEGER                    NOT NULL
    cuot_mes        INTEGER                    NOT NULL,
    cuot_monto      NUMERIC(15, 4) DEFAULT 0.0 NOT NULL,
    sc_id_reg_cuota INTEGER                    NOT NULL
    cuot_compro     TEXT,
    cuot_estado     INTEGER DEFAULT 0          NOT NULL,
    cuot_fecreg     TIMESTAMP,
    cuot_tipo       INTEGER DEFAULT 0
    
    """
    cuot_id = Column(Integer, nullable=False, primary_key=True)
    sc_id = Column(Integer, nullable=False)
    cuot_mes = Column(Integer, nullable=False)
    cuot_monto = Column(Numeric(15, 4))
    sc_id_reg_cuota = Column(Integer, nullable=False)
    cuot_compro = Column(Text)
    cuot_estado = Column(Integer, default=0, nullable=False)
    cuot_fecreg = Column(DateTime)
    cuot_tipo = Column(Integer)  # 0:mensual,1:niños,2:paseo
    cuot_anio = Column(Integer, nullable=False)
    cuot_obs = Column(Text)


class ReportRequest(Declarative, JsonAlchemy):
    __tablename__ = 'report_request'

    id = Column(Integer, primary_key=True)
    key = Column(String(36), nullable=False)
    report_definition = Column(Text, nullable=False)
    data = Column(Text, nullable=False),
    is_test_data = Column(Boolean, nullable=False)
    pdf_file = Column(BLOB)
    pdf_file_size = Column(Integer),
    created_on = Column(DateTime, nullable=False)
