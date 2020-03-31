# coding: utf-8
"""
Fecha de creacion 3/22/20
@autor: mjapon
"""
import logging
from decimal import Decimal

from fusayal.utils import ctes

log = logging.getLogger(__name__)


def quitar_iva(precio):
    if precio is not None:
        return Decimal(precio) / Decimal(1 + ctes.IVA)
    return None


def poner_iva(precio):
    if precio is not None:
        return Decimal(precio) * Decimal(1 + ctes.IVA)
    return None


def redondear(cantidad, ndecimales):
    if cantidad is not None:
        return round(cantidad, ndecimales)
    return None


def redondear_precio(precio):
    return redondear(precio, ctes.NDECIMALESPRECIOS_VIEW)


def redondear_precio_db(precio):
    return redondear(precio, ctes.NDECIMALESPRECIOS_DB)
