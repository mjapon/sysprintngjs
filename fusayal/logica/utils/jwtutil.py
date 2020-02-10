# coding: utf-8
"""
Fecha de creacion 10/12/19
@autor: mjapon
"""
import logging

log = logging.getLogger(__name__)


def get_token(username, password):
    """
    Genera un token para ser usado en un servicio web tipo rest
    :param username:
    :param password:
    :return:
    """
    jsondata = {'username': 'username', 'emp_codgo': 2}
