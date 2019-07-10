# coding: utf-8
"""
Fecha de creacion @date
@autor: Manuel Japon
"""


def valor_cambiado(entidad_json, formulario_json):
    """
    Verifica si los valores enviados en el formulario han cambiado contra los valores de la entidad
    :param entidad_json:
    :param formulario_json:
    :return:
    """
    cambios_list = []

    for key in formulario_json.keys():
        if key in entidad_json:
            form_value = formulario_json[key]
            entity_value = entidad_json[key]

            if form_value != entity_value:
                cambios_list.append({'col': key, 'valorant': entity_value, 'valordesp': form_value})

    return cambios_list
