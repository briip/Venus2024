from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route("/")
def map():
    return render_template('map.html')

@app.route('/', methods=["POST"])
def getdata():
    data_received = request.get_json()
    zipcode = data_received['zipcode']
    filter = data_received['filter']

    response_data = {'message': 'Data received successfully'}
    return jsonify(response_data)

def hello_world():  # put application's code here
    return 'Hello World!'


if __name__ == '__main':
    app.run()