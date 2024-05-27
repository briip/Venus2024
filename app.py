from flask import Flask, request, jsonify, render_template, Response
import shelters
import json

app = Flask(__name__)


@app.route("/map.html")
def map():
    print("wassup")
    return render_template('map.html')


@app.route('/', methods=["POST"])
def getdata():
    default_locations = [
        {'name': "LET ME IN PLEASE", 'address': '13305 Penn St, NULL, Whittier, CA',
         'hours': 'Administrative (562) 945-3937,  Service/Intake and Hotline (562) 945-3939', 'phone': 'NULL',
         'email': 'NULL',
         'description': 'The agency provides domestic violence services for low-income victims of intimate partner domestic violence and their children from all areas of Los Angeles County.',
         'zipcode': '90602', 'latitude': 33.97583807, 'longitude': -118.0335874}]

    data_received = request.get_json()
    zipcode = int(data_received['zipcode'])
    # filter = data_received['filter']
    print("hello")
    print("zipcode")
    print(zipcode)
    '''
    if zipcode:
        coord = shelters.current_location(zipcode)
    else:
        coord = shelters.current_location()
    response_data = shelters.info_dict(coord, filter)
    '''
    print("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")

    # print(shelters.info_dict(90013))

    locations_from_py = shelters.info_dict(zipcode)
    print(locations_from_py)
    print("\n\n\n\n\n\n")
    if zipcode == 90013:
        print("the zipcode is working")
    else:
        print(type(zipcode))
        print("the zipcode is NOT working")

    if type(locations_from_py) == type(default_locations):
        print("default and grabbed are the same type")
    else:
        print("default and grabbed are NOT the same type")
        print("type of default:", default_locations)
        print("type of grabbed:", locations_from_py)
    print("\n\n\n\n\n\n")

    print("oooooooooooooooooooooooooooooooooooooooooooooooooooooooo")
    return jsonify(locations_from_py)


@app.route('/index.html')
def home():
    return render_template("index.html")


@app.route('/')
def start_screen():
    return render_template("index.html")


def hello_world():  # put application's code here
    return 'Hello World!'


if __name__ == '__main__':
    app.run(port=5005, debug=True)
