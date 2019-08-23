# coding: utf-8
"""
Fecha de creacion 3/24/19
@autor: mjapon
"""
from fusayal.logica.auditorias.taudit_dao import TAuditDao
from fusayal.logica.dao.base import BaseDao
from fusayal.logica.roles.tuserrol_model import TUserRol
from fusayal.logica.utils import enums


class TUserRolDao(BaseDao):

    def listar_roles(self):
        sql = """
        select rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo
            from trol order by rl_grupo, rl_name
        """
        tupla_desc = ("rl_id", "rl_name", "rl_desc", "rl_abreviacion", "rl_grupo")
        return self.all(sql, tupla_desc)

    def listar_for_user(self, us_id):
        """
        Retorna los roles que tiene un usuario en la actualidad
        :param us_id:
        :return:
        """
        sql = """
        select t.rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo
            from trol join tuserrol t ON trol.rl_id = t.rl_id and t.us_id = {0} order by rl_grupo, rl_name            
        """.format(us_id)

        tupla_desc = ('rl_id', 'rl_name', 'rl_desc', 'rl_abreviacion', 'rl_grupo')
        return self.all(sql, tupla_desc)

    def get_new_rowrol(self, us_id, marcado, rl_id, rl_name, rl_desc, rl_abreviacion, rl_grupo):
        newrowl = {
            'us_id': us_id,
            'marcado': marcado,
            'rl_id': rl_id,
            'rl_name': rl_name,
            'rl_desc': rl_desc,
            'rl_abreviacion': rl_abreviacion,
            'rl_grupo': rl_grupo
        }

        return newrowl

    def get_matriz_roles(self, us_id):
        """
        construye una matriz de roles
        :param us_id:
        :return:
        """
        user_roles = self.listar_for_user(us_id)
        all_roles = self.listar_roles()
        mapuserroles = {}
        if user_roles is not None:
            for usrol in user_roles:
                mapuserroles[usrol['rl_id']] = usrol

        matrizroles = []

        for item in all_roles:
            marcado = 1 if item['rl_id'] in mapuserroles else 0
            rowrol = self.get_new_rowrol(us_id=us_id, marcado=marcado,
                                         rl_id=item['rl_id'],
                                         rl_name=item['rl_name'],
                                         rl_desc=item['rl_desc'],
                                         rl_abreviacion=item['rl_abreviacion'],
                                         rl_grupo=item['rl_grupo'])
            matrizroles.append(rowrol)

        return matrizroles

    def get_roles_json(self, us_id):
        """
        Retorna el listado de roles de un usuario de la forma: {CREATEUSER:{}, EDITUSER:{},RESETCLAVE:{}}
        :param us_id:
        :return:
        """

        user_roles = self.listar_for_user(us_id)
        return user_roles
        """
        mapuserroles = {}
        if user_roles is not None:
            for usrol in user_roles:
                mapuserroles[usrol['rl_abreviacion']] = usrol
        """

    def asociar(self, us_id, roles_list, user_crea):
        """
        Asocia los registros de
        :param us_id:
        :param roles_list:
        :return:
        """
        current_list = self.dbsession.query(TUserRol).filter(TUserRol.us_id == us_id).all()
        tautditdao = TAuditDao(self.dbsession)

        """
        if current_list is not None and len(current_list) > 0:
            for item in current_list:
                tautditdao.crea_accion_delete(enums.TBL_USER_ROLES, '',user_crea, '','', item.rl_id)
                self.dbsession.delete(item)
        """

        # Se registran los nuevos roles enviados
        for item in roles_list:
            if item.get('marcado') == 1:
                tuserrol = TUserRol()
                tuserrol.us_id = us_id,
                tuserrol.rl_id = item.get('rl_id')
                self.dbsession.add(tuserrol)
                self.dbsession.flush()
                tautditdao.crea_accion_insert(enums.TBL_USER_ROLES, user_crea, tuserrol.usrl_id)