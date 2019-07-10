# coding: utf-8
"""
Fecha de creacion 25/8/18
@autor: mjapon
"""
from fusayal.logica.dao.base import BaseDao
from fusayal.logica.socios.socios_model import TSocios
from fusayal.logica.usuarios.usuarios_model import TUsuarios


class TUsuariosDao(BaseDao):

    def autenticar(self, nui, clave):
        """
        Autentica un usuario registrado
        :param socio_nui:
        :return:
        """
        sql = """
        select count(*) as cuenta from usuarios u
        join socios s ON u.sc_id = s.socio_id
        where s.socio_nui = '{0}'
        and u.us_clave = '{1}' 
        """.format(nui, clave)

        result = self.first_col(sql, "cuenta")

        return result > 0

    def cambiar_clave(self, nui, nuevaclave):
        tsocio = self.dbsession.query(TSocios).filter(TSocios.socio_nui == nui.strip()).first()
        if tsocio is not None:
            tusuario = self.dbsession.query(TUsuarios).filter(TUsuarios.sc_id == tsocio.socio_id).first()
            if tusuario is not None:
                tusuario.us_clave = nuevaclave
        else:
            raise Exception("El usuario no esta registrado")