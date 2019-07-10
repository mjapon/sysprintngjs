# coding: utf-8
"""
Fecha de creacion 5/25/19
@autor: mjapon
"""
import datetime
import logging

from fusayal.logica.cuotas.cuotas_model import ReportRequest
from fusayal.logica.dao.base import BaseDao
from sqlalchemy.sql.functions import now

log = logging.getLogger(__name__)


class ReportRequestDao(BaseDao):

    def crear(self, key,
              report_definition,
              data,
              is_test_data,
              pdf_file):

        reportrequest = ReportRequest()

        reportrequest.key = key
        reportrequest.report_definition = report_definition
        reportrequest.data = data
        reportrequest.is_test_data = is_test_data
        reportrequest.pdf_file = pdf_file
        reportrequest.pdf_file_size = len(pdf_file)
        reportrequest.created_on = datetime.datetime.now()

        self.dbsession.add(reportrequest)

    def get(self, key):

        return self.dbsession.query(ReportRequest).filter(ReportRequest.key==key).first()

