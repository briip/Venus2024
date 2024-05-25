import sqlite3
from collections import namedtuple
import math
import location
import filters


Distance = namedtuple("Distance", ['x', 'y', 'euclidean_distance'])
_CONNECTION_PATH = "c:/Coding/VenusHacks2024/Venus2024/Persephone.db"


def _calculate_distance(lat: int, long: int, coordinates) -> Distance:
    x_coord = coordinates[0]
    y_coord = coordinates[1]
    edist = math.sqrt((lat - x_coord)**2 + (long - y_coord)**2)
    return Distance(lat, long, edist)


def get_x_y_list(connection: sqlite3.Connection, additional_param=''):
    # additional_param = f"WHERE description = {desc}"
    get_x = f'SELECT latitude FROM Shelter "{additional_param}";'
    get_y = f'SELECT longitude FROM Shelter "{additional_param}";'

    cursor = connection.execute(get_x)
    x = cursor.fetchall()
    cursor.close()

    cursor = connection.execute(get_y)
    y = cursor.fetchall()
    cursor.close()

    while ("latitude", ) in x:
        x.remove(("latitude", ))

    while ("longitude", ) in y:
        y.remove(("longitude", ))

    return x, y


def compile_filters(connection: sqlite3.Connection, descs:list=None):
    if not descs:
        return get_x_y_list(connection)
    x, y = [], []
    for desc in descs:
        add = filters.create_desc_param(desc)
        x1, y1 = get_x_y_list(connection, add)
        for i in x1:
            if i not in x:
                x.append(i)
        for j in y1:
            if j not in y:
                y.append(j)
    return x, y


def _closest_five(top: list[Distance], distance: Distance) -> list:
    if len(top) >= 5 and distance not in top:
        dists = [dist[-1] for dist in top]
        max_dist = max(dists)
        if max_dist > distance[-1]:
            del_ind = dists.index(max_dist)
            top.pop(del_ind)
            top.append(distance)
    elif len(top) < 5 and distance not in top:
        top.append(distance)
    return top


def _extract_location_info(location_info):
    name = location_info[9]
    phys_address = ', '.join(location_info[10:14])
    hours = location_info[15]
    phone = location_info[16]
    email = location_info[17]
    desc = location_info[21]

    return name, phys_address, hours, phone, email, desc


def _get_closest(coordinates: tuple, connection: sqlite3.Connection, filter=None):
    """Gets the top 5 closest locations to current location."""
    if filter == "Women's Only":
        x, y = compile_filters(connection, filters.filter_womens(connection))
    elif filter == "Domestic Violence":
        x, y = compile_filters(connection, filters.filter_dv(connection))
    else:
        x, y = compile_filters(connection)

    # print(len(x))
    # print(len(y))

    top_5 = []
    distance = None
    for lat in x:
        ind = x.index(lat)
        distance = _calculate_distance(lat[0], y[ind][0], coordinates)
        top_5 = _closest_five(top_5, distance)

    return top_5


def _store_location_info(connection: sqlite3.Connection, distance: Distance, store: list):
    command = f"SELECT * FROM Shelter WHERE latitude = {distance[0]} AND longitude = {distance[1]};"
    cursor = connection.execute(command)
    location_info = cursor.fetchall()
    # print(location_info)

    name, phys_address, hours, phone, email, desc = _extract_location_info(location_info[0])
    
    dict_element = {"name": name, "address": phys_address, "hours": hours, "phone": phone,
                    "email": email, "description": desc}
    store.append(dict_element)
    return store


def info_dict(coordinates, filtering=None):
    connection = sqlite3.connect(_CONNECTION_PATH)
    shelters = []
    # coordinates = (33.65157, -117.83427)
    if filtering == "Women's Only":
        top_5 = _get_closest(coordinates, connection, filtering)
    elif filtering == "Domestic Violence":
        top_5 = _get_closest(coordinates, connection, filtering)
    else:
        top_5 = _get_closest(coordinates, connection)
    
    for locate in top_5:
        shelters = _store_location_info(connection, locate, shelters)

    connection.close()
    return shelters


def current_location(coordinates=location.access()):
    return coordinates


# coord = current_location((33.65157, -117.83427))
# a = info_dict(coord, "Domestic Violence")
# print(a)