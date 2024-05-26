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

    if zipcode:
        coord = shelters.current_location(zipcode)
    else:
        coord = shelters.current_location()
    response_data = shelters.info_dict(coord, filter)
    return jsonify(response_data')

@app.route('/index.html')
def home():
    return render_template("index.html")

@app.route('/')
def start_screen():
    return render_template("index.html")


def hello_world():  # put application's code here
    return 'Hello World!'


if __name__ == '__main__':
    app.run(debug=True)