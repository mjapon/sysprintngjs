# coding: utf-8
"""
Fecha de creacion 02/01/2020
@autor: mejg231019
"""
import logging

from cornice.resource import resource

from fusayal.logica.empresa.empresa_dao import TEmpresaDao
from fusayal.logica.fusay.tfuser.tfuser_dao import TFuserDao
from fusayal.logica.tseccion.tseccion_dao import TSeccionDao
from fusayal.logica.utils.generatokenutil import GeneraTokenUtil
from fusayal.utils import cadenas
from fusayal.utils.pyramidutil import FusayPublicView, DbComunView

log = logging.getLogger(__name__)


@resource(collection_path='/api/tfuser', path='/api/tfuser/{us_id}', cors_origins=('*',))
class TFuserRest(DbComunView):

    def collection_post(self):
        log.info('TFuserRest------------>')
        log.info('collection_post------------>')
        accion = self.get_request_param('accion')
        if accion == 'auth':
            form = self.get_request_json_body()
            fuserdao = TFuserDao(self.dbsession)
            emp_codigo = cadenas.strip(form['empresa'])
            empresaDao = TEmpresaDao(self.dbsession)

            self.change_dbschema('public')
            empresa = empresaDao.buscar_por_codigo(emp_codigo=emp_codigo)
            if empresa is None:
                return {'status': 404,
                        'msg': 'Empresa no registrada'}
            else:
                emp_esquema = empresa['emp_esquema']
                self.change_dbschema(emp_esquema)
                autenticado = fuserdao.autenticar(us_cuenta=cadenas.strip(form['username']),
                                                  us_clave=cadenas.strip(form['password']))
                secciones = TSeccionDao(self.dbsession).listar()
                sec_id = secciones[0]['sec_id']

            if autenticado:
                user = fuserdao.get_user(us_cuenta=cadenas.strip(form['username']))
                genera_token_util = GeneraTokenUtil()
                token = genera_token_util.gen_token(us_id=user['us_id'], emp_codigo=empresa['emp_codigo'],
                                                    emp_esquema=empresa['emp_esquema'], sec_id=sec_id)
                return {'autenticado': autenticado,
                        'userinfo': user,
                        'seccion': secciones[0],
                        'token': token,
                        'menu': empresa['emp_menu']}
            else:
                return {'autenticado': autenticado}