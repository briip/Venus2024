import sqlite3
from collections import namedtuple
import math


Distance = namedtuple("Distance", ['x', 'y', 'euclidean distance'])
CONNECTION_PATH = "c:/Coding/ICS 33/airport.db"


def calculate_distance(lat: int, long: int, distance, coordinates) -> Distance:
    # get all the addresses
    # euclidean distance and then api if there's time
    x_coord = coordinates[0]
    y_coord = coordinates[1]
    edist = math.sqrt((lat - x_coord)**2 + (long - y_coord)**2)
    if distance is None:
        return Distance(lat, long, edist)
    elif edist < distance[-1]:
        return Distance(lat, long, edist)
    else:
        return distance


def get_x_y_list(connection: sqlite3.Connection, table_name):
    get_x = f"SELECT latitude FROM {table_name}"
    get_y = f"SELECT longitude FROM {table_name}"

    cursor = connection.execute(get_x)
    x = cursor.fetchall()
    cursor.close()

    cursor = connection.execute(get_y)
    y = cursor.fetchall()
    cursor.close()

    return x, y


def closest_five(top: list[Distance], distance: Distance) -> list:
    if len(top) >= 5:
        dists = [dist[-1] for dist in top]
        max_dist = max(dists)
        if max_dist > distance[-1]:
            del_ind = dists.index(max_dist)
            top.pop(del_ind)
    top.append(distance)
    return top


def location(location_info):
    name = location_info[9]
    phys_address = ', '.join(location_info[10:14])
    hours = location_info[15]
    phone = location_info[16]
    email = location_info[17]
    desc = location_info[-3]

    return name, phys_address, hours, phone, email, desc


def get_closest(coordinates: tuple, connection: sqlite3.Connection, table_name: str):
    """Gets the top 5 closest locations to current location."""
    x, y = get_x_y_list(connection, table_name)

    top_5 = []
    distance = None
    for lat in x:
        ind = x.index(lat)
        distance = calculate_distance(lat, y[ind], distance, coordinates)
        top_5 = closest_five(top_5, distance)

    return top_5


def store_location_info(connection: sqlite3.Connection, table_name, distance: Distance, store: list):
    command = f"SELECT * FROM {table_name} WHERE latitude = {distance[0]} AND longitude = {distance[1]};"
    cursor = connection.execute(command)
    location_info = cursor.fetchall()

    name, phys_address, hours, phone, email, desc = location(location_info)
    
    dict_element = {"name": name, "address": phys_address, "hours": hours, "phone": phone, "email": email, "description": desc}
    store.append(dict_element)
    return store


def main():
    connection = sqlite3.connect(CONNECTION_PATH)
    coordinates = None # get it from input
    table_name = "Placeholder"
    shelters = []
    top_5 = get_closest(coordinates, connection, table_name)
    for locate in top_5:
        shelters = store_location_info(connection, table_name, locate, shelters)

    connection.close()