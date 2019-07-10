# coding: utf-8
"""
Fecha de creacion '02/12/15'
@autor: 'serviestudios'
"""
import base64
import logging
import os


from fusayal.logica.dao.base import BaseDao

log = logging.getLogger(__name__)


class CargaArchivosUtil(object):

    def get_decoded_file_data_type(self, b64file):
        """Dado una cadena codificada en base64, retorna el tipo de dato y datos decodificados para su registro"""
        tipofile, filestr = b64file.split(';base64,')
        decoded = base64.b64decode(filestr)
        return {'data_type':tipofile,
                'decoded':decoded}

    def get_base64_from_file(self, path_file, data_type):
        """Dado la ruta y el tipo de archivo se retorna archivo en base64"""
        openfile = open(path_file, "rb")
        file = base64.b64encode(openfile.read()) # se codifica el archivo en base 64
        return '{0};base64,{1}'.format(data_type, file)

    def save_decodedb64_file(self, path_file, data):
        destino = open(path_file, 'wb')
        destino.write(data)
        destino.close()



class ArchivosTransaccUtil(CargaArchivosUtil, BaseDao):

    def guardar_archivo(self, acf_imgdir, emp_coding, tra_codigo, file_name, file_src):
        """Graba en el disco duro datos enviados en base 64, retorna ruta y tupo de archivo para registrar en propiedad adicional"""

        if file_src is not None and len(file_src)>0:
            res_decoded = self.get_decoded_file_data_type(b64file=file_src)
            data_type = res_decoded['data_type']
            file_data = res_decoded['decoded']

            #Grabar en el disco el archivo
            path_transacc = "{raiz}/transaccs/{emp_coding}/{tra_codigo}".format(raiz=acf_imgdir,emp_coding=emp_coding,tra_codigo=tra_codigo)
            if not os.path.exists(path_transacc):
                os.makedirs(path_transacc)

            path_file = "{path_transacc}/{filename}".format(path_transacc=path_transacc, filename=file_name)

            self.save_decodedb64_file(path_file=path_file, data=file_data)

            #Grabar en la base de datos propiedad adicional, la ruta y el tipo de archivo
            return "{0};{1}".format(path_file,data_type)