# coding: utf-8
"""
Created on '29/07/15'
@author: 'Manuel'
"""
import logging

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