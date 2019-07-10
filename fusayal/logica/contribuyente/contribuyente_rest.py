# coding: utf-8
"""
Fecha de creacion 3/25/19
@autor: mjapon
"""

from cornice.resource import resource

from fusayal.logica.contribuyente.contribuyente_dao import TContribuyenteDao
from fusayal.utils.pyramidutil import DbComunView


@resource(path="/rest/contribuyente/{cnt_id}", collection_path="/rest/contribuyente")
class ContribuyenteRest(DbComunView):

    def collection_get(self):
        contrib_dao = TContribuyenteDao(self.dbsession)
        contribs = contrib_dao.listar()
        cols = [{'prop': 'cnt_ruc', 'label': 'RUC'},
                {'prop': 'cnt_razonsocial', 'label': 'Razón social'},
                {'prop': 'cnt_telf', 'label': 'Telf.'},
                {'prop': 'cnt_email', 'label': 'Email'},
                {'prop': 'cls_nombre', 'label': 'Tipo'},
                {'prop': 'cnt_nrocntespecial', 'label': 'Cont. Especial'},
                {'prop': 'ocontab', 'label': 'Obl contab.'}]

        accion = None
        if 'accion' in self.request.params:
            accion = self.request.params['accion']
            if accion == 'find':
                ruc = self.request.params['ruc']
                contrib = contrib_dao.find_by_ruc(ruc)
                if contrib is None:
                    return {'estado': 404}
                else:
                    return {'estado': 200, 'contrib': contrib}

        return {'estado': 200, 'items': contribs, 'cols': cols}

    def get(self):
        contrib_dao = TContribuyenteDao(self.dbsession)
        accion = self.get_request_param('accion')
        cnt_id = self.get_request_matchdict('cnt_id')
        if accion is not None:
            if accion == 'form':
                form = contrib_dao.get_form()
                tipos_contrib = contrib_dao.get_tipos_contribuyentes()
                if int(cnt_id) != 0:
                    form = contrib_dao.get_form_edit(cnt_id=cnt_id)

                return {'estado': 200,
                        'form': form,
                        'tiposcontrib': tipos_contrib}

    def post(self):
        contrib_dao = TContribuyenteDao(self.dbsession)
        cnt_id = self.get_request_matchdict('cnt_id')
        msg = 'Operación exitosa'
        if int(cnt_id) == 0:
            cnt_id = contrib_dao.crear(form=self.get_json_body(), user_crea=self.get_userid())
            return {'estado': 200, 'msg': msg, 'cnt_id': cnt_id}
        else:
            cnt_id = contrib_dao.editar(form=self.get_json_body(), user_edit=self.get_userid())
            return {'estado': 200, 'msg': msg, 'cnt_id': cnt_id}
