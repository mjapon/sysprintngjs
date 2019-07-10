# -*- coding:UTF-8 -*-
"""
Created on '01/12/2014'
@author: 'Manuel'
"""
import logging

import zope
from sqlalchemy.engine import engine_from_config
from sqlalchemy.ext.declarative.api import as_declarative
from sqlalchemy.orm.scoping import scoped_session
from sqlalchemy.orm.session import sessionmaker
from zope.sqlalchemy.datamanager import ZopeTransactionExtension

log = logging.getLogger(__name__)

ENGINE_DBCOMUN_DIC = {}


@as_declarative()
class Declarative(object):
    pass

"""
def get_dbsession_comun(settings):

    global ENGINE_DBCOMUN_DIC
    if 'initdb' in ENGINE_DBCOMUN_DIC:
        log.info("Obtengo connecion a initdb desde memoria")
        return ENGINE_DBCOMUN_DIC['initdb']
    else:
        log.info("Se crea conexion a initdb")
        engine = engine_from_config(settings, 'sqlalchemy.', echo=True, echo_pool=True)

        DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
        DBSession.configure(bind=engine)

        global ENGINE_DBCOMUN_DIC
        ENGINE_DBCOMUN_DIC['initdb'] = DBSession
        return DBSession
"""