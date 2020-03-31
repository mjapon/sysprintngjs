# coding: utf-8
import logging
import os

from pyramid.httpexceptions import HTTPFound
from pyramid.security import forget
from pyramid.view import view_config

from fusayal.logica.excepciones.validacion import ErrorValidacionExc
from fusayal.logica.imprentas.imprentas_dao import ImprentasDao
from fusayal.logica.jobs.jobdoc.jobdoc_dao import TJobDocDao
from fusayal.logica.params.param_dao import TParamsDao
from fusayal.logica.plantillas.plantilla_dao import TPlantillasDao
from fusayal.logica.users.users_dao import TUsersDao
from fusayal.utils.archivos import CargaArchivosUtil

log = logging.getLogger(__name__)


@view_config(route_name='initApp', renderer='../templates/initApp.jinja2')
def init_view(request):
    if 'userlogged' in request.session:
        if request.session['userlogged'] == 1:
            return HTTPFound(request.route_url('homeApp'))

    return {}


@view_config(route_name='initFusay', renderer='../templates/fusaybs.jinja2')
def init_fusay_view(request):
    return {}


@view_config(route_name='logoutApp', renderer='../templates/initApp.jinja2')
def logout_view(request):
    headers = forget(request)
    request.session.invalidate()
    return HTTPFound(request.route_url('initApp'), headers=headers)


@view_config(route_name='confirmClaveApp', renderer='../templates/confirmClave.jinja2')
def confirm_clave(request):
    log.info('confirm_clave view procesing')

    if 'clave' in request.POST:
        clave = request.POST['clave']
        confclave = request.POST['confclave']

        imprentasdao = ImprentasDao(request.dbsession)
        datosimprenta = imprentasdao.get_datos_empresa(imp_codigo=request.session['emp_codigo'])
        if datosimprenta is None:
            return {'autenticado': 0, 'msg': 'Empresa no registrada'}
        else:
            emp_esquema = datosimprenta['timp_esquema']
            request.dbsession.execute("SET search_path TO {0}".format(emp_esquema))
            userdao = TUsersDao(request.dbsession)
            try:
                userdao.cambiar_clave(user_name=request.session['us_name'], password=clave, rpassword=confclave)
                return HTTPFound(request.route_url('homeApp'))
            except Exception as ex:
                return {'autenticado': 0, 'msg': 'Error:'+ex.message}

    return {'msg': '', 'autenticado': 0}



@view_config(route_name='loginApp', renderer='../templates/loginApp.jinja2')
def login_view(request):
    log.info("request login view processing")

    if 'usuario' in request.POST:
        usuario = request.POST['usuario']
        clave = request.POST['clave']
        empresa = request.POST['empresa']

        imprentasdao = ImprentasDao(request.dbsession)
        datosimprenta = imprentasdao.get_datos_empresa(imp_codigo=empresa)
        if datosimprenta is None:
            return {'autenticado': 0, 'msg': 'Empresa no registrada'}
        else:
            emp_esquema = datosimprenta['timp_esquema']
            request.dbsession.execute("SET search_path TO {0}".format(emp_esquema))
            userdao = TUsersDao(request.dbsession)
            autenticado = userdao.autenticar(username=usuario, password=clave)
            if autenticado:
                tuser = userdao.get_user(username=usuario)
                request.session['emp_esquema'] = emp_esquema
                request.session['emp_codigo'] = empresa
                request.session['userlogged'] = 1
                request.session['us_nomapel'] = tuser.us_nomapel
                request.session['us_id'] = tuser.us_id
                request.session['us_name'] = tuser.us_name
                request.session['tuser'] = tuser

                if int(tuser.us_statusclave) == 0:
                    return HTTPFound(request.route_url('confirmClaveApp'))
                else:
                    return HTTPFound(request.route_url('homeApp'))
            else:
                return {'autenticado': 0, 'msg': 'Usuario o clave incorrectos'}

    return {'msg': '', 'autenticado': 0}


