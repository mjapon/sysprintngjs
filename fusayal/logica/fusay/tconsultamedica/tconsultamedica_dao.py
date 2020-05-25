# coding: utf-8
"""
Fecha de creacion 5/23/20
@autor: mjapon
"""
import logging

from fusayal.logica.dao.base import BaseDao

log = logging.getLogger(__name__)


class TConsultaMedicaDao(BaseDao):

    def get_form(self):
        form_antecedentes = self.get_form_valores(1)
        form_examsfisicos = self.get_form_valores(2)
        form_examdiagnostico = self.get_form_valores(3)
        form_revxsistemas = self.get_form_valores(4)

        return {
            'per_id': 0,
            'per_ciruc': '',
            'per_nombres': '',
            'per_apellidos': '',
            'per_direccion': '',
            'per_telf': '',
            'per_movil': '',
            'per_email': '',
            'per_fecreg': '',
            'per_tipo': 1,
            'per_lugnac': 0,
            'per_nota': '',
            'per_fechanac': '',
            'per_genero': 0,
            'per_estadocivil': 1,
            'per_lugresidencia': 0,

            'cosm_id': 0,
            'pac_id': 0,
            'med_id': 0,
            'cosm_fechacita': '',
            'cosm_fechacrea': '',
            'cosm_motivo': '',
            'cosm_enfermactual': '',
            'cosm_hallazgoexamfis': '',
            'cosm_exmscompl': '',
            'cosm_tratamiento': '',
            'cosm_receta': '',
            'cosm_recomendaciones': '',
            'user_crea': '',

            'antecedentes': form_antecedentes,
            'examsfisicos': form_examsfisicos,
            'revxsistemas': form_revxsistemas,
            'diagnostico': form_examdiagnostico
        }

    def get_form_valores(self, catc_id):
        """
        Retorna array de valores para las categorias
        :param catc_id:
        :return:
        """

        sql = u"""        
        select cmtv_id, cmtv_cat, cmtv_nombre, cmtv_valor, '' as valorreg from tconsultam_tiposval
            where cmtv_cat = {0}         
        """.format(catc_id)

        tupla_desc = ('cmtv_id', 'cmtv_cat', 'cmtv_nombre', 'cmtv_valor', 'valorreg')

        return self.all(sql, tupla_desc)

    def get_cie10data(self):
        sql = u"select cie_id, cie_key, cie_valor from tcie10 order by cie_key"
        tupla_desc = ('cie_id', 'cie_key', 'cie_valor')

        return self.all(sql, tupla_desc)
