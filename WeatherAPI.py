# AgriAngat-Project\AgriAngat-BackEnd\WeatherAPI.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import requests
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from typing import Dict
from ph_cities import CITY_CENTERS  # <-- import your dict

app = Flask(__name__)
CORS(app)  # Enable CORS for React Native

# Load environment variables
load_dotenv()
OWM_API_KEY = os.getenv("OWM_API_KEY")

_weather_cache = {}

@app.route('/api/weather/<city_name>', methods=['GET'])
def get_weather_api(city_name):
    """API endpoint to get weather data"""
    try:
        weather_data = get_weather(city_name, display_output=False)

        if "error" in weather_data:
            return jsonify({"error": weather_data["error"]}), 400

        # Also get forecast data
        forecast_data = _get_weather_forecast(city_name)

        response = {
            "current": weather_data,
            "forecast": forecast_data.get("forecast", []) if "error" not in forecast_data else []
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/weather', methods=['POST'])
def get_weather_post():
    """POST endpoint for weather data"""
    data = request.get_json()
    city_name = data.get('city', 'Manila')

    try:
        weather_data = get_weather(city_name, display_output=False)
        forecast_data = _get_weather_forecast(city_name)

        response = {
            "current": weather_data,
            "forecast": forecast_data.get("forecast", []) if "error" not in forecast_data else []
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_weather(city_name: str, display_output: bool = True):
    """Get weather data - minimal changes, only essential fields"""
    if city_name in _weather_cache:
        return _weather_cache[city_name]

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={OWM_API_KEY}&units=metric"
    try:
        resp = requests.get(url, timeout=20).json()
    except requests.RequestException as e:
        return {"error": f"Weather API request failed: {str(e)}"}

    if "main" not in resp:
        return {"error": "Weather API failed - invalid response"}

    ph_tz = timezone(timedelta(hours=8))
    dt_ph = datetime.fromtimestamp(resp["dt"], tz=ph_tz)

    # Only the 5 fields you need: temperature, condition, humidity, wind, rain_chance
    weather_data = {
        "temperature_c": resp["main"]["temp"],
        "description": resp["weather"][0]["description"],
        "humidity_pct": resp["main"]["humidity"],
        "wind_speed_kmh": resp.get("wind", {}).get("speed", 0) * 3.6,  # Convert to km/h
        "rain_chance": min(resp["main"]["humidity"], 100) if resp.get("rain", {}).get("1h", 0) > 0 else max(0, resp["main"]["humidity"] - 70),  # Rough estimate

        # Keep these for compatibility with your frontend
        "city": city_name.title(),
        "main_condition": resp["weather"][0]["main"],
        "timestamp": dt_ph.strftime('%Y-%m-%d %H:%M:%S %Z')
    }
    _weather_cache[city_name] = weather_data

    return weather_data

def _get_weather_forecast(city_name: str):
    """Get 2-day weather forecast - only condition and temperature"""
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city_name}&appid={OWM_API_KEY}&units=metric&cnt=16"  # Reduced from 24 to 16
    try:
        resp = requests.get(url, timeout=10).json()
        if "list" not in resp:
            return {"error": "Forecast API failed"}

        daily_forecast = {}

        for item in resp["list"]:
            dt = datetime.fromtimestamp(item["dt"])
            date_key = dt.strftime('%Y-%m-%d')

            if date_key not in daily_forecast:
                daily_forecast[date_key] = {
                    "temps": [],
                    "conditions": [],
                    "main_conditions": [],
                    "date_obj": dt
                }

            daily_forecast[date_key]["temps"].append(item["main"]["temp"])
            daily_forecast[date_key]["conditions"].append(item["weather"][0]["description"])
            daily_forecast[date_key]["main_conditions"].append(item["weather"][0]["main"])

        forecast_days = []

        # Only get next 2 days (skip today, get tomorrow and day after)
        sorted_dates = sorted(daily_forecast.keys())
        for i, date_key in enumerate(sorted_dates[1:3]):  # Skip first day (today), get next 2
            day_data = daily_forecast[date_key]
            most_common_condition = max(set(day_data["conditions"]), key=day_data["conditions"].count)
            most_common_main = max(set(day_data["main_conditions"]), key=day_data["main_conditions"].count)

            # Simple day naming
            if i == 0:
                day_name = day_data["date_obj"].strftime('%a')  # Tomorrow (e.g., "Thu")
            else:
                day_name = day_data["date_obj"].strftime('%a')  # Day after (e.g., "Fri")

            # Only condition and temperature range
            forecast_days.append({
                "day": day_name,
                "condition": most_common_condition.title(),
                "temp_min": min(day_data["temps"]),
                "temp_max": max(day_data["temps"]),
                "main_condition": most_common_main  # Keep for icon selection
            })

        return {"forecast": forecast_days}

    except Exception as e:
        return {"error": f"Forecast request failed: {str(e)}"}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)