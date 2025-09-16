#!/usr/bin/env python3
"""
Flask Weather API Server using OpenWeatherMap API
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import os
import requests
from ph_cities import CITY_CENTERS

app = Flask(__name__)
CORS(app)  # Enable CORS for React Native

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

OWM_API_KEY = os.getenv('OWM_API_KEY')
OWM_BASE_URL = "http://api.openweathermap.org/data/2.5"

def get_agricultural_assessment(temp, humidity, wind_speed, rain_chance, condition):
    """Generate agricultural weather assessment based on weather conditions"""
    tips = []
    
    # Temperature assessment
    if temp < 20:
        tips.append({
            "title": "Cool Temperature Alert",
            "description": f"Temperature is {temp}°C. Consider protecting sensitive crops from cold. Good for cool-season vegetables like lettuce, cabbage, and peas."
        })
    elif 20 <= temp <= 30:
        tips.append({
            "title": "Optimal Growing Conditions",
            "description": f"Temperature is {temp}°C - ideal for most tropical crops. Perfect for rice, corn, and most vegetables. Monitor soil moisture regularly."
        })
    else:
        tips.append({
            "title": "High Temperature Warning",
            "description": f"Temperature is {temp}°C. Ensure adequate irrigation and shade for crops. Heat-stress resistant varieties recommended."
        })
    
    # Humidity assessment
    if humidity > 80:
        tips.append({
            "title": "High Humidity Alert",
            "description": f"Humidity is {humidity}%. Watch for fungal diseases. Ensure good air circulation and consider fungicide application if needed."
        })
    elif humidity < 40:
        tips.append({
            "title": "Low Humidity Notice",
            "description": f"Humidity is {humidity}%. Increase irrigation frequency. Consider mulching to retain soil moisture."
        })
    else:
        tips.append({
            "title": "Good Humidity Levels",
            "description": f"Humidity is {humidity}% - favorable for most crops. Maintain current watering schedule."
        })
    
    # Wind assessment
    if wind_speed > 15:
        tips.append({
            "title": "Strong Wind Warning",
            "description": f"Wind speed is {wind_speed} km/h. Secure young plants and provide windbreaks for tall crops like corn and banana."
        })
    
    # Rain assessment
    if rain_chance > 70:
        tips.append({
            "title": "High Rain Probability",
            "description": f"{rain_chance}% chance of rain. Delay pesticide application. Ensure proper drainage to prevent waterlogging."
        })
    elif rain_chance < 20:
        tips.append({
            "title": "Low Rain Probability",
            "description": f"Only {rain_chance}% chance of rain. Plan irrigation schedule. Check soil moisture levels regularly."
        })
    
    return tips

def get_city_coordinates(city_name):
    """Get coordinates for a city from ph_cities.py"""
    city_key = city_name.lower()
    if city_key in CITY_CENTERS:
        lat, lon = CITY_CENTERS[city_key]
        return lat, lon
    return None, None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({ 
        "status": "ok", 
        "service": "AgriAngat Weather API (Flask)",
        "timestamp": datetime.now().isoformat() 
    })

@app.route('/api/weather/<city_name>', methods=['GET'])
def get_weather_api(city_name):
    """API endpoint to get weather data for React Native using OpenWeatherMap"""
    try:
        print(f"🌤️ Weather API request for: {city_name}")
        
        if not OWM_API_KEY:
            raise Exception("OpenWeatherMap API key not found")
        
        # Get coordinates for the city
        lat, lon = get_city_coordinates(city_name)
        if lat is None or lon is None:
            # Fallback: use OpenWeatherMap's city search
            geocoding_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city_name},PH&limit=1&appid={OWM_API_KEY}"
            geo_response = requests.get(geocoding_url)
            if geo_response.status_code == 200:
                geo_data = geo_response.json()
                if geo_data:
                    lat, lon = geo_data[0]['lat'], geo_data[0]['lon']
                else:
                    raise Exception(f"City '{city_name}' not found")
            else:
                raise Exception("Geocoding service unavailable")
        
        # Get current weather
        current_url = f"{OWM_BASE_URL}/weather?lat={lat}&lon={lon}&appid={OWM_API_KEY}&units=metric"
        current_response = requests.get(current_url)
        
        if current_response.status_code != 200:
            raise Exception(f"Weather API error: {current_response.status_code}")
        
        current_data = current_response.json()
        
        # Get 5-day forecast
        forecast_url = f"{OWM_BASE_URL}/forecast?lat={lat}&lon={lon}&appid={OWM_API_KEY}&units=metric"
        forecast_response = requests.get(forecast_url)
        
        forecast_data = []
        if forecast_response.status_code == 200:
            forecast_json = forecast_response.json()
            # Get next 3 days (skip today, take tomorrow and next 2 days)
            daily_forecasts = {}
            for item in forecast_json['list'][:24]:  # Next 24 entries (3 hours each = 72 hours)
                date = datetime.fromtimestamp(item['dt']).strftime('%Y-%m-%d')
                if date not in daily_forecasts:
                    daily_forecasts[date] = {
                        'temp_min': item['main']['temp_min'],
                        'temp_max': item['main']['temp_max'],
                        'condition': item['weather'][0]['description'].title(),
                        'icon': 'rain' if 'rain' in item['weather'][0]['main'].lower() else 'sun'
                    }
                else:
                    daily_forecasts[date]['temp_min'] = min(daily_forecasts[date]['temp_min'], item['main']['temp_min'])
                    daily_forecasts[date]['temp_max'] = max(daily_forecasts[date]['temp_max'], item['main']['temp_max'])
            
            # Convert to forecast format (skip today, take next 3 days)
            dates = sorted(daily_forecasts.keys())[1:4]  # Skip today, get next 3 days
            for i, date in enumerate(dates):
                if i < 3:  # Limit to 3 days
                    day_data = daily_forecasts[date]
                    forecast_data.append({
                        "day": f"Day {i+1}",
                        "condition": day_data['condition'],
                        "tempRange": f"{int(day_data['temp_min'])}°C - {int(day_data['temp_max'])}°C",
                        "icon": day_data['icon']
                    })
        
        # Extract weather information
        temperature = round(current_data['main']['temp'])
        humidity = current_data['main']['humidity']
        wind_speed = round(current_data['wind']['speed'] * 3.6)  # Convert m/s to km/h
        condition = current_data['weather'][0]['description'].title()
        
        # Calculate rain chance from cloudiness and weather condition
        rain_chance = 0
        if 'rain' in current_data:
            rain_chance = 80
        elif current_data['clouds']['all'] > 80:
            rain_chance = 60
        elif current_data['clouds']['all'] > 50:
            rain_chance = 30
        else:
            rain_chance = 10
        
        # Generate agricultural assessment
        agricultural_tips = get_agricultural_assessment(temperature, humidity, wind_speed, rain_chance, condition)
        
        weather_response = {
            "success": True,
            "weatherData": {
                "location": city_name.title(),
                "description": condition,
                "temperature": temperature,
                "humidity": humidity,
                "windSpeed": wind_speed,
                "rainChance": rain_chance,
                "coordinates": {
                    "lat": lat,
                    "lon": lon
                },
                "forecast": forecast_data,
                "tips": agricultural_tips
            }
        }
        
        print(f"✅ Returning real weather data for {city_name}: {temperature}°C, {condition}")
        return jsonify(weather_response)

    except Exception as e:
        print(f"❌ Weather API Exception: {str(e)}")
        return jsonify({"success": False, "error": f"Weather service error: {str(e)}"}), 500

@app.route('/api/soil/<city_name>', methods=['GET'])
def get_soil_api(city_name):
    """API endpoint to get soil data for React Native - MOCK DATA"""
    try:
        print(f"🌱 Soil API request for: {city_name}")
        
        # City-specific soil data
        city_soil_data = {
            'manila': {
                "pH Level": "6.2", "Organic Carbon": "18.5 g/kg", 
                "Clay Content": "35%", "Sand Content": "25%"
            },
            'cebu city': {
                "pH Level": "6.8", "Organic Carbon": "22.1 g/kg", 
                "Clay Content": "28%", "Sand Content": "32%"
            },
            'davao city': {
                "pH Level": "6.5", "Organic Carbon": "24.8 g/kg", 
                "Clay Content": "30%", "Sand Content": "28%"
            },
            'baguio': {
                "pH Level": "5.9", "Organic Carbon": "31.2 g/kg", 
                "Clay Content": "42%", "Sand Content": "18%"
            },
            'iloilo city': {
                "pH Level": "6.4", "Organic Carbon": "20.3 g/kg", 
                "Clay Content": "33%", "Sand Content": "26%"
            }
        }
        
        # Get city-specific soil data or default
        city_key = city_name.lower()
        soil_info = city_soil_data.get(city_key, {
            "pH Level": "6.3", "Organic Carbon": "19.5 g/kg", 
            "Clay Content": "32%", "Sand Content": "27%"
        })
        
        # Mock soil data
        mock_soil_data = {
            "success": True,
            "city": city_name.title(),
            "coordinates": {"latitude": 14.5995, "longitude": 120.9842},
            "soilData": soil_info
        }
        
        print(f"✅ Returning soil data for {city_name}: pH {soil_info['pH Level']}")
        return jsonify(mock_soil_data)
        
    except Exception as e:
        print(f"❌ Soil API Exception: {str(e)}")
        return jsonify({"success": False, "error": f"Soil service error: {str(e)}"}), 500

@app.route('/api/cities', methods=['GET'])
def get_cities_api():
    """API endpoint to get list of available Philippine cities"""
    try:
        print("🏙️ Cities API request")
        
        # Convert CITY_CENTERS to API format
        cities_list = []
        for city_name, coords in CITY_CENTERS.items():
            cities_list.append({
                "name": city_name.title(),
                "key": city_name.lower().replace(" ", "_"),
                "coordinates": {
                    "latitude": coords[0],
                    "longitude": coords[1]
                }
            })
        
        # Sort cities alphabetically
        cities_list.sort(key=lambda x: x["name"])
        
        cities_response = {
            "success": True,
            "cities": cities_list,
            "count": len(cities_list)
        }
        
        print(f"✅ Returning {len(cities_list)} Philippine cities")
        return jsonify(cities_response)
        
    except Exception as e:
        print(f"❌ Cities API Exception: {str(e)}")
        return jsonify({"success": False, "error": f"Cities service error: {str(e)}"}), 500

@app.route('/api/city-from-coords', methods=['GET'])
def get_city_from_coords():
    """API endpoint to get nearest city from coordinates - MOCK DATA"""
    try:
        lat = float(request.args.get('lat', 14.5995))
        lon = float(request.args.get('lon', 120.9842))
        
        print(f"📍 City lookup for coordinates: {lat}, {lon}")
        
        # Mock response - always return Manila for simplicity
        mock_response = {
            "success": True,
            "city": "Manila",
            "distance": 0.1,
            "coordinates": {
                "latitude": 14.5995,
                "longitude": 120.9842
            }
        }
        
        print("✅ Returning city lookup data")
        return jsonify(mock_response)
            
    except Exception as e:
        print(f"❌ City Lookup Exception: {str(e)}")
        return jsonify({"success": False, "error": f"City lookup error: {str(e)}"}), 500

@app.route('/', methods=['GET'])
def index():
    """Root endpoint"""
    return jsonify({
        "message": "AgriAngat Weather API Server - Real Weather Data",
        "version": "2.0.0",
        "endpoints": [
            "GET /api/weather/<city_name>",
            "GET /api/soil/<city_name>", 
            "GET /api/cities",
            "GET /health"
        ],
        "data_source": "OpenWeatherMap API + Philippine Cities Database",
        "note": "Provides real-time weather data and agricultural assessments."
    })

if __name__ == '__main__':
    print("🌤️  Starting AgriAngat Weather API Server - REAL DATA VERSION...")
    print("📡 Available endpoints:")
    print("  GET /api/weather/<city_name> (OpenWeatherMap API)")
    print("  GET /api/soil/<city_name> (Agricultural Data)")
    print("  GET /api/cities (Philippine Cities)")
    print("  GET /health")
    print("🌐 Server will run on http://localhost:5000")
    print("📊 Using OpenWeatherMap API for real weather data")
    print("=" * 60)
    
    # Run Flask server
    app.run(host='0.0.0.0', port=5000, debug=True)
