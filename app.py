from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

OPENWEATHER_API_KEY = '57c11ffeea6edd131476d615acac6b05'
LOCATIONIQ_API_KEY = 'pk.b0e35fc18286a3fb97648cd36cc1fc51'  # <-- Replace with your actual LocationIQ key

@app.route('/', methods=['GET', 'POST'])

def index():
    weather = None
    lat = 28.6139  # Default: Delhi
    lon = 77.2090

    if request.method == 'POST':
        city = request.form.get('city')
        if city:
            geo_url = f'https://us1.locationiq.com/v1/search.php?key={LOCATIONIQ_API_KEY}&q={city}&format=json&limit=1'
            geo_resp = requests.get(geo_url, timeout=10)
            print("GEO API RESPONSE:", geo_resp.text)  # <-- right after request!
            if geo_resp.status_code == 200 and geo_resp.json():
                searched = geo_resp.json()[0]
                lat = float(searched['lat'])
                lon = float(searched['lon'])
                city_disp = searched['display_name']
                url = f'http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric'
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    weather_conditions = [w['main'].lower() for w in data['weather']]
                    is_raining = 'rain' in weather_conditions or 'rain' in data
                    weather = {
                        'city': city_disp,
                        'temp': data['main']['temp'],
                        'description': data['weather'][0]['description'],
                        'rain': is_raining,
                    }
                else:
                    weather = {'error': 'Could not load weather.'}
            else:
                weather = {'error': 'Location not found.'}
        else:
            weather = {'error': 'Please enter a location.'}

    return render_template('index.html', weather=weather, lat=lat, lon=lon,
                          api_key=OPENWEATHER_API_KEY, lociq_key=LOCATIONIQ_API_KEY)

@app.route('/get_road_weather', methods=['POST'])
def get_road_weather():
    data = request.get_json()
    lat = data['lat']
    lon = data['lon']
    roads = get_major_roads(lat, lon)
    road_weather = []
    for road in roads:
        rain_status = check_rain_at_coordinates(road['lat'], road['lon'])
        road_weather.append({
            'coordinates': road['coordinates'],
            'name': road.get('name', 'Unnamed Road'),
            'is_raining': rain_status
        })
    return jsonify(road_weather)

@app.route('/point_weather')
def point_weather():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    if not lat or not lon:
        return jsonify({"error": "Missing coordinates"}), 400
    url = f'http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric'
    resp = requests.get(url, timeout=10)
    if resp.status_code != 200:
        return jsonify({"error": "Weather unavailable"}), 404
    data = resp.json()
    desc = data['weather'][0]['description'].capitalize()
    rain_level = data.get('rain', {}).get('1h', 0) or data.get('rain', {}).get('3h', 0) or 0
    if rain_level > 6:
        rain_desc = "<span style='color:#1565c0'><b>Heavy Rain</b></span>"
    elif rain_level > 1.5:
        rain_desc = "<span style='color:#1976d2'><b>Moderate Rain</b></span>"
    elif rain_level > 0.01:
        rain_desc = "<span style='color:#64b5f6'><b>Light Rain</b></span>"
    else:
        rain_desc = None
    return jsonify({
        "temp": round(data['main']['temp'], 1),
        "desc": desc,
        "rain_desc": rain_desc
    })


@app.route('/autocomplete')
def autocomplete():
    query = request.args.get('q', '')
    if not query or len(query) < 2:
        return jsonify([])
    url = "https://api.locationiq.com/v1/autocomplete.php"
    params = {
        "key": LOCATIONIQ_API_KEY,
        "q": query,
        "limit": 5,
        "countrycodes": "in",
        "format": "json"
    }
    try:
        resp = requests.get(url, params=params, timeout=5)
        suggestions = []
        if resp.status_code == 200:
            for item in resp.json():
                suggestions.append({
                    "label": item["display_name"],
                    "value": item["display_name"]
                })
                print("Autocomplete API response:", resp.text)


        return jsonify(suggestions)
    except Exception as e:
        print(f"Autocomplete error: {e}")
        return jsonify([])


def get_major_roads(lat, lon, radius=0.02):
    overpass_url = "http://overpass-api.de/api/interpreter"
    overpass_query = f"""
    [out:json];
    (
      way["highway"~"^(motorway|trunk|primary|secondary)$"]({lat-radius},{lon-radius},{lat+radius},{lon+radius});
    );
    out geom;
    """
    try:
        response = requests.post(overpass_url, data=overpass_query, timeout=30)
        if response.status_code == 200:
            data = response.json()
            roads = []
            for element in data.get('elements', []):
                if element['type'] == 'way' and 'geometry' in element:
                    coordinates = [[node['lat'], node['lon']] for node in element['geometry']]
                    if coordinates:
                        mid_idx = len(coordinates) // 2
                        roads.append({
                            'coordinates': coordinates,
                            'lat': coordinates[mid_idx][0],
                            'lon': coordinates[mid_idx][1],
                            'name': element.get('tags', {}).get('name', 'Unnamed Road')
                        })
            return roads[:10]
    except Exception as e:
        print(f"Error fetching roads: {e}")
    return []


def check_rain_at_coordinates(lat, lon):
    try:
        url = f'http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric'
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            weather_conditions = [w['main'].lower() for w in data['weather']]
            return 'rain' in weather_conditions or 'rain' in data
    except Exception as e:
        print(f"Error checking weather: {e}")
    return False


if __name__ == '__main__':
    app.run(debug=True)