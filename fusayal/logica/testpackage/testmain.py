# coding: utf-8
"""
Fecha de creacion 8/26/19
@autor: mjapon
"""
import logging
import re

log = logging.getLogger(__name__)


def es_correo_valido(correo):
    expresion_regular = r"(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])"
    return re.match(expresion_regular, correo) is not None


correos = [
    "hola@", "contacto@parzibyte.me", "staff@hotmail.com",
    "juan.perez@sitio.com", "maggie@outlook.com", "parzibyte@gmail.com", "asd",
    "luis@gmail@hotmail.com"
]

if __name__ == '__main__':

    for correo in correos:
        print("Probando si '{}' es válido...{}".format(correo,
                                                       es_correo_valido(correo)))

