# coding: utf-8
import logging

from pyramid.httpexceptions import HTTPFound
from pyramid.security import forget
from pyramid.view import view_config

from fusayal.logica.excepciones.validacion import ErrorValidacionExc
from fusayal.logica.jobs.jobdoc.jobdoc_dao import TJobDocDao
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


@view_config(route_name='logoutApp', renderer='../templates/initApp.jinja2')
def logout_view(request):
    headers = forget(request)
    request.session.invalidate()
    return HTTPFound(request.route_url('initApp'), headers=headers)


@view_config(route_name='loginApp', renderer='../templates/loginApp.jinja2')
def login_view(request):
    log.info("request login view processing")

    if 'usuario' in request.POST:
        usuario = request.POST['usuario']
        clave = request.POST['clave']

        userdao = TUsersDao(request.dbsession)
        autenticado = userdao.autenticar(username=usuario, password=clave)
        if autenticado:
            tuser = userdao.get_user(username=usuario)
            request.session['userlogged'] = 1
            request.session['us_nomapel'] = tuser.us_nomapel
            request.session['us_id'] = tuser.us_id
            request.session['us_name'] = tuser.us_name
            request.session['tuser'] = tuser
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
                if temp_id is not None and len(temp_id) > 0 and int(temp_id) > 0:
                    plantillasDao.actualizar(temp_id=temp_id,
                                             new_temp_name=nombreArchivo,
                                             new_temp_jrxml=filecontent)
                    request.session.flash('success:Reporte actualizado correctamente')
                else:
                    plantillasDao.crear(temp_name=nombreArchivo,
                                        temp_jrxml=filecontent)

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
            thefile = request.POST['file'].file
            nombreArchivo = request.POST['nombreArchivo']
            filecontent = thefile.read()
            tjobdocdao = TJobDocDao(request.dbsession)
            try:
                resp = tjobdocdao.crear(job_id=job_id, nombre_archivo=filename, user_crea=request.session['us_id'])
                uploadFileUtil = CargaArchivosUtil()
                uploadFileUtil.save_bytarray(resp['ruta'], filecontent)
                estado = 200
                msg = 'success:{0}'.format(resp['msg'])
            except ErrorValidacionExc as ex:
                estado = -1
                msg = 'danger:' + format(ex.message)
                log.error(u'Error al tratar de guardar el trabajo de impresión: {0}'.format(ex))

    """
    response = Response(json.dumps(res, cls=SEJsonEncoder))
    return add_status_to_response(response, res)
    """
    return {'estado': estado, 'msg': msg}
