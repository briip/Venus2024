import sqlite3
from collections import namedtuple
import math
import location


Distance = namedtuple("Distance", ['x', 'y', 'euclidean_distance'])
_CONNECTION_PATH = "c:/Coding/VenusHacks2024/Venus2024/Persephone.db"


def _calculate_distance(lat: int, long: int, distance, coordinates) -> Distance:
    # get all the addresses
    # euclidean distance and then api if there's time
    x_coord = coordinates[0]
    y_coord = coordinates[1]
    edist = math.sqrt((lat - x_coord)**2 + (long - y_coord)**2)
    return Distance(lat, long, edist)


def _get_x_y_list(connection: sqlite3.Connection):
    get_x = "SELECT latitude FROM Shelter"
    get_y = "SELECT longitude FROM Shelter"

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
    desc = location_info[-3]

    return name, phys_address, hours, phone, email, desc


def _get_closest(coordinates: tuple, connection: sqlite3.Connection):
    """Gets the top 5 closest locations to current location."""
    x, y = _get_x_y_list(connection)
    # print(x)
    top_5 = []
    distance = None
    for lat in x:
        ind = x.index(lat)
        distance = _calculate_distance(lat[0], y[ind][0], distance, coordinates)
        top_5 = _closest_five(top_5, distance)

    return top_5


def _store_location_info(connection: sqlite3.Connection, distance: Distance, store: list):
    command = f"SELECT * FROM Shelter WHERE latitude = {distance[0]} AND longitude = {distance[1]};"
    cursor = connection.execute(command)
    location_info = cursor.fetchall()

    name, phys_address, hours, phone, email, desc = _extract_location_info(location_info[0])
    
    dict_element = {"name": name, "address": phys_address, "hours": hours, "phone": phone,
                    "email": email, "description": desc}
    store.append(dict_element)
    return store


def info_dict():
    connection = sqlite3.connect(_CONNECTION_PATH)
    shelters = []
    coordinates = location.access()
    # print(coordinates)
    # coordinates = (33.65157, -117.83427)
    top_5 = _get_closest(coordinates, connection)
    for locate in top_5:
        shelters = _store_location_info(connection, locate, shelters)

    connection.close()
    return shelters
