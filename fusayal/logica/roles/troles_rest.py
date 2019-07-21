# coding: utf-8
"""
Fecha de creacion 3/24/19
@autor: mjapon
"""
import logging

from fusayal.logica.roles.tuserrol_dao import TUserRolDao
from fusayal.logica.users.users_dao import TUsersDao
from fusayal.utils.pyramidutil import DbComunView
from cornice.resource import resource

log = logging.getLogger(__name__)


@resource(path="/rest/userroles/{us_id}", collection_path="/rest/userroles")
class RolesUsuarioRest(DbComunView):

    def get(self):
        us_id = self.request.matchdict['us_id']

        tuserroldao = TUserRolDao(self.dbsession)
        accion = self.get_request_param('accion')
        if accion is not None and accion == 'getrolesu':
            roles_user = tuserroldao.get_roles_json(us_id=us_id)
            tuserdao = TUsersDao(self.dbsession)
            userinfo = tuserdao.find_byid(id_user=us_id)
            return {'estado':200, 'roles':roles_user, 'tuser':userinfo}

        matrizroles = tuserroldao.get_matriz_roles(us_id=us_id)

        return {'estado': 200, 'matriz': matrizroles}

    def post(self):
        us_id = self.request.matchdict['us_id']
        data = self.get_json_body()
        tuserroldao = TUserRolDao(self.dbsession)
        tuserroldao.asociar(us_id=us_id, roles_list=data.get('matriz'))
        msg = 'Operacion Exitosa'
        return {'estado': 200, 'msg': msg}
