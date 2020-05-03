# coding: utf-8
"""
Fecha de creacion 4/25/20
@autor: mjapon
"""
import logging

from fusayal.logica.fusay.tuserpaciente.tuserpaciente_dao import TUserPacienteDao
from fusayal.utils import fechas
from fusayal.utils.pyramidutil import FusayPublicView
from cornice.resource import resource

log = logging.getLogger(__name__)


@resource(collection_path="/api/public/tpacienteuser", path="/api/public/tpacienteuser/{up_id}", cors_origins=('*',))
class TUserPacienteRest(FusayPublicView):

    def post(self):

        accion = self.get_request_param('accion')
        if accion == 'updatecita':
            form = self.get_json_body()
            cita_id = form['cita_id']
            obs = form['obs']
            estado = form['estado']
            userpacdao = TUserPacienteDao(self.dbsession)
            userpacdao.cambiar_estado_cita(cita_id=cita_id, estado=estado, observacion=obs)
            return {'status': 200, 'msg': u'Cambios registrados exitósamente'}
        elif accion == 'autenticar':
            userpacdao = TUserPacienteDao(self.dbsession)
            form = self.get_json_body()
            result = userpacdao.autenticar(form)
            email = form['email']
            datosuser = userpacdao.get_datos_cuenta(email)
            return {'status': 200, 'autenticado': result, 'datosuser': datosuser}
        elif accion == 'updateFromSocial':
            userpacdao = TUserPacienteDao(self.dbsession)
            form = self.get_request_json_body()
            userpacdao.crea_actualiza_cuenta(form)
            return {'status': 200, 'msg': 'Registrado/Actualizado exitosamente'}
        elif accion == 'creacuenta':
            userpacdao = TUserPacienteDao(self.dbsession)
            form = self.get_request_json_body()
            userpacdao.crear_cuenta(form)
            return {'status': 200, 'msg': 'Registrada exitosamente'}
        else:
            form = self.get_request_json_body()
            userpacdao = TUserPacienteDao(self.dbsession)
            userpacdao.crear(form)
            return {'status': 200, 'msg': u'Registrado existosamente'}

    def collection_get(self):
        accion = self.get_request_param('accion')
        if accion == 'horarios':
            med_id = self.get_request_param('med_id')
            serv_id = self.get_request_param('serv_id')
            dia = fechas.get_str_fecha_actual()
            userpacdao = TUserPacienteDao(self.dbsession)
            res = userpacdao.buscar_citas(med_id=med_id, serv_id=serv_id, fecha_desde=dia)
            return {'status': 200, 'items': res}
        elif accion == 'matrizhoras':
            med_id = self.get_request_param('med_id')
            dia = self.get_request_param('dia')
            userpacdao = TUserPacienteDao(self.dbsession)
            matriz_horas = userpacdao.get_matriz_horas_medico(med_id=med_id, dia=dia)
            return {'status': 200, 'matriz': matriz_horas}
        elif accion == 'citasmedico':
            med_id = self.get_request_param('med_id')
            fecha = self.get_request_param('dia')
            userpacdao = TUserPacienteDao(self.dbsession)
            citas = userpacdao.listar_citas(med_id=med_id, fecha_desde=fecha)
            return {'status': 200, 'citas': citas}
        elif accion == 'getdatauser':
            email = self.get_request_param('email')
            userpacdao = TUserPacienteDao(self.dbsession)
            datosuser = userpacdao.get_datos_cuenta(email)
            existe = True if datosuser is not None else False
            return {'status': 200, 'datosuser': datosuser, 'existe': existe}
        elif accion == 'citaspaciente':
            email = self.get_request_param('email')
            userpacdao = TUserPacienteDao(self.dbsession)
            citaspac = userpacdao.listar_citas_paciente(up_email=email)
            return {'status': 200, 'citaspac': citaspac}
        else:
            return {'status': 404}
