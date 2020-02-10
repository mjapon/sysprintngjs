# coding: utf-8
"""
Fecha de creacion 02/01/2020
@autor: mejg231019
"""
import logging

from cornice.resource import resource

from fusayal.logica.fusay.tfuser.tfuser_dao import TFuserDao
from fusayal.utils import cadenas
from fusayal.utils.pyramidutil import FusayPublicView

log = logging.getLogger(__name__)


@resource(collection_path='/api/tfuser', path='/api/tfuser/{us_id}', cors_origins=('*',))
class TFuserRest(FusayPublicView):

    def collection_post(self):
        log.info('TFuserRest------------>')
        log.info('collection_post------------>')
        accion = self.get_request_param('accion')
        if accion == 'auth':
            form = self.get_request_json_body()
            fuserdao = TFuserDao(self.dbsession)
            autenticado = fuserdao.autenticar(us_cuenta=cadenas.strip(form['username']),
                                              us_clave=cadenas.strip(form['password']))
            if autenticado:
                user = fuserdao.get_user(us_cuenta=cadenas.strip(form['username']))
                return {'autenticado': autenticado,
                        'userinfo': user}
            else:
                return {'autenticado': autenticado}
