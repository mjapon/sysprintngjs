# coding: utf-8
"""
Fecha de creacion 3/8/20
@autor: mjapon
"""
import logging

from pyramid.view import view_config

log = logging.getLogger(__name__)


@view_config(route_name='fusay', renderer='../templates/index.jinja2')
def fusay_view(request):
    banners = [
        {
            'img': '3_m.png'
        },
        {
            'img': '4_m.png'
        },
        {
            'img': '5_m.png'
        },
        {
            'img': '1_m.png'
        }
    ]
    servicios = [
        {
            'nombre': u'Medicina Ancestral',
            'img': u'medancestral_prod.jpg',
            'shortDet': u'Rituales de sanación con medicina ancestral',
            'longDet': u"""<p>
          El principal objetivo de nuestra Fundación, entro entros; es recuperar los conocimientos ancestrales
          de nuestros antepasados en el tema de sanación de nuestro cuerpo, revalorizando los conocimientos
          de nuestros mayores, yachacs, parteras, sanadores que se están perdiendo.
          En este sentido la medicina ancestral que la Fundación da como servicio consiste en ceremonias,
          rituales de curación con medicinas de poder (ahuacolla, ayahauasca, tabaco) y sanación tales como limpias
          con huevo, cuy entre otros; aportando asi al bienestar del ser humano y por ende de la sociedad en conjunto.
          </p>"""
        },

        {
            'nombre': u'Medicina Tradicional',
            'img': 'medtrad_prod.jpeg',
            'shortDet': u'Atención en medicina convencional',
            'longDet': u"""<p>
          La Medicina Tradicional u occidental tambien está presente en nuestra Fundación
          mediante la aplicacion de farmacos que son recetados por el médico de la Fundación
          luego de una evaluacion del mismo al paciente, en los casos para los que se requiere,
          de esta manera se complementan estas dos técnicas de curación con el objetivo de sanar
          al ser humano. En este sentido la Fundación
          ofrece el servicio de Consulta Externa, aplicación de sueros entre otros.
          </p>"""
        }

    ]

    directiva = [
        {
            'nombre': u'Msc. Angel Rodrigo Japón Gualán',
            'img': 'presid.jpg',
            'shortDet': u'Presidente',
            'longDet': u'Detalle presidente'
        },
        {
            'nombre': u'Prof. María Delfina Gualán Lozano',
            'img': 'mamadelfina.jpg',
            'shortDet': u'Tesorera',
            'longDet': u'Detalle tesorera'
        },
        {
            'nombre': u'Ing. Manuel Efraín Japón Gualán',
            'img': 'manuel.jpeg',
            'shortDet': u'Secretario',
            'longDet': u'Detalle secretario'
        },
        {
            'nombre': u'Msc. Angel Polibio Japón Gualán',
            'img': 'polibio.jpeg',
            'shortDet': u'Fiscalizador',
            'longDet': u'Detalle Fiscalizador'
        },
        {
            'nombre': u'Sr. Lauro Quishpe',
            'img': 'lauro.jpeg',
            'shortDet': u'Primer Vocal',
            'longDet': u'Detalle Primer Vocal'
        },


    ]

    return {'banners':banners, 'servicios':servicios, 'directiva':directiva}
