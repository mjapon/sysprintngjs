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
        form = self.get_request_json_body()

        accion = self.get_request_param('accion')
        if accion == 'updatecita':
            form = self.get_json_body()
            cita_id = form['cita_id']
            obs = form['obs']
            estado = form['estado']
            userpacdao = TUserPacienteDao(self.dbsession)
            userpacdao.cambiar_estado_cita(cita_id=cita_id,estado=estado,observacion=obs)
            return {'status': 200, 'msg': u'Cambios registrados exitósamente'}
        else:
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
        else:
            return {'status': 404}
