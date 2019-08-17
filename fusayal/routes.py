def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    #config.add_route('home', '/')
    config.add_route('initApp', '/')
    config.add_route('loginApp', '/login')
    config.add_route('confirmClaveApp', '/confirmClave')
    config.add_route('logoutApp', '/logout')
    config.add_route('homeApp', '/home')
    config.add_route('upload_view', '/uploadview')
    config.add_route('upload_job_view', '/uploadjobview')
    #config.add_route('home', '/prhome')
    #config.add_route('reportbro', '/report/run')
    #config.add_route('reporte', '/reportemj')

