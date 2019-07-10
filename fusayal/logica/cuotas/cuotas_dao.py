# coding: utf-8
"""
Fecha de creacion 25/8/18
@autor: mjapon
"""
import datetime

from fusayal.logica.cuotas.cuotas_model import TCuotas
from fusayal.logica.dao.base import BaseDao


class TCuotasDao(BaseDao):

    def listar(self, socio_id, anio, tipo):
        """
        Lista las cuotas de un socio en un anio especifico
        :param nui:
        :return:
        """

        sql = """
        select c.cuot_id,
              c.cuot_mes,
              c.cuot_anio,
              c.cuot_monto,
              c.cuot_compro,
              c.cuot_estado,
              c.cuot_fecreg,
              c.cuot_tipo,
              s.socio_nombre as socio,
              src.socio_nombre as socioregcuota
            from cuotas c
            JOIN socios s ON c.sc_id = s.socio_id
            JOIN socios src ON c.sc_id_reg_cuota = src.socio_id
            where c.cuot_anio = {1} and s.socio_id = {2} order by c.cuot_anio, c.cuot_mes 
            and c.cuot_tipo = {3}
        """.format(anio, socio_id, tipo)

        tupla_desc = ("cuot_id",
              "cuot_mes",
              "cuot_anio",
              "cuot_monto",
              "cuot_compro",
              "cuot_estado",
              "cuot_fecreg",
              "cuot_tipo",
              "socio",
              "socioregcuota")

        return self.all(sql, tupla_desc)

    def registrar_cuota(self, socio_id, tipo_cuota, anio, mes, monto, socio_id_reg, path_compro, obs):
        """
        Registra una nueva cuota de un socio
        :param socio_id:
        :param tipo_cuota:
        :param anio:
        :param mes:
        :param monto:
        :param socio_id_reg:
        :param path_compro:
        :param obs:
        :return:
        """

        cuotas = TCuotas()

        cuotas.sc_id = socio_id
        cuotas.cuot_mes = mes
        cuotas.cuot_monto = monto
        cuotas.sc_id_reg_cuota = socio_id_reg
        cuotas.cuot_compro = path_compro
        cuotas.cuot_estado = 0
        cuotas.cuot_fecreg = datetime.datetime.now()
        cuotas.cuot_tipo = tipo_cuota
        cuotas.cuot_anio = anio
        cuotas.cuot_obs = obs

        self.dbsession.add(cuotas)

        return {'estado':1, 'msg':'Registrado'}

    def get_empty_row(self, socioid, mes, anio):
        return {
            'estado': 1,  # 0-cancelado, 1-pendiente
            'monto': 0.0,
            'fecharegistro': '',
            'socioid': socioid,
            'socioreg': '',
            'pathcompro': '',
            'obs': '',
            'mes': mes,
            'anio': anio
        }

    def get_matriz(self, socio_id, anio, tipo):
        """
        Retorna matriz anio mes de el registro de cuotas de un socio
        :param socio_id:
        :param anio:
        :param tipo:
        :return:
        """

        tmpresult = self.listar(socio_id, anio, tipo)
        mapmeses = {}

        for row in tmpresult:
            mes = row['cuot_mes']
            mapmeses[mes] = row

        result = []

        #Constrir  matriz de pagos ordenados por mes
        for i in range(1,12):
            if i in mapmeses:
                result.add[mapmeses[i]]
            else:
                result.add(self.get_empty_row(socio_id, mes, anio))

        return result
