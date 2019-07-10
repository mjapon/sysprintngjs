import zope
from pyramid.config import Configurator
from pyramid.session import SignedCookieSessionFactory
from pyramid_beaker import session_factory_from_settings
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker

def get_session_factory(engine):
    """Return a generator of database session objects."""
    factory = sessionmaker()
    factory.configure(bind=engine)
    return factory

def get_tm_session(session_factory, transaction_manager):
    """Build a session and register it as a transaction-managed session."""
    dbsession = session_factory()
    zope.sqlalchemy.register(dbsession, transaction_manager=transaction_manager)
    return dbsession

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """

    settings['tm.manager_hook'] = 'pyramid_tm.explicit_manager'

    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')
    config.include('.models')
    config.include('.routes')
    config.include('cornice')
    config.include('pyramid_tm')

    session_factory = get_session_factory(engine_from_config(settings, prefix='sqlalchemy.'))
    config.registry['dbsession_factory'] = session_factory
    config.add_request_method(
        lambda request: get_tm_session(session_factory, request.tm),
        'dbsession',
        reify=True
    )



    #my_session_factory = SignedCookieSessionFactory('itsaseekreet')
    #config.set_session_factory(my_session_factory)

    # beaker_session
    #session_factory = session_factory_from_settings(settings)
    #config.set_session_factory(session_factory)

    config.scan()
    return config.make_wsgi_app()
