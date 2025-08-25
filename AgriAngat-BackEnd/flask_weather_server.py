#!/usr/bin/env python3
"""
Flask Weather API Server
Serves weather and soil data to the React Native frontend
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from datetime import datetime
from dotenv import load_dotenv

# Import our existing weather and soil functions
from typing import Dict
import sys
import importlib.util

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for React Native

# Import our weather module
def load_weather_module():
    spec = importlib.util.spec_from_file_location("weather_api", "1_weatherAPI.py")
    weather_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(weather_module)
    return weather_module

# Import our soil module
def load_soil_module():
    spec = importlib.util.spec_from_file_location("soil_api", "2_soilAPI.py")
    soil_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(soil_module)
    return soil_module

# Import cities
def load_cities_module():
    spec = importlib.util.spec_from_file_location("ph_cities", "ph_cities.py")
    cities_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(cities_module)
    return cities_module

def generate_agricultural_tips(weather_data):
    """Generate agricultural tips based on weather conditions"""
    tips = []
    
    temperature = weather_data.get("temperature_c", 0)
    humidity = weather_data.get("humidity_pct", 0)
    rain_mm = weather_data.get("rain_mm", 0)
    wind_speed = weather_data.get("wind_speed", 0)
    description = weather_data.get("description", "").lower()
    
    # Temperature-based tips
    if temperature > 32:
        tips.append({
            "title": "High Temperature Advisory",
            "description": "Extremely high temperatures detected. Provide shade for livestock, increase watering frequency for crops, and avoid midday field work to prevent heat stress."
        })
    elif temperature < 15:
        tips.append({
            "title": "Low Temperature Advisory", 
            "description": "Cool temperatures may slow crop growth. Consider using row covers for sensitive plants and ensure livestock have adequate shelter."
        })
    
    # Humidity-based tips
    if humidity > 80:
        tips.append({
            "title": "High Humidity Warning",
            "description": "High humidity increases disease risk. Improve air circulation around plants, monitor for fungal infections, and avoid overhead watering."
        })
    elif humidity < 40:
        tips.append({
            "title": "Low Humidity Notice",
            "description": "Dry conditions require increased irrigation. Mulch around plants to retain moisture and monitor crops for water stress signs."
        })
    
    # Rain-based tips
    if rain_mm > 10:
        tips.append({
            "title": "Heavy Rainfall Advisory",
            "description": "Significant rainfall expected. Ensure proper drainage to prevent waterlogging, delay fertilizer application, and monitor for pest activity increase."
        })
    elif rain_mm > 0:
        tips.append({
            "title": "Light Rain Advisory",
            "description": "Light rainfall is beneficial for most crops. Good time for transplanting and outdoor activities, but monitor soil moisture levels."
        })
    
    # Wind-based tips
    if wind_speed > 25:
        tips.append({
            "title": "Strong Wind Warning",
            "description": "Strong winds detected. Secure loose structures, provide windbreaks for young plants, and postpone spraying applications."
        })
    
    # Weather condition specific tips
    if "rain" in description:
        tips.append({
            "title": "Rainy Weather Farming Tips",
            "description": "Rainy conditions are ideal for planting rice and other water-loving crops. Check drainage systems and monitor for slug and snail activity."
        })
    elif "sun" in description or "clear" in description:
        tips.append({
            "title": "Sunny Weather Opportunities", 
            "description": "Perfect weather for drying harvested crops, applying fertilizers, and conducting field maintenance. Ensure adequate irrigation."
        })
    elif "cloud" in description:
        tips.append({
            "title": "Cloudy Weather Guidance",
            "description": "Cloudy conditions reduce water evaporation. Adjust irrigation schedules and take advantage of cooler temperatures for fieldwork."
        })
    
    # General seasonal tips based on current conditions
    if temperature >= 25 and humidity >= 60:
        tips.append({
            "title": "Tropical Growing Conditions",
            "description": "Ideal conditions for tropical crops like banana, mango, and coconut. Monitor for increased pest activity and maintain good sanitation practices."
        })
    
    # If no specific tips generated, provide general advice
    if not tips:
        tips.append({
            "title": "General Farming Advice",
            "description": "Current weather conditions are moderate. Continue regular farm maintenance, monitor crop health, and maintain consistent irrigation schedules."
        })
    
    return tips

@app.route('/api/weather/<city_name>', methods=['GET'])
def get_weather_api(city_name):
    """API endpoint to get weather data for React Native"""
    try:
        # Load the weather module
        weather_module = load_weather_module()
        
        # Get weather data without display output
        weather_data = weather_module.get_weather(city_name, display_output=False)

        if "error" in weather_data:
            return jsonify({"success": False, "error": weather_data["error"]}), 400

        # Format the response for React Native
        formatted_response = {
            "success": True,
            "weatherData": {
                "location": weather_data.get("city", city_name.title()),
                "description": weather_data.get("description", "N/A"),
                "temperature": weather_data.get("temperature_c", 0),
                "humidity": weather_data.get("humidity_pct", 0),
                "windSpeed": weather_data.get("wind_speed", 0),
                "rainChance": min(weather_data.get("humidity_pct", 0), 100) if weather_data.get("rain_mm", 0) > 0 else max(0, weather_data.get("humidity_pct", 0) - 70),
                "coordinates": {
                    "lat": 0,  # We'll add coordinates if needed
                    "lon": 0
                }
            }
        }

        # Try to get forecast data
        try:
            forecast_data = weather_module._get_weather_forecast(city_name)
            if forecast_data and "forecast" in forecast_data and "error" not in forecast_data:
                formatted_forecast = []
                for i, day in enumerate(forecast_data["forecast"][:3]):
                    formatted_forecast.append({
                        "day": "Today" if i == 0 else day.get("date", f"Day {i+1}"),
                        "condition": day.get("condition", "N/A"),
                        "tempRange": f"{day.get('temp_min', 0):.0f}°C - {day.get('temp_max', 0):.0f}°C",
                        "icon": "rain" if "rain" in day.get("condition", "").lower() else "sun"
                    })
                formatted_response["weatherData"]["forecast"] = formatted_forecast
            else:
                # Default forecast if API fails
                formatted_response["weatherData"]["forecast"] = [
                    {"day": "Today", "condition": "Partly Cloudy", "tempRange": "26°C - 32°C", "icon": "sun"},
                    {"day": "Tomorrow", "condition": "Sunny", "tempRange": "24°C - 30°C", "icon": "sun"},
                    {"day": "Day 3", "condition": "Cloudy", "tempRange": "23°C - 29°C", "icon": "sun"}
                ]
        except Exception as e:
            print(f"Forecast error: {e}")
            # Provide default forecast
            formatted_response["weatherData"]["forecast"] = [
                {"day": "Today", "condition": "Partly Cloudy", "tempRange": "26°C - 32°C", "icon": "sun"},
                {"day": "Tomorrow", "condition": "Sunny", "tempRange": "24°C - 30°C", "icon": "sun"},
                {"day": "Day 3", "condition": "Cloudy", "tempRange": "23°C - 29°C", "icon": "sun"}
            ]

        # Add agricultural tips based on weather conditions
        formatted_response["weatherData"]["tips"] = generate_agricultural_tips(weather_data)

        return jsonify(formatted_response)

    except Exception as e:
        return jsonify({"success": False, "error": f"Weather service error: {str(e)}"}), 500

@app.route('/api/soil/<city_name>', methods=['GET'])
def get_soil_api(city_name):
    """API endpoint to get soil data for React Native"""
    try:
        # Load required modules
        soil_module = load_soil_module()
        cities_module = load_cities_module()
        
        # Get city coordinates
        city_lower = city_name.lower()
        if city_lower not in cities_module.CITY_CENTERS:
            return jsonify({"success": False, "error": f"City '{city_name}' not found in database"}), 400
        
        lat, lon = cities_module.CITY_CENTERS[city_lower]
        
        # Create soil extractor instance
        extractor = soil_module.SoilGridsExtractor()
        
        # Get agricultural summary
        soil_summary = extractor.get_agricultural_summary(lat, lon)
        
        if "error" in soil_summary:
            return jsonify({"success": False, "error": soil_summary["error"]}), 400
        
        # Format the response for React Native
        soil_props = soil_summary.get("soil_properties", {})
        
        formatted_data = {
            "success": True,
            "city": city_name.title(),
            "coordinates": {"latitude": lat, "longitude": lon},
            "soilData": {}
        }
        
        # Format key soil properties for display
        key_properties = {
            "phh2o": "pH Level",
            "soc": "Organic Carbon",
            "nitrogen": "Nitrogen Content", 
            "clay": "Clay Content",
            "sand": "Sand Content",
            "silt": "Silt Content",
            "cec": "Nutrient Capacity"
        }
        
        for prop_key, display_name in key_properties.items():
            if prop_key in soil_props and soil_props[prop_key]["mean"] is not None:
                value = soil_props[prop_key]["mean"]
                unit = soil_props[prop_key]["unit"]
                
                # Format the value appropriately
                if isinstance(value, float):
                    formatted_value = f"{value:.1f} {unit}"
                else:
                    formatted_value = f"{value} {unit}"
                
                formatted_data["soilData"][display_name] = formatted_value
        
        return jsonify(formatted_data)
        
    except Exception as e:
        return jsonify({"success": False, "error": f"Soil service error: {str(e)}"}), 500

@app.route('/api/cities', methods=['GET'])
def get_cities_api():
    """API endpoint to get list of available cities"""
    try:
        cities_module = load_cities_module()
        
        # Get all cities and format for frontend
        cities = []
        for city_name in cities_module.CITY_CENTERS.keys():
            # Format city name for display (title case)
            formatted_name = city_name.replace('_', ' ').title()
            
            # Get coordinates
            lat, lon = cities_module.CITY_CENTERS[city_name]
            
            cities.append({
                "name": formatted_name,
                "key": city_name,
                "coordinates": {
                    "latitude": lat,
                    "longitude": lon
                }
            })
        
        # Sort cities alphabetically
        cities.sort(key=lambda x: x["name"])
        
        return jsonify({
            "success": True,
            "cities": cities,
            "count": len(cities)
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": f"Cities service error: {str(e)}"}), 500

@app.route('/api/city-from-coords', methods=['GET'])
def get_city_from_coords():
    """API endpoint to get nearest city from coordinates"""
    try:
        lat = float(request.args.get('lat', 0))
        lon = float(request.args.get('lon', 0))
        
        cities_module = load_cities_module()
        
        # Find nearest city (simple distance calculation)
        nearest_city = None
        min_distance = float('inf')
        
        for city_name, (city_lat, city_lon) in cities_module.CITY_CENTERS.items():
            # Simple distance calculation
            distance = ((lat - city_lat) ** 2 + (lon - city_lon) ** 2) ** 0.5
            if distance < min_distance:
                min_distance = distance
                nearest_city = city_name
        
        if nearest_city:
            formatted_name = nearest_city.replace('_', ' ').title()
            return jsonify({
                "success": True,
                "city": formatted_name,
                "distance": min_distance,
                "coordinates": {
                    "latitude": cities_module.CITY_CENTERS[nearest_city][0],
                    "longitude": cities_module.CITY_CENTERS[nearest_city][1]
                }
            })
        else:
            return jsonify({"success": False, "error": "No nearby city found"}), 404
            
    except Exception as e:
        return jsonify({"success": False, "error": f"City lookup error: {str(e)}"}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({ 
        "status": "ok", 
        "service": "AgriAngat Weather API (Flask)",
        "timestamp": datetime.now().isoformat() 
    })

@app.route('/', methods=['GET'])
def index():
    """Root endpoint"""
    return jsonify({
        "message": "AgriAngat Weather API Server",
        "version": "1.0.0",
        "endpoints": [
            "GET /api/weather/<city_name>",
            "GET /api/soil/<city_name>", 
            "GET /api/cities",
            "GET /health"
        ]
    })

if __name__ == '__main__':
    print("🌤️  Starting AgriAngat Flask Weather Server...")
    print("📡 Available endpoints:")
    print("  GET /api/weather/<city_name>")
    print("  GET /api/soil/<city_name>")
    print("  GET /api/cities")
    print("  GET /health")
    print(f"🌐 Server will run on http://localhost:5000")
    print("=" * 50)
    
    # Run Flask server
    app.run(host='0.0.0.0', port=5000, debug=True)
