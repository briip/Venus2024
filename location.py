import urllib.request
import json


_URL = 'https://geo.ipify.org/api/v2/country,city?apiKey=at_1sWg0U9lPFi4mgrc3CzTpw0ngaGOO&format=json'


def access():
    request = urllib.request.Request(_URL, data = None)
    response = urllib.request.urlopen(request)
    response_data = response.read()
    response.close()
    data = json.loads(response_data)
    return data['location']['lat'], data['location']['lng']


# data
# {
#     'ip': '169.234.95.85',
#     'location': {
#         'country': 'US',
#         'region': 'California',
#         'city': 'University Town Center',
#         'lat': 33.65157,
#         'lng': -117.83427,
#         'postalCode': '',
#         'timezone': '-07:00',
#         'geonameId': 12750393
#         },
#         'as': {
#             'asn': 299,
#             'name': 'UCINET-AS',
#             'route': '169.234.0.0/16',
#             'domain': 'https://www.uci.edu/',
#             'type': ''
#             },
#             'isp': 'UCI'
#             }


if __name__ == "__main__":
    data = access(URL)
    print(data)