# coding: utf-8
"""
Fecha de creacion '16/02/16'
@autor: 'serviestudios'
"""
import logging

from cornice.resource import resource
from fusayal.logica.smartsys.SSEmpresa.ssempresa_model import SSEmpresa
from fusayal.logica.users.users_dao import TUsersDao
from fusayal.logica.utils.generatokenutil import GeneraTokenUtil
from fusayal.utils.pyramidutil import DbComunView

log = logging.getLogger(__name__)


@resource(collection_path="/api/auth/movils", path="/api/auth/movil")
class AuthTokenView(DbComunView):
    def post(self):
        jsonbody = self.request.json_body
        emp_coding = jsonbody['empresa']
        cla_id = jsonbody['usuario']
        cla_clave = jsonbody['clave']
        log.info(emp_coding)
        log.info(cla_id)

        #Proceder con la autenticacion
        ssempresa = self.dbsession.query(SSEmpresa).filter(SSEmpresa.temp_code==emp_coding).first()

        if ssempresa is not None:
            #Carga en redis datos de empresa
            #claredis_emp = "ee:{0}".format(tempresa.emp_codigo)
            #self.redis.hset(claredis_emp, "info", self.json(tempresa))

            #ir a la base local y verificar usuario
            usersdao = TUsersDao(self.dbsession)

            self.change_dbschema(emp_esquema=ssempresa.temp_esquema)

            autenticado = usersdao.autenticar(cla_id, cla_clave)

            if autenticado is not None and autenticado:
                #Autenticado
                token = GeneraTokenUtil().get_token()
                tuser = usersdao.get_user(username=cla_id)

                return {'estado':200,
                        'token':token,
                        'emp_codigo': ssempresa.temp_id,
                        'emp_esquema': ssempresa.temp_esquema,
                        'user_id':  tuser.us_id}
            else:
                return {'estado':400,
                        'msg':'Login Fallido'}
        else:
            return {'estado':400,
                   'msg':'No existe empresa con el codigo ingresado'}
