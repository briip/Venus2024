import sqlite3


def filter_womens(connection: sqlite3.Connection):
    desc = " women "
    notin = " men "
    get_desc = "SELECT description FROM Shelter"
    cursor = connection.execute(get_desc)
    descs = cursor.fetchall()
    cursor.close()

    womens_only = []

    for d in descs:
        if d == ('description', ):
            continue
        if desc in d[0] and notin not in d[0]:
            if desc not in womens_only:
                womens_only.append(d[0])

    return womens_only


def filter_dv(connection: sqlite3.Connection):
    desc = "domestic "
    get_desc = "SELECT description FROM Shelter"
    cursor = connection.execute(get_desc)
    descs = cursor.fetchall()
    cursor.close()

    dv_only = []

    for d in descs:
        if desc in d[0]:
            if desc not in dv_only:
                dv_only.append(d[0])

    return dv_only


def create_desc_param(desc):
    return f"WHERE description = {desc}"