@view_config(route_name='homeApp', renderer='../templates/homeApp.jinja2')
def home_view(request):
    if 'userlogged' not in request.session:
        print 'No esta logueado'
        return HTTPFound(request.route_url('loginApp'))
    else:
        print 'Ya esta logueado'
    return {'msg': ''}


@view_config(route_name="upload_view")
def upload_file(request):
    if 'filename' not in dir(request.POST['file']) or \
            len(request.POST['nombreArchivo'].strip()) == 0:
        request.session.flash('danger:Debe cargar el archivo de la plantilla y especificar el nombre')

    else:
        temp_id = None
        if 'temp_id' in request.POST:
            temp_id = request.POST['temp_id']

        filename = request.POST['file'].filename

        if not filename.endswith('.jrxml'):
            request.session.flash('danger:Reporte incorrecto, debe cargar un archivo con extension .jrxml')

        else:
            thefile = request.POST['file'].file
            nombreArchivo = request.POST['nombreArchivo']
            filecontent = thefile.read()
            plantillasDao = TPlantillasDao(request.dbsession)

            try:
                if 'emp_esquema' in request.session:
                    emp_esquema = request.session['emp_esquema']
                    request.dbsession.execute("SET search_path TO {0}".format(emp_esquema))

                paramsdao = TParamsDao(request.dbsession)
                path_save_jobs = paramsdao.get_ruta_savejobs()
                ruta = "{0}{1}{2}".format(path_save_jobs, os.path.sep, nombreArchivo)

                uploadFileUtil = CargaArchivosUtil()
                uploadFileUtil.save_bytarray(ruta, filecontent)

                if temp_id is not None and len(temp_id) > 0 and int(temp_id) > 0:
                    plantillasDao.actualizar(temp_id=temp_id,
                                             new_temp_name=nombreArchivo,
                                             new_temp_jrxml=ruta)
                    request.session.flash('success:Reporte actualizado correctamente')
                else:
                    plantillasDao.crear(temp_name=nombreArchivo,
                                        temp_jrxml=ruta)

                    request.session.flash('success:Reporte registrado correctamente')
            except ErrorValidacionExc as ex:
                log.error('Error al tratar de registrar la plantilla: {0}'.format(ex))
                request.session.flash('danger:' + format(ex.message))

    url = request.route_url('homeApp')
    return HTTPFound(location=url)


@view_config(route_name="upload_job_view", renderer='json')
def upload_job_file(request):
    estado = 0
    msg = ''

    if 'filename' not in dir(request.POST['file']) or \
            len(request.POST['nombreArchivo'].strip()) == 0:
        estado = -1
        msg = 'Debe cargar el archivo del trabajo de impresion generado y especificar el nombre'
    else:
        job_id = None
        if 'job_id' in request.POST:
            job_id = request.POST['job_id']

        filename = request.POST['file'].filename

        if not filename.endswith('.pdf'):
            estado = -1
            msg = 'Archivo incorrecto, debe cargar un archivo con extension .pdf'
        else:
            if 'emp_esquema' in request.session:
                emp_esquema = request.session['emp_esquema']
                request.dbsession.execute("SET search_path TO {0}".format(emp_esquema))

            thefile = request.POST['file'].file
            nombreArchivo = request.POST['nombreArchivo']
            filecontent = thefile.read()
            tjobdocdao = TJobDocDao(request.dbsession)
            try:
                resp = tjobdocdao.crear(job_id=job_id, nombre_archivo=filename, user_crea=request.session['us_id'],
                                        tipocarga=1)
                uploadFileUtil = CargaArchivosUtil()
                uploadFileUtil.save_bytarray(resp['ruta'], filecontent)
                estado = 200
                msg = '{0}'.format(resp['msg'])
            except ErrorValidacionExc as ex:
                estado = -1
                msg = '{0}'.format(ex.message)
                log.error(u'Error al tratar de guardar el trabajo de impresión: {0}'.format(ex))

    """
    response = Response(json.dumps(res, cls=SEJsonEncoder))
    return add_status_to_response(response, res)
    """
    return {'estado': estado, 'msg': msg}
