# coding: utf-8
"""
Fecha de creacion '16/02/16'
@autor: 'serviestudios'
"""
import logging

from jwcrypto.jwt import JWT
from jwcrypto import jwt, jwk

log = logging.getLogger(__name__)


class GeneraTokenUtil(object):

    def get_token(self, clave='sosecret'):
        jwt = JWT()

        return jwt.encode({'some': 'payload'}, clave, algorithm='HS256')

    def gen_token(self, us_id, emp_codigo, emp_esquema, clave="fusay4793"):
        key = jwk.JWK(generate='oct', size=256)
        data = {'us_id': us_id, 'emp_codigo': emp_codigo, 'emp_esquema': emp_esquema}
        Token = jwt.JWT(header={"alg": "HS256"},
                        claims=data)
        Token.make_signed_token(key)

        return Token.serialize()

    def get_datos_fromtoken(self, token, clave="fusay4793"):
        key = jwk.JWK(generate='oct', size=256)

        ET = jwt.JWT(key=key, jwt=token)
        claim = ET.claims

        return claim


"""
if __name__ == '__main__':
    key = jwk.JWK(generate='oct', size=256)
    Token = jwt.JWT(header={"alg": "HS256"},
                    claims={"info": "I'm a signed token"})

    Token.make_signed_token(key)

    token = Token.serialize()
    print token

    ET = jwt.JWT(key=key, jwt=token)
    claim = ET.claims
    print claim

    #ST = jwt.JWT(key=key, jwt=ET.claims)
"""
