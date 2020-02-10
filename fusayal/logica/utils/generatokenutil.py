# coding: utf-8
"""
Fecha de creacion '16/02/16'
@autor: 'serviestudios'
"""
import logging

from jwcrypto import jwt

log = logging.getLogger(__name__)


class GeneraTokenUtil(object):

    def get_token(self, clave='sosecret'):

        return jwt.encode({'some': 'payload'}, clave, algorithm='HS256')




