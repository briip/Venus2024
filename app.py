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
    locations_from_py = [
        {'name': "LET ME IN PLEASE", 'address': '13305 Penn St, NULL, Whittier, CA',
         'hours': 'Administrative (562) 945-3937,  Service/Intake and Hotline (562) 945-3939', 'phone': 'NULL',
         'email': 'NULL',
         'description': 'The agency provides domestic violence services for low-income victims of intimate partner domestic violence and their children from all areas of Los Angeles County.',
         'zipcode': '90602', 'latitude': 33.97583807, 'longitude': -118.0335874},
        {'name': 'Homeless Shelter For Women And Children', 'address': '4513 E. Compton Blvd., NULL, Compton, CA',
         'hours': 'NULL', 'phone': 'NULL', 'email': 'www.cwroshelter.org',
         'description': 'The Agency Provides Shelter For Homeless Single Women And Women With Children Who Are In Los Angeles County.  The Shelter May Assist Women Who Have Mental/Emotional Problems; The Shelter Is Also Accessible For Women Who Use Wheelchairs.',
         'zipcode': '90221', 'latitude': 33.89643599, 'longitude': -118.1927356},
        {'name': 'Womenshelter Of Long Beach', 'address': '930 Pacific Ave., NULL, Long Beach, CA',
         'hours': 'Service/Intake and Administration (562) 437-7233,  FAX (562) 436-4943, 562) HER HOME - 24 hrs. Service/Intake and Hotline (562) 437-4663',
         'phone': 'NULL', 'email': 'www.womenshelterlb.com/',
         'description': 'The agency provides shelter and domestic violence services for victims of domestic violence and their children as well as volunteer opportunities for individuals living in Los Angeles County.',
         'zipcode': '90813', 'latitude': 33.778375, 'longitude': -118.1933},
        {'name': 'Interval House',
         'address': '6615 E. Pacific Coast Highway, Outreach Office| Suite 170, Long Beach, CA',
         'hours': 'Administrative (562) 594-9492, L A County - 24 hours Service/Intake and Hotline (562) 594-4555',
         'phone': 'NULL',
         'email': 'www.intervalhouse.org',
         'description': "This agency provides domestic violence services, a battered women's shelter for battered women and their children and welfare-to-work support services to battered women who receive CalWORKs and live primarily in the Long Beach and the surrounding areas.",
         'zipcode': '90803', 'latitude': 33.755173,
         'longitude': -118.108203},
        {'name': 'Doors Of Hope', 'address': '529 Broad Ave, NULL, Wilmington, CA',
         'hours': 'Service/Intake and Administration (310) 518-3667,  FAX (310) 513-6113', 'phone': 'NULL',
         'email': 'www.doorsofhopewomensshelter.org',
         'description': 'The agency provides shelter for single women in Los Angeles County.', 'zipcode': '90744',
         'latitude': 33.7766381, 'longitude': -118.2610311}]


    data_received = request.get_json()
    zipcode = data_received['zipcode']
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
    app.run(port=5003, debug=True)


