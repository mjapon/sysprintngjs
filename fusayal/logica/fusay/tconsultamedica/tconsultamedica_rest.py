# coding: utf-8
"""
Fecha de creacion 5/24/20
@autor: mjapon
"""
import logging
from cornice.resource import resource

from fusayal.logica.excepciones.validacion import ErrorValidacionExc
from fusayal.logica.fusay.tconsultamedica.tconsultamedica_dao import TConsultaMedicaDao
from fusayal.utils.pyramidutil import TokenView

log = logging.getLogger(__name__)


@resource(collection_path='/api/tconsultam', path='/api/tconsultam/{cosm_id}', cors_origins=('*',))
class TConsultaMedicaRest(TokenView):

    def collection_get(self):
        accion = self.get_request_param('accion')
        tconsultam_dao = TConsultaMedicaDao(self.dbsession)
        if accion == 'form':
            form = tconsultam_dao.get_form()
            return {'status': 200, 'form': form}

        elif accion == 'cie10data':
            cie10data = tconsultam_dao.get_cie10data()
            return {'status': 200, 'cie10data': cie10data}

        elif accion == 'listaatenciones':
            ciruc = self.get_request_param('ciruc')
            items = tconsultam_dao.get_historia_porpaciente(per_ciruc=ciruc)
            antecedespers = tconsultam_dao.get_antecedentes_personales(per_ciruc=ciruc)
            return {'status': 200, 'items': items, 'antpers': antecedespers}

        elif accion == 'findhistbycod':
            codhistoria = self.get_request_param('codhistoria')
            datoshistoria = tconsultam_dao.get_datos_historia(cosm_id=codhistoria)
            return {'status': 200, 'datoshistoria': datoshistoria}

    def collection_post(self):
        accion = self.get_request_param('accion')
        if 'registra' == accion:
            tconsultam_dao = TConsultaMedicaDao(self.dbsession)
            formdata = self.get_request_json_body()
            msg, cosm_id = tconsultam_dao.registrar(form=formdata, usercrea=self.get_user_id())
            return {'status': 200, 'msg': msg, 'ccm':cosm_id}
        else:
            raise ErrorValidacionExc(u'Ninguna acción especificada')
