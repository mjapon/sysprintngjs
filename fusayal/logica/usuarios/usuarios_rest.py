# coding: utf-8
"""
Fecha de creacion 25/8/18
@autor: mjapon
"""
from fusayal.logica.usuarios.usuarios_model import TUsuarios
from fusayal.utils.pyramidutil import DbComunView
from cornice.resource import resource


#@resource(path="/rest/login/{id}", collection_path="/rest/login")
class LoginRest(DbComunView):

    def post(self):
        form = self.get_json_body()
        #Formulario que llega es: {usuario, clave}
        usuario = form.get("usuario")
        clave = form.get("clave")



