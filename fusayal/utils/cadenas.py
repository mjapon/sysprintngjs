# coding: utf-8
"""
Created on '29/07/15'
@author: 'Manuel'
"""
import logging
import re

log = logging.getLogger(__name__)

def quitar_tildes_enies(cad):
    return cad.replace(u"á","a").replace(u"é","e").replace(u"í","i").replace(u"ó","o").replace(u"ú","u")\
    .replace(u"Á","A").replace(u"É","E").replace(u"Í","I").replace(u"Ó","O").replace(u"Ú","U")\
    .replace(u"ñ","n").replace(u"Ñ","N")


def quitarCarEspe(cad):#permite solo caracteres alfanumericos y espacios
    cad= quitar_tildes_enies(cad)
    for letra in cad:
        if (not letra.isalnum()) and letra != " ":
            cad = cad.replace(letra,'')
    return cad


def es_nonulo_novacio(cadena):
    return cadena is not None and len(unicode(cadena).strip()) > 0


def strip(cadena):
    return cadena.strip() if cadena is not None else None

def strip_upper(cadena):
    return cadena.strip().upper() if cadena is not None else ''

def replace_amp(cad):
    return unicode(cad).replace("&","&amp;")

def clean_for_rentas(cad):
    return quitar_carac_especiales(replace_amp(cad))

def quitar_carac_especiales(cad):
    return unicode(cad).replace("/","").replace("<","").replace(">","").replace("-","").replace("\n"," ")

def getAbecedario():
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
           'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
           'U', 'V', 'W', 'X', 'Y', 'Z']

def getPosicionEnAbecedario(letra):
    letra = letra.upper()
    abc = getAbecedario()
    return abc.index(letra)


def parse_float(cadena, default=None):
    if cadena is None:
        return default

    if len(unicode(cadena))>0:
        return float(cadena)
    else:
        return default

def es_correo_valido(correo):
    expresion_regular = r"(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])"
    return re.match(expresion_regular, correo) is not None