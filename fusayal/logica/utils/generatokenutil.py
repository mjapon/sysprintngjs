# coding: utf-8
"""
Fecha de creacion '16/02/16'
@autor: 'serviestudios'
"""
import logging

import jwt
import simplejson
"""
from jwcrypto.jwt import JWT
from jwcrypto import jwt, jwk
"""

log = logging.getLogger(__name__)

#GLOBAL_KEY = jwk.JWK(generate='oct', size=256)

class GeneraTokenUtil(object):

    def get_token(self, clave='sosecret'):
        return jwt.encode({'some': 'payload'}, clave, algorithm='HS256')

    def gen_token(self, us_id, emp_codigo, emp_esquema, sec_id, clave="fusay4793"):

        data = {'us_id': us_id, 'emp_codigo': emp_codigo, 'emp_esquema': emp_esquema, 'sec_id': sec_id}
        encoded_jwt = jwt.encode(data, clave, algorithm='HS256')
        return encoded_jwt


        """
        data = {'us_id': us_id, 'emp_codigo': emp_codigo, 'emp_esquema': emp_esquema, 'sec_id':sec_id}
        Token = jwt.JWT(header={"alg": "HS256"},
                        claims=data)
        Token.make_signed_token(GLOBAL_KEY)

        return Token.serialize()
        """

    def update_secid_token(self, token, sec_id):
        datos_token = self.get_datos_fromtoken(token)
        return self.gen_token(datos_token['us_id'], datos_token['emp_codigo'],
                              datos_token['emp_esquema'], sec_id, clave="fusay4793")

    def get_datos_fromtoken(self, token, clave="fusay4793"):
        decoded_value = jwt.decode(token, clave, algorithms=['HS256'])
        return decoded_value

        """
        ET = jwt.JWT(key=GLOBAL_KEY, jwt=token)
        claim = ET.claims        
        return  simplejson.loads(claim)
        """


if __name__ == '__main__':

    clave = "MANUELJAPON123"
    encoded_jwt = jwt.encode({'some': 'payload'}, clave, algorithm='HS256')

    print 'Encoded jwt'
    print encoded_jwt

    decoded_value = jwt.decode(encoded_jwt, clave, algorithms=['HS256'])

    print 'decoded jwt'
    print decoded_value
    print type(decoded_value)

    """
    key = jwk.JWK(generate='oct', size=256)
    Token = jwt.JWT(header={"alg": "HS256"},
                    claims={"info": "I'm a signed token"})

    Token.make_signed_token(GLOBAL_KEY)

    token = Token.serialize()
    print token

    key2 = jwk.JWK(generate='oct', size=256)

    ET = jwt.JWT(key=GLOBAL_KEY, jwt=token)
    claim = ET.claims
    print claim
    """

    #ST = jwt.JWT(key=key, jwt=ET.claims)
