from flask import Flask, request, jsonify, render_template
import shelters

app = Flask(__name__)

@app.route("/map.html")
def map():
    return render_template('map.html')

@app.route('/', methods=["POST"])
def getdata():
    data_received = request.get_json()
    zipcode = data_received['zipcode']
    filter = data_received['filter']

    coord = shelters.coordinates(zipcode)
    response_data = shelters.info_dict(coord, filter)[0]
    return jsonify(response_data)

@app.route('/index.html')
def home():
    return render_template("index.html")

@app.route('/')
def start_screen():
    return render_template("index.html")


"""
@app.route('/')
def sdkfj():
    connection = get_connection()
    [dictniary] = get_info()
    locations = [[name, lat, lng], [name, lat, lng]] == sdlkfj()

"""


def hello_world():  # put application's code here
    return 'Hello World!'


if __name__ == '__main__':
    app.run()