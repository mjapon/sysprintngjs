import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(here, 'README.txt')) as f:
    README = f.read()
with open(os.path.join(here, 'CHANGES.txt')) as f:
    CHANGES = f.read()

requires = [
    'plaster_pastedeploy',
    'pyramid==1.9',
    #'pyramid==1.7',
    'pyramid_debugtoolbar',
    'pyramid_jinja2',
    'pyramid_retry',
    'pyramid_tm',
    'SQLAlchemy==0.9.8',
    'transaction',
    'zope.sqlalchemy',
    'waitress',
    'cornice',
    'psycopg2',
    'psycopg2-binary',
    'simplejson',
    'cornice',
    'pyramid_beaker',
    'pyramid_mailer',
    #'python-jwt',
    'PyJWT'
    #'PyJWT'
    #'reportbro-lib'

]

tests_require = [
    'WebTest >= 1.3.1',  # py3 compat
    'pytest',
    'pytest-cov',
]

setup(
    name='fusayal',
    version='0.0',
    description='fusayal',
    long_description=README + '\n\n' + CHANGES,
    classifiers=[
        'Programming Language :: Python',
        'Framework :: Pyramid',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: WSGI :: Application',
    ],
    author='',
    author_email='',
    url='',
    keywords='web pyramid pylons',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    extras_require={
        'testing': tests_require,
    },
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main = fusayal:main',
        ],
        'console_scripts': [
            'initialize_fusayal_db = fusayal.scripts.initializedb:main',
        ],
    },
)
