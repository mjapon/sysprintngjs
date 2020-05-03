# coding: utf-8
"""
Fecha de creacion 4/25/20
@autor: mjapon
"""
import logging
import hashlib
from datetime import datetime

from fusayal.logica.dao.base import BaseDao
from fusayal.logica.excepciones.validacion import ErrorValidacionExc
from fusayal.logica.fusay.tuserpaciente.tcita import TCita
from fusayal.logica.fusay.tuserpaciente.tuserpaciente_model import TUserPaciente
from fusayal.utils import cadenas, fechas

log = logging.getLogger(__name__)


class TUserPacienteDao(BaseDao):

    def autenticar(self, form):
        email = form['email']
        clave = form['password']
        clave_md5 = hashlib.md5(clave.encode()).hexdigest()
        sql = "select count(*) as cuenta from tuserpaciente where up_email = '{0}' and up_pasword = '{1}'".format(email,
                                                                                                                  clave_md5)

        cuenta = self.first_col(sql, 'cuenta')
        return cuenta > 0

    def crear_cuenta(self, form):
        provider = form['provider']
        nombres = form['nombres']
        email = form['email']
        celular = form['celular']
        photo_url = form['photoUrl']
        clave = cadenas.strip(form['clave'])
        clave_md5 = hashlib.md5(clave.encode()).hexdigest()

        up_email = cadenas.strip(email)
        up_nombres = cadenas.strip_upper(nombres)
        up_celular = cadenas.strip_upper(celular)

        aux_paciente = self.buscar_por_email(up_email)
        if aux_paciente is None:
            up_tipo = 0
            if provider == 'google':
                up_tipo = 2
            elif provider == 'facebook':
                up_tipo = 1

            tuserpaciente = TUserPaciente()
            tuserpaciente.up_email = cadenas.strip(up_email)
            tuserpaciente.up_tipo = up_tipo
            tuserpaciente.up_estado = 0
            tuserpaciente.up_fechacrea = datetime.now()
            tuserpaciente.up_nombres = up_nombres
            tuserpaciente.up_celular = up_celular
            tuserpaciente.up_tipo = up_tipo
            tuserpaciente.up_photourl = photo_url
            tuserpaciente.up_pasword = clave_md5

            self.dbsession.add(tuserpaciente)
            self.dbsession.flush()
        else:
            raise ErrorValidacionExc(
                    u'Ya existe una cuenta registrada con el correo: {0} no se puede crear nuevamente'.format(up_email))

    def existe_cuenta(self, email):
        aux_paciente = self.buscar_por_email(cadenas.strip(email))
        return aux_paciente is not None

    def crea_actualiza_cuenta(self, form):

        provider = form['provider']
        nombres = form['nombres']
        email = form['email']
        celular = form['celular']
        photo_url = form['photoUrl']
        clave = form['clave']
        clave_md5 = hashlib.md5(clave)

        up_email = cadenas.strip(email)
        up_nombres = cadenas.strip_upper(nombres)
        up_celular = cadenas.strip_upper(celular)

        aux_paciente = self.buscar_por_email(up_email)
        if aux_paciente is None:
            up_tipo = 0
            if provider == 'google':
                up_tipo = 2
            elif provider == 'facebook':
                up_tipo = 1

            tuserpaciente = TUserPaciente()
            tuserpaciente.up_email = cadenas.strip(up_email)
            tuserpaciente.up_tipo = up_tipo
            tuserpaciente.up_estado = 0
            tuserpaciente.up_fechacrea = datetime.now()
            tuserpaciente.up_nombres = up_nombres
            tuserpaciente.up_celular = up_celular
            tuserpaciente.up_tipo = up_tipo
            tuserpaciente.up_photourl = photo_url
            tuserpaciente.up_pasword = clave_md5

            self.dbsession.add(tuserpaciente)
            self.dbsession.flush()
        else:
            aux_paciente.up_nombres = up_nombres
            if cadenas.es_nonulo_novacio(up_celular):
                aux_paciente.up_celular = up_celular
            aux_paciente.up_photourl = photo_url
            self.dbsession.add(aux_paciente)

    def get_datos_cuenta(self, email):
        sql = u"""
        select up_id, up_email, up_tipo, up_nombres, up_celular, up_photourl from tuserpaciente where up_email = '{0}' 
        """.format(cadenas.strip(email))
        tupla_desc = ('up_id', 'up_email', 'up_tipo', 'up_nombres', 'up_celular', 'up_photourl')
        return self.first(sql, tupla_desc)

    """
    def crear_cuenta(self, form):
        if self.existe_cuenta(form):
            raise ErrorValidacionExc(
                u'Ya existe un usuario registrado con la dirección de correo :{0} '.format(form['email']))

        provider = form['provider']
        nombres = form['nombres']
        email = form['email']
        celular = form['celular']
        photo_url = form['photoUrl']
        clave = form['clave']
        clave_md5 = hashlib.md5(clave)

        if provider == 'GOOGLE':
            up_tipo = 2
        elif provider == 'FACEBOOK':
            up_tipo = 1
        else:
            up_tipo = 0

        tuserpaciente = TUserPaciente()
        tuserpaciente.up_email = cadenas.strip(email)
        tuserpaciente.up_tipo = up_tipo
        tuserpaciente.up_fechacrea = datetime.now()
        tuserpaciente.up_nombres = cadenas.strip_upper(nombres)
        tuserpaciente.up_celular = cadenas.strip_upper(celular)
        tuserpaciente.up_photourl = photo_url
        tuserpaciente.up_pasword = clave_md5

        self.dbsession.add(tuserpaciente)
    """

    def listar_citas_paciente(self, up_email):
        sql = u"""
                select cita.cita_id, cita.cita_fecha, cita.cita_hora, cita.cita_hora_fin,cita.paciente_id, cita.cita_obs, cita.medico_id, cita.cita_serv,
                cita.cita_estado,
                case cita.cita_estado 
                when 0 then 'Pendiente'
                when 1 then 'Atendido'
                when 2 then 'Cancelado'
                else ''
                end as estado,                
                tuserpac.up_email,
                tuserpac.up_tipo,                
                tuserpac.up_estado,
                tuserpac.up_fechacrea,
                tuserpac.up_nombres,
                tuserpac.up_celular,
                tuserpac.up_photourl,
                medico.per_nombres ||' '|| medico.per_apellidos as nombres_medico 
                from tcita cita
                join tuserpaciente tuserpac on cita.paciente_id = tuserpac.up_id  
                join tpersona medico on medico.per_id = cita.medico_id
                where tuserpac.up_email = '{0}' order by cita_fecha, cita_hora asc   
                """.format(up_email)
        tupla_desc = (
            'cita_id', 'cita_fecha', 'cita_hora', 'cita_hora_fin', 'paciente_id', 'cita_obs', 'medico_id', 'cita_serv',
            'cita_estado', 'estado',
            'up_email',
            'up_tipo',
            'up_estado',
            'up_fechacrea',
            'up_nombres',
            'up_celular',
            'up_photourl',
            'nombres_medico'
        )

        citas = self.all(sql, tupla_desc)
        for cita in citas:
            cita_fecha = cita['cita_fecha']
            cita_hora = cita['cita_hora']
            cita_hora_fin = cita['cita_hora_fin']
            cita_hora_str = fechas.num_to_hora(cita_hora)
            cita_fecha_str = fechas.get_fecha_letras_largo(fechas.parse_cadena(cita_fecha))
            cita_hora_fin_str = fechas.num_to_hora(cita_hora_fin)
            cita['cita_fecha_str'] = cita_fecha_str
            cita['cita_hora_str'] = cita_hora_str
            cita['cita_hora_fin_str'] = cita_hora_fin_str

        return citas

    def crear(self, form):
        # provider = form['provider']
        # nombres = form['nombres']
        # email = form['email']
        celular = form['celular']
        serv_id = form['serv_id']
        med_id = form['med_id']
        dia = form['dia']
        hora_ini = form['hora_ini']
        # photo_url = form['photoUrl']
        # clave = form['clave']
        # clave_md5 = hashlib.md5(clave)

        # up_email = cadenas.strip(email)
        # up_pasword = ''
        # up_nombres = cadenas.strip_upper(nombres)
        up_celular = cadenas.strip_upper(celular)
        up_email = form['up_email']
        aux_paciente = self.buscar_por_email(up_email)
        if aux_paciente is None:
            raise ErrorValidacionExc(u'No esta registrado la dirección de correo')
            """
            up_tipo = 0
            if provider == 'GOOGLE':
                up_tipo = 2
            else:
                up_tipo = 1

            tuserpaciente = TUserPaciente()
            tuserpaciente.up_email = cadenas.strip(up_email)
            tuserpaciente.up_tipo = up_tipo
            tuserpaciente.up_estado = 0
            tuserpaciente.up_fechacrea = datetime.now()
            tuserpaciente.up_nombres = up_nombres
            tuserpaciente.up_celular = up_celular
            tuserpaciente.up_photourl = photo_url
            tuserpaciente.up_pasword = clave_md5

            self.dbsession.add(tuserpaciente)
            self.dbsession.flush()
            paciente_id = tuserpaciente.up_id
            """
        else:
            paciente_id = aux_paciente.up_id
            # aux_paciente.up_nombres = up_nombres
            if cadenas.es_nonulo_novacio(up_celular):
                aux_paciente.up_celular = up_celular
            # aux_paciente.up_photourl = photo_url
            self.dbsession.add(aux_paciente)

        # Se procede a crear la cita
        tcita = TCita()

        hora_ini_num = fechas.hora_to_num(hora_ini)
        tcita.cita_hora = hora_ini_num
        tcita.cita_fecha = fechas.parse_cadena(dia)
        tcita.cita_hora_fin = hora_ini_num + 1
        tcita.cita_serv = serv_id
        tcita.medico_id = med_id
        tcita.paciente_id = paciente_id
        tcita.cita_estado = 0

        self.dbsession.add(tcita)

    def buscar_por_email(self, up_email):
        return self.dbsession.query(TUserPaciente).filter(TUserPaciente.up_email == cadenas.strip(up_email)).first()

    def listar_citas(self, med_id, fecha_desde):
        sql_fecha = ''
        if fecha_desde is not None and len(fecha_desde) > 0:
            fecha_db = fechas.format_cadena_db(fecha_desde)
            sql_fecha = "and cita_fecha >= '{fecha}'".format(fecha=fecha_db)

        sql = u"""
                select cita.cita_id, cita.cita_fecha, cita.cita_hora, cita.cita_hora_fin,cita.paciente_id, cita.cita_obs, cita.medico_id, cita.cita_serv,
                cita.cita_estado,
                case cita.cita_estado 
                when 0 then 'Pendiente'
                when 1 then 'Atendido'
                when 2 then 'Cancelado'
                else ''
                end as estado,                
                tuserpac.up_email,
                tuserpac.up_tipo,
                tuserpac.up_pasword,
                tuserpac.up_estado,
                tuserpac.up_fechacrea,
                tuserpac.up_nombres,
                tuserpac.up_celular,
                tuserpac.up_photourl
                
                from tcita cita
                join tuserpaciente tuserpac on cita.paciente_id = tuserpac.up_id  
                where medico_id = {0} {1} order by cita_fecha, cita_hora asc   
                """.format(med_id, sql_fecha)

        tupla_desc = (
            'cita_id', 'cita_fecha', 'cita_hora', 'cita_hora_fin', 'paciente_id', 'cita_obs', 'medico_id', 'cita_serv',
            'cita_estado', 'estado',
            'up_email',
            'up_tipo',
            'up_pasword',
            'up_estado',
            'up_fechacrea',
            'up_nombres',
            'up_celular',
            'up_photourl'
        )

        citas = self.all(sql, tupla_desc)
        for cita in citas:
            cita_fecha = cita['cita_fecha']
            cita_hora = cita['cita_hora']
            cita_hora_fin = cita['cita_hora_fin']
            cita_hora_str = fechas.num_to_hora(cita_hora)
            cita_fecha_str = fechas.get_fecha_letras_largo(fechas.parse_cadena(cita_fecha))
            cita_hora_fin_str = fechas.num_to_hora(cita_hora_fin)
            cita['cita_fecha_str'] = cita_fecha_str
            cita['cita_hora_str'] = cita_hora_str
            cita['cita_hora_fin_str'] = cita_hora_fin_str

        return citas

    def buscar_citas(self, med_id, serv_id, fecha_desde):
        """
        Busca un registro de cita
        :param med_id:
        :param serv_id:
        :return:
        """
        fecha_db = fechas.format_cadena_db(fecha_desde)

        sql = """
        select cita_id, cita_fecha, cita_hora, cita_hora_fin,paciente_id, cita_obs, medico_id, cita_serv
        from tcita where medico_id = {0} and cita_serv = {1} and cita_fecha >= '{2}' order by cita_fecha, cita_hora asc   
        """.format(med_id, serv_id, fecha_db)

        tupla_desc = (
            'cita_id', 'cita_fecha', 'cita_hora', 'cita_hora_fin', 'paciente_id', 'cita_obs', 'medico_id', 'cita_serv')

        citas = self.all(sql, tupla_desc)
        for cita in citas:
            cita_fecha = cita['cita_fecha']
            cita_hora = cita['cita_hora']
            cita_hora_fin = cita['cita_hora_fin']
            cita_hora_str = fechas.num_to_hora(cita_hora)
            cita_fecha_str = fechas.get_fecha_letras_largo(fechas.parse_cadena(cita_fecha))
            cita_hora_fin_str = fechas.num_to_hora(cita_hora_fin)
            cita['cita_fecha_str'] = cita_fecha_str
            cita['cita_hora_str'] = cita_hora_str
            cita['cita_hora_fin_str'] = cita_hora_fin_str

    def get_horario_medico(self, med_id):
        sql = "select  hm_id, med_id, hm_dia, hm_horaini,hm_horafin  from thorariomedico where med_id={0} order by hm_dia, hm_horaini".format(
            med_id)

        tupla_desc = ('hm_id', 'med_id', 'hm_dia', 'hm_horaini', 'hm_horafin')
        return self.all(sql, tupla_desc)

    def get_dias_disponibles(self, med_id):
        horario_med = self.get_horario_medico(med_id=med_id)
        citas_med = self.get_horario_medico(med_id=med_id)

    def get_matriz_horas_medico(self, med_id, dia):
        dia_parsed = fechas.parse_cadena(dia)
        weekday = dia_parsed.isoweekday()

        dia_db = fechas.format_cadena_db(dia)

        sql = """
        select hm.hm_id, hm.med_id, hm.hm_dia, hm.hm_horaini,hm.hm_horafin,
        coalesce(cita.cita_hora, 0) as cita_hora,  
        coalesce(cita.paciente_id, 0) as paciente_id
         from thorariomedico hm
        left join tcita cita on cita.medico_id = {medico} and cita.cita_fecha = '{fecha}' 
        where hm.med_id={medico} and hm.hm_dia = {weekday} order by hm.hm_horaini asc        
        """.format(medico=med_id, fecha=dia_db, weekday=weekday)

        tupla_desc = ('hm_id', 'med_id', 'hm_dia', 'hm_horaini', 'hm_horafin', 'cita_hora', 'paciente_id')
        res = self.all(sql, tupla_desc)

        horas = []
        setHorasOcupadas = set()

        for item in res:
            cita_hora = item['cita_hora']
            if cita_hora != 0:
                setHorasOcupadas.add(cita_hora)

        if res is not None:
            first_row = res[0]
            hm_horaini = first_row['hm_horaini']
            hm_horafin = first_row['hm_horafin']

            hora_iter = hm_horaini
            while hora_iter < hm_horafin:
                horaiter_fin = hora_iter + 1
                ocupado = 1 if hora_iter in setHorasOcupadas else 0
                hora_iter_str = fechas.num_to_hora(hora_iter)
                horaiter_fin_str = fechas.num_to_hora(horaiter_fin)
                horas.append({'horaIni': hora_iter_str, 'horaFin': horaiter_fin_str, 'ocupado': ocupado})
                hora_iter = horaiter_fin

        return horas

    def cambiar_estado_cita(self, cita_id, estado, observacion):

        tcita = self.dbsession.query(TCita).filter(TCita.cita_id == cita_id).first()
        if tcita is not None:
            tcita.cita_estado = estado
            tcita.cita_obs = observacion
            self.dbsession.add(tcita)
