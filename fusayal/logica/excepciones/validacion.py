# -*- coding:UTF-8 -*-
"""
Created on '04/12/2014'
@author: 'Manuel'
"""
import logging

log = logging.getLogger(__name__)


class ErrorValidacionExc(Exception):
    """Excepcion generadad cuando se produce un error de validadicon"""
    def __init__(self, message, inputid=""):
        Exception.__init__(self, message)
        self.inputid=inputid


class SinDetallesExc(Exception):
    def __init__(self, message, inputid=""):
        Exception.__init__(self, message)
        self.inputid=inputid
        self.codigo="SINDETEXC"


class SinPagosExc(Exception):
    def __init__(self, message, inputid=""):
        Exception.__init__(self, message)
        self.inputid=inputid
        self.codigo="SINPAGOSEXC"


class InfoValidacionExc(Exception):
     def __init__(self, message, header="", inputid=""):
        Exception.__init__(self, message)
        self.inputid=inputid
        self.icono = "fa fa-info-circle fa-3x"
        self.header = header


class BadRequestExc(Exception):
    def __init__(self, message):
        Exception.__init__(self, message)
        self.status_code = 400 #La petición está malformada


class UnauthorizedExc(Exception):
    def __init__(self, message):
        Exception.__init__(self, message)
        self.status_code = 401  #Cuando los detalles de autenticación son inválidos o no son otorgados


class ForbiddenExc(Exception):
    def __init__(self, message):
        Exception.__init__(self, message)
        self.status_code = 403  #Cuando la autenticación es exitosa pero el usuario no tiene permiso


class NotFoundExc(Exception):
    def __init__(self, message):
        Exception.__init__(self, message)
        self.status_code = 404  #Cuando un recurso no existente es solicitado


class MethodNotAllowedExc(Exception):
    def __init__(self, message):
        Exception.__init__(self, message)
        self.status_code = 405 #Cuando un método HTTP que está siendo pedido no está permitido para el usuario


class UnprocessableEntityExc(Exception):
    def __init__(self, message):
        Exception.__init__(self, message)
        self.status_code = 422 #Utilizada para errores de validación


class TooManyRequestsExc(Exception):
    def __init__(self, message):
        Exception.__init__(self, message)
        self.status_code = 429 #Utilizada para errores de validación


class PuntoNoAutorizadoExc(Exception):
    """Excepcion que indica que un punto de venta no esta autorizado para cierto documento"""
    def __init__(self, message, inputid=""):
        Exception.__init__(self, message)
        self.inputid = inputid


class AutorizacionInactivaExc(Exception):
    """Excepcion que indica que una autorizacion esta en estado inactiva"""
    def __init__(self, message, inputid=""):
        Exception.__init__(self, message)
        self.inputid = inputid


class AutorizacionExpiradaExc(Exception):
    """Excepcion que indica que una autorizacion esta expirada"""
    def __init__(self, message, inputid=""):
        Exception.__init__(self, message)
        self.inputid = inputid


class SecuenciaTerminadaExc(Exception):
    """Excepcion que indica que se ha alcanzado el maximo de secuencia de una autorizacion"""
    def __init__(self, message, inputid=""):
        Exception.__init__(self, message)
        self.inputid = inputid


class FechaMenorActualExc(Exception):
    def __init__(self, message, inputid=""):
        Exception.__init__(self, message)
        self.inputid=inputid


class FechasNoCoincidenExc(Exception):
    def __init__(self, message, inputid=""):
        Exception.__init__(self, message)
        self.inputid=inputid


class AcademicoExecption(Exception):
    def __init__(self, message, inputid=""):
        Exception.__init__(self, message)
        self.inputid=inputid


class TokenGmailExpException(Exception):
    def __init__(self, message, inputid=""):
        Exception.__init__(self, message)
        self.inputid=inputid


class CuentaGmailNoauthException(Exception):
    def __init__(self, message, inputid=""):
        Exception.__init__(self, message)
        self.inputid=inputid


class ImapLoginException(Exception):
    """
    Excepcion que se genera cuando se produce un error al tratar de establecer conexion con servidor imap
    """
    def __init__(self, message):
        Exception.__init__(self, message)


class ImapSelectFolderException(Exception):
    """
    Exception que se generar al seleccionar una carpeta de la cuenta de correo
    """
    def __init__(self, message):
        Exception.__init__(self, message)


class UninplementedExc(Exception):
    """
    Se usa para errores de codigo no implementado
    """
    def __init__(self, message):
        Exception.__init__(self, message)


class InfoExc(Exception):
    """
    Se usa para error que se muestran con sweetalert level:info
    """
    def __init__(self, message):
        Exception.__init__(self, message)
        self.error_code = 100
        self.status_code = 400 #Bad request


class WarningExc(Exception):
    """
    Se usa para error que se muestran con sweetalert level:warning
    """
    def __init__(self, message):
        Exception.__init__(self, message)
        self.error_code = 101
        self.status_code = 400 #Bad request


class ErrorExc(Exception):
    """
    Se usa para error que se muestran con sweetalert level:error
    """
    def __init__(self, message):
        Exception.__init__(self, message)
        self.error_code = 102
        self.status_code = 400 #Bad request