# coding: utf-8
"""
Fecha de creacion 5/23/20
@autor: mjapon
"""
import logging
from datetime import datetime

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.excepciones.validacion import ErrorValidacionExc
from fusayal.logica.fusay.tconsultamedica.tconsultamedica_model import TConsultaMedica, TConsultaMedicaValores
from fusayal.logica.fusay.tpersona.tpersona_dao import TPersonaDao
from fusayal.utils import fechas, ctes, cadenas

log = logging.getLogger(__name__)


class TConsultaMedicaDao(BaseDao):

    def get_form(self):
        form_antecedentes = self.get_form_valores(1)
        form_revxsistemas = self.get_form_valores(2)
        form_examsfisicos = self.get_form_valores(3)
        #form_examdiagnostico = self.get_form_valores(4)
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
            'per_lugnac': None,
            'per_nota': '',
            'per_fechanac': '',
            'per_genero': None,
            'per_estadocivil': 1,
            'per_lugresidencia': None,
            'per_ocupacion':None,
            'per_edad': 0
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
            'cosm_indicsreceta': '',
            'cosm_recomendaciones': '',
            'user_crea': '',
            'cosm_diagnostico':None,
            'cosm_diagnosticoal': '',
            'cosm_fechaproxcita': ''
        }

        return {
            'paciente': form_paciente,
            'datosconsulta': form_datosconsulta,
            'antecedentes': form_antecedentes,
            'examsfisicos': form_examsfisicos,
            'revxsistemas': form_revxsistemas
        }

    def get_antecedentes_personales(self, per_ciruc):

        ult_atencion_cod = self.get_ultima_atencion_paciente(per_ciruc)
        form_antecedentes = []
        if ult_atencion_cod is not None:
            form_antecedentes = self.get_valores_adc_citamedica(1, ult_atencion_cod )

        return form_antecedentes

    def get_historia_porpaciente(self, per_ciruc):
        """
        Buscar todas las veces que se ha registrado una atencion para el paciente especificado
        :param per_ciruc:
        :return: ['cosm_id', 'cosm_fechacrea', 'per_ciruc', 'paciente', 'cosm_motivo']
        """

        sql = u"""select historia.cosm_id, historia.cosm_fechacrea, paciente.per_ciruc, 
                paciente.per_nombres||' '||paciente.per_apellidos as paciente, historia.cosm_motivo,
                historia.cosm_fechaproxcita 
                from tconsultamedica historia
                join tpersona paciente on historia.pac_id = paciente.per_id and 
                paciente.per_ciruc = '{0}' order by historia.cosm_fechacrea desc """.format(per_ciruc)
        tupla_desc = ('cosm_id', 'cosm_fechacrea', 'per_ciruc', 'paciente', 'cosm_motivo', 'cosm_fechaproxcita')

        historias = self.all(sql, tupla_desc)
        historias_fecha = []

        for item in historias:
            fecha_str = fechas.get_fecha_letras_largo(fechas.parse_cadena(item['cosm_fechacrea'], formato=ctes.APP_FMT_FECHA_HORA))
            item['fecha_crea_largo'] = fecha_str
            historias_fecha.append(item)

        return historias_fecha

    def get_datos_historia(self, cosm_id):
        """
        Retorna toda la informacion relacionada con una historia medica registrada
        :param cosm_id:
        :return:
        """

        sql = u"""
        select historia.cosm_id,
               historia.med_id,
               historia.cosm_fechacrea,
               historia.cosm_motivo,
               historia.cosm_enfermactual,
               historia.cosm_hallazgoexamfis,
               historia.cosm_exmscompl,
               historia.cosm_tratamiento,
               historia.cosm_receta,
               historia.cosm_indicsreceta,
               historia.cosm_recomendaciones,
               historia.cosm_diagnostico,
               historia.cosm_diagnosticoal,
               historia.user_crea,
               historia.cosm_fechaproxcita,
               paciente.per_id,
                    paciente.per_ciruc,
                    paciente.per_nombres,
                    paciente.per_apellidos,
                    paciente.per_nombres ||' '||paciente.per_apellidos as paciente, 
                    paciente.per_direccion,
                    paciente.per_telf,
                    paciente.per_movil,
                    paciente.per_email,
                    paciente.per_fecreg,
                    paciente.per_tipo,
                    paciente.per_lugnac,
                    paciente.per_nota,
                    paciente.per_fechanac,
                    paciente.per_genero,
                    paciente.per_estadocivil,
                    paciente.per_lugresidencia,
                    paciente.per_ocupacion,
                    coalesce(lv.lval_nombre, '') as ocupacion,
                    cie.cie_valor ciediagnostico, 
                    cie.cie_key ciekey from tconsultamedica historia
        join tpersona paciente on historia.pac_id = paciente.per_id
        left join tcie10 cie on  historia.cosm_diagnostico = cie.cie_id
        left join tlistavalores lv on paciente.per_ocupacion = lv.lval_id
        where historia.cosm_id = {0}
        """.format(cosm_id)

        tupla_desc = ('cosm_id',
                      'med_id',
                      'cosm_fechacrea',
                      'cosm_motivo',
                      'cosm_enfermactual',
                      'cosm_hallazgoexamfis',
                      'cosm_exmscompl',
                      'cosm_tratamiento',
                      'cosm_receta',
                      'cosm_indicsreceta',
                      'cosm_recomendaciones',
                      'cosm_diagnostico',
                      'cosm_diagnosticoal',
                      'user_crea',
                      'cosm_fechaproxcita',
                      'per_id',
                      'per_ciruc',
                      'per_nombres',
                      'per_apellidos',
                      'per_direccion',
                      'paciente',
                      'per_telf',
                      'per_movil',
                      'per_email',
                      'per_fecreg',
                      'per_tipo',
                      'per_lugnac',
                      'per_nota',
                      'per_fechanac',
                      'per_genero',
                      'per_estadocivil',
                      'per_lugresidencia',
                      'per_ocupacion',
                      'ocupacion',
                      'ciediagnostico',
                      'ciekey')

        datos_cita_medica = self.first(sql, tupla_desc)

        form_paciente = {}
        form_datosconsulta = {}
        for key in datos_cita_medica:
            if key.startswith('per_'):
                form_paciente[key]=datos_cita_medica[key]
            else:
                form_datosconsulta[key]=datos_cita_medica[key]

        form_antecedentes = self.get_valores_adc_citamedica(1, cosm_id)
        form_examsfisicos = self.get_valores_adc_citamedica(3, cosm_id)
        form_revxsistemas = self.get_valores_adc_citamedica(2, cosm_id)
        form_examdiagnostico = self.get_valores_adc_citamedica(4, cosm_id)

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
        select cmtv_id, cmtv_cat, cmtv_nombre, cmtv_valor, '' as valorreg, cmtv_tinput, cmtv_unidad from tconsultam_tiposval
            where cmtv_cat = {0} order by cmtv_orden
        """.format(catc_id)

        tupla_desc = ('cmtv_id', 'cmtv_cat', 'cmtv_nombre', 'cmtv_valor', 'valorreg', 'cmtv_tinput', 'cmtv_unidad')

        return self.all(sql, tupla_desc)

    def get_ultima_atencion_paciente(self, per_ciruc):
        sql = u"""select historia.cosm_id, historia.cosm_fechacrea, paciente.per_ciruc, 
                        paciente.per_nombres||' '||paciente.per_apellidos as paciente, historia.cosm_motivo 
                        from tconsultamedica historia
                        join tpersona paciente on historia.pac_id = paciente.per_id and 
                        paciente.per_ciruc = '{0}' order by historia.cosm_id desc""".format(per_ciruc)
        tupla_desc = ('cosm_id', 'cosm_fechacrea', 'per_ciruc', 'paciente', 'cosm_motivo')

        respuesta = self.all(sql, tupla_desc)
        if respuesta is not None and len(respuesta)>0:
            return respuesta[0]['cosm_id']

        return None

    def get_valores_adc_citamedica(self, catc_id, cosm_id):

        sql = u"""
        select cmtval.cmtv_id, cmtval.cmtv_cat, cmtval.cmtv_nombre, cmtval.cmtv_valor, 
               cmtval.cmtv_tinput, coalesce(cval.valcm_valor,'') as valorreg 
            from tconsultam_tiposval cmtval
            left join tconsultam_valores cval on cmtval.cmtv_id = cval.valcm_tipo
                        where cmtv_cat = {0} and cval.cosm_id = {1} order by cmtval.cmtv_orden;
        """.format(catc_id, cosm_id)

        tupla_desc = ('cmtv_id', 'cmtv_cat', 'cmtv_nombre', 'cmtv_valor', 'cmtv_tinput', 'valorreg')
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

        # Verificar si el paciente ya esta registrado:
        if tpersonadao.existe_ciruc(per_ciruc=form_paciente['per_ciruc']):
            per_id = form_paciente['per_id']
            tpersonadao.actualizar(per_id=per_id, form=form_paciente)
        else:
            per_id = tpersonadao.crear(form=form_paciente)

        # 2 registro de la cita medica
        datosconsulta = form['datosconsulta']

        #Verificar que se ingrese el motivo de la consulta
        if not cadenas.es_nonulo_novacio(datosconsulta['cosm_motivo']):
            raise ErrorValidacionExc(u"Debe ingresar el motivo de la consulta")


        tconsultamedica = TConsultaMedica()
        tconsultamedica.pac_id = per_id
        tconsultamedica.med_id = 0  # TODO: Se debe registrar tambien el codigo del medico al que se le va asignar la cita medica
        tconsultamedica.cosm_fechacita = datetime.now()
        tconsultamedica.cosm_fechacrea = datetime.now()
        tconsultamedica.cosm_motivo = datosconsulta['cosm_motivo']
        tconsultamedica.cosm_enfermactual = datosconsulta['cosm_enfermactual']
        tconsultamedica.cosm_hallazgoexamfis = datosconsulta['cosm_hallazgoexamfis']
        tconsultamedica.cosm_exmscompl = datosconsulta['cosm_exmscompl']
        tconsultamedica.cosm_tratamiento = datosconsulta['cosm_tratamiento']
        tconsultamedica.cosm_receta = datosconsulta['cosm_receta']
        tconsultamedica.cosm_indicsreceta = datosconsulta['cosm_indicsreceta']
        tconsultamedica.cosm_recomendaciones = datosconsulta['cosm_recomendaciones']

        if type(datosconsulta['cosm_diagnostico']) is dict:
            tconsultamedica.cosm_diagnostico = datosconsulta['cosm_diagnostico']['cie_id']
        else:
            tconsultamedica.cosm_diagnostico = datosconsulta['cosm_diagnostico']

        tconsultamedica.cosm_diagnosticoal = datosconsulta['cosm_diagnosticoal']

        if 'cosm_fechaproxcita' in datosconsulta:
            cosm_fechaproxcita = datosconsulta['cosm_fechaproxcita']
            if cadenas.es_nonulo_novacio(cosm_fechaproxcita):
                cosm_fechaproxcita_parsed = fechas.parse_cadena(cosm_fechaproxcita)
                tconsultamedica.cosm_fechaproxcita = cosm_fechaproxcita_parsed

        tconsultamedica.user_crea = usercrea
        self.dbsession.add(tconsultamedica)
        self.dbsession.flush()
        cosm_id = tconsultamedica.cosm_id

        # 3 Registro de antecendentes:
        # Esto se registra como lista de valores
        antecedentes = form['antecedentes']
        examsfisicos = form['examsfisicos']
        revxsistemas = form['revxsistemas']
        #diagnostico = form['diagnostico']

        self.registra_datosadc_consmedica(cosm_id, antecedentes)
        self.registra_datosadc_consmedica(cosm_id, examsfisicos)
        self.registra_datosadc_consmedica(cosm_id, revxsistemas)
        #self.registra_datosadc_consmedica(cosm_id, diagnostico)

        return u"Registrado exitósamente", cosm_id

    def buscar_categoria_valor(self, valor, categoria):
        """
        Busca la categoria de un valor
        :param valor:
        :param categoria:
        :return:
        """
        #CAtegoria 1,2: Presion (Presion Sistolica/Presion Diastóica)
        result = ""
        color = ""
        if categoria == 1:
            valorespresion = valor.split("/")
            if len(valorespresion) == 2:
                sistolica = float(valorespresion[0])
                diastolica = float(valorespresion[1])
                sql = u"""select cmcv_nombrecat, cmcv_color from tconsultam_clasificaval where 
                            cmcv_cat =1 and 
                            ( {0} between cmcv_min and cmcv_max ) and
                            ( {1} between cmcv_minb and cmcv_maxb ) """.format(sistolica, diastolica)
                tupla_desc = ('cmcv_nombrecat', 'cmcv_color')
                resa = self.all(sql, tupla_desc)

                if len(resa) > 0:
                    result = resa[0]['cmcv_nombrecat']
                    color = resa[0]['cmcv_color']

        if categoria == 3:
            if len(cadenas.strip(valor)) > 0:
                valimc = float(valor)
                sql = u"""select cmcv_nombrecat, cmcv_color from tconsultam_clasificaval where 
                                            cmcv_cat =3 and {0} between cmcv_min and cmcv_max """.format(valimc)
                tupla_desc = ('cmcv_nombrecat', 'cmcv_color')
                resa = self.all(sql, tupla_desc)
                if len(resa) > 0:
                    result = resa[0]['cmcv_nombrecat']
                    color = resa[0]['cmcv_color']

        return result, color
