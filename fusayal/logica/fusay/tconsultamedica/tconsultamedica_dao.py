# coding: utf-8
"""
Fecha de creacion 5/23/20
@autor: mjapon
"""
import logging
from datetime import datetime

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.fusay.tconsultamedica.tconsultamedica_model import TConsultaMedica, TConsultaMedicaValores
from fusayal.logica.fusay.tpersona.tpersona_dao import TPersonaDao
from fusayal.utils import fechas

log = logging.getLogger(__name__)


class TConsultaMedicaDao(BaseDao):

    def get_form(self):
        form_antecedentes = self.get_form_valores(1)
        form_revxsistemas = self.get_form_valores(2)
        form_examsfisicos = self.get_form_valores(3)
        form_examdiagnostico = self.get_form_valores(4)

        form_paciente = {
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
        }

        form_datosconsulta = {
            'cosm_id': 0,
            'pac_id': 0,
            'med_id': 0,
            'cosm_fechacita': fechas.get_str_fecha_actual(),
            'cosm_fechacrea': '',
            'cosm_motivo': '',
            'cosm_enfermactual': '',
            'cosm_hallazgoexamfis': '',
            'cosm_exmscompl': '',
            'cosm_tratamiento': '',
            'cosm_receta': '',
            'cosm_recomendaciones': '',
            'user_crea': '',
        }

        return {
            'paciente': form_paciente,
            'datosconsulta': form_datosconsulta,
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
        select cmtv_id, cmtv_cat, cmtv_nombre, cmtv_valor, '' as valorreg, cmtv_tinput from tconsultam_tiposval
            where cmtv_cat = {0} order by cmtv_id          
        """.format(catc_id)

        tupla_desc = ('cmtv_id', 'cmtv_cat', 'cmtv_nombre', 'cmtv_valor', 'valorreg', 'cmtv_tinput')

        return self.all(sql, tupla_desc)

    def get_cie10data(self):
        sql = u"select cie_id, cie_key, cie_valor, cie_key||'-'||cie_valor as ciekeyval  from tcie10 order by cie_key"
        tupla_desc = ('cie_id', 'cie_key', 'cie_valor', 'ciekeyval')

        return self.all(sql, tupla_desc)

    def registra_datosadc_consmedica(self, cosm_id, listadatosadc):
        for item in listadatosadc:
            codcat = item['cmtv_cat']
            valorpropiedad = item['valorreg']
            codtipo = item['cmtv_id']
            tconsultmvalores = TConsultaMedicaValores()
            tconsultmvalores.cosm_id = cosm_id
            tconsultmvalores.valcm_tipo = codtipo
            tconsultmvalores.valcm_valor = valorpropiedad
            tconsultmvalores.valcm_categ = codcat
            self.dbsession.add(tconsultmvalores)

    def registrar(self, form, usercrea):
        # 1 regstro de datos del paciente
        form_paciente = form['paciente']
        tpersonadao = TPersonaDao(self.dbsession)

        #Verificar si el paciente ya esta registrado:
        if tpersonadao.existe_ciruc(per_ciruc=form_paciente['per_ciruc']):
            per_id = form_paciente['per_id']
            tpersonadao.actualizar(per_id=per_id, form=form_paciente)
        else:
            per_id = tpersonadao.crear(form=form_paciente)

        # 2 registro de la cita medica
        datosconsulta = form['datosconsulta']

        tconsultamedica = TConsultaMedica()
        tconsultamedica.pac_id = per_id
        tconsultamedica.med_id = 0  # TODO: Se debe registrar tambien el codigo del medico al que se le va asignar la cita medica
        tconsultamedica.cosm_fechacita = fechas.parse_cadena(datosconsulta['cosm_fechacita'])
        tconsultamedica.cosm_fechacrea = datetime.now()
        tconsultamedica.cosm_motivo = datosconsulta['cosm_motivo']
        tconsultamedica.cosm_enfermactual = datosconsulta['cosm_enfermactual']
        tconsultamedica.cosm_hallazgoexamfis = datosconsulta['cosm_hallazgoexamfis']
        tconsultamedica.cosm_exmscompl = datosconsulta['cosm_exmscompl']
        tconsultamedica.cosm_tratamiento = datosconsulta['cosm_tratamiento']
        tconsultamedica.cosm_receta = datosconsulta['cosm_receta']
        tconsultamedica.cosm_recomendaciones = datosconsulta['cosm_recomendaciones']
        tconsultamedica.user_crea = usercrea
        self.dbsession.add(tconsultamedica)
        self.dbsession.flush()
        cosm_id = tconsultamedica.cosm_id

        # 3 Registro de antecendentes:
        # Esto se registra como lista de valores
        antecedentes = form['antecedentes']
        examsfisicos = form['examsfisicos']
        revxsistemas = form['revxsistemas']
        diagnostico = form['diagnostico']

        self.registra_datosadc_consmedica(cosm_id, antecedentes)
        self.registra_datosadc_consmedica(cosm_id, examsfisicos)
        self.registra_datosadc_consmedica(cosm_id, revxsistemas)
        self.registra_datosadc_consmedica(cosm_id, diagnostico)

        return u"Registrado exitósamente"
