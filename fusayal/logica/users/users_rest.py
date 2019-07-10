# coding: utf-8
"""
Fecha de creacion 3/19/19
@autor: mjapon
"""
import logging

from cornice.resource import resource
from fusayal.logica.users.users_dao import TUsersDao
from fusayal.utils.pyramidutil import DbComunView

log = logging.getLogger(__name__)


@resource(path="/rest/usuarios/{id_user}", collection_path="/rest/usuarios")
class UsuariosRest(DbComunView):

    def collection_post(self):
        # Se usa post para autenticacion
        accion = None
        if 'accion' in self.request.params:
            accion = self.get_request_param('accion')

        usersdao = TUsersDao(self.dbsession)
        if accion is None:
            form = self.get_json_body()
            result = usersdao.autenticar(form.get('usuario'), form.get('clave'))
            mensaje = 'Acceso exitoso'
            if not result:
                mensaje = "Acceso fallido"
            else:
                self.psession("userlogged", 1)

            return {'estado': 200, 'resultado': result, 'msg': mensaje}
        else:
            return {'estado': 200, 'msg': 'Ninguna accion se ha realizado'}

    def collection_get(self):

        accion = self.get_request_param("accion")
        if accion is not None:
            log.info("accion is not none:{0}".format(accion))
        else:
            log.info("accion is none")

        if accion == 'chkstatus':
            logged = 0
            if 'userlogged' in self.request.session:
                log.info("!!!usserlogged in session")
                logged = 1
            else:
                log.info(":-( userlogged is not in session")

            return {'estado': 200, 'userloged': logged}

        elif accion == 'listar':
            usersdao = TUsersDao(self.dbsession)
            result = usersdao.listar()
            # 'us_id', 'us_name', 'us_nomapel', 'us_datecreated', 'estado'
            cols = [{'name': 'us_name', 'displayName': 'Usuario', 'width': '90'},
                    {'name': 'us_nomapel', 'displayName': 'Nombres y apellidos', 'width': '200'},
                    {'name': 'us_datecreated', 'displayName': 'Fecha de registro', 'width': '180'},
                    {'name': 'estado', 'displayName': 'Estado', 'width': '150'}]

            return {'estado': 200, 'items': result, 'cols': cols}

        elif accion == 'form':
            form = {
                'us_id': 0,
                'us_nomapel': '',
                'us_name': '',
                'claveTemp': '',
                'confClaveTemp': ''
            }

            return {'estado': 200, 'form': form}

        elif accion == 'tclave':
            # Accion para verificar si el usuario ingresado tiene una clave temporal

            return {}

        return {'estado': 200, 'resultado': 1}

    def get(self):
        id_user = self.request.matchdict['id_user']
        log.info("valor para id_user es--->" + id_user)
        usersdao = TUsersDao(self.dbsession)
        user = usersdao.find_byid(id_user=id_user)
        return {'estado': 200, 'user': user}

    def post(self):
        log.info("Entra en entity post")
        id_user = self.request.matchdict['id_user']
        log.info("id user es:")
        log.info(id_user)

        usersdao = TUsersDao(self.dbsession)
        form = self.get_json_body()
        if int(id_user) == 0:
            # Entra en la logica para la creacion del registro
            usersdao.crear_usuario(
                user_name=form.get('us_name'),
                nomapel=form.get('us_nomapel'),
                password=form.get('claveTemp'),
                rpassword=form.get('confClaveTemp'),
                roles=form.get('roles'),
                user_crea=self.get_userid()
            )
            return {'estado': 200, 'msg': 'Registro exitoso'}
        else:
            accion = self.get_request_param("accion")
            if accion is None:
                accion = 'edicion'
            if accion == 'edicion':
                usersdao.update_nomapel(id_user=id_user,
                                        nomapel=form['us_nomapel'],
                                        user_name=form['us_name'],
                                        roles=form.get('roles'),
                                        user_edit=self.get_userid())
                return {'estado': 200, 'msg': 'Actualización satisfactoria'}

            elif accion == 'resetclave':
                usersdao.resetPassword(id_user=id_user,
                                       password=form.get('claveTemp'),
                                       rpassword=form.get('confClaveTemp'),
                                       user_edit=self.get_userid())
                return {'estado': 200, 'msg': 'La clave ha sido reseteada'}
            elif accion == 'cestado':
                msg = usersdao.cambiarEstado(id_user=id_user, user_edit=self.get_userid())
                return {'estado': 200, 'msg': msg}

            log.info("No se ejecuta ninguna accion")
