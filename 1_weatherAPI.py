import os
import requests
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from typing import Dict
from ph_cities import CITY_CENTERS  # <-- import your dict

# -----------------------------
# CONFIG
# -----------------------------
load_dotenv()  # Load .env file

OWM_API_KEY = os.getenv("OWM_API_KEY")  # pulled from .env

_weather_cache = {}

def get_weather(city_name: str, display_output: bool = True):
    """Get weather data with optional detailed output display"""
    if city_name in _weather_cache:
        if display_output:
            _display_weather_analysis(_weather_cache[city_name], city_name)
        return _weather_cache[city_name]

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={OWM_API_KEY}&units=metric"
    try:
        resp = requests.get(url, timeout=10).json()
    except requests.RequestException as e:
        error_data = {"error": f"Weather API request failed: {str(e)}"}
        if display_output:
            print(f"❌ Weather data unavailable: {error_data['error']}")
        return error_data

    if "main" not in resp:
        error_data = {"error": "Weather API failed - invalid response"}
        if display_output:
            print(f"❌ Weather data unavailable: {error_data['error']}")
        return error_data

    ph_tz = timezone(timedelta(hours=8))
    dt_ph = datetime.fromtimestamp(resp["dt"], tz=ph_tz)

    weather_data = {
        "description": resp["weather"][0]["description"],
        "temperature_c": resp["main"]["temp"],
        "humidity_pct": resp["main"]["humidity"],
        "rain_mm": resp.get("rain", {}).get("1h", 0),
        "wind_speed": resp.get("wind", {}).get("speed", 0),
        "pressure": resp["main"]["pressure"],
        "timestamp": dt_ph.strftime('%Y-%m-%d %H:%M:%S %Z'),
        "city": city_name.title()
    }
    _weather_cache[city_name] = weather_data

    if display_output:
        _display_weather_analysis(weather_data, city_name)
        # Get and display 3-day forecast
        forecast_data = _get_weather_forecast(city_name)
        if forecast_data and "error" not in forecast_data:
            _display_forecast(forecast_data)
    
    return weather_data

def _get_weather_forecast(city_name: str):
    """Get 3-day weather forecast"""
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={city_name}&appid={OWM_API_KEY}&units=metric&cnt=24"
    try:
        resp = requests.get(url, timeout=10).json()
        if "list" not in resp:
            return {"error": "Forecast API failed"}
        
        # Group by day and get daily min/max temps and conditions
        daily_forecast = {}
        
        for item in resp["list"]:
            dt = datetime.fromtimestamp(item["dt"])
            date_key = dt.strftime('%Y-%m-%d')
            
            if date_key not in daily_forecast:
                daily_forecast[date_key] = {
                    "temps": [],
                    "conditions": [],
                    "date_obj": dt
                }
            
            daily_forecast[date_key]["temps"].append(item["main"]["temp"])
            daily_forecast[date_key]["conditions"].append(item["weather"][0]["description"])
        
        # Process daily data
        forecast_days = []
        for date_key in sorted(daily_forecast.keys())[:3]:  # Next 3 days
            day_data = daily_forecast[date_key]
            
            # Get most common weather condition
            most_common_condition = max(set(day_data["conditions"]), key=day_data["conditions"].count)
            
            forecast_days.append({
                "date": day_data["date_obj"].strftime('%a, %b %d'),
                "temp_min": min(day_data["temps"]),
                "temp_max": max(day_data["temps"]),
                "condition": most_common_condition.title()
            })
        
        return {"forecast": forecast_days}
        
    except Exception as e:
        return {"error": f"Forecast request failed: {str(e)}"}

def _display_forecast(forecast_data):
    """Display 3-day weather forecast"""
    print(f"\n📅 3-Day Weather Forecast:")
    print("-" * 40)
    
    for day in forecast_data["forecast"]:
        temp_range = f"{day['temp_min']:.1f}°C - {day['temp_max']:.1f}°C"
        print(f"🗓️ {day['date']}: {temp_range}")
        print(f"   Conditions: {day['condition']}")
        
        # Simple agricultural advice based on forecast
        avg_temp = (day['temp_min'] + day['temp_max']) / 2
        if avg_temp > 32:
            advice = "🔴 Hot day - ensure irrigation"
        elif avg_temp < 18:
            advice = "🔵 Cool day - good for transplanting"
        elif "rain" in day['condition'].lower():
            advice = "🌧️ Rainy day - check drainage"
        else:
            advice = "🟢 Good farming weather"
        
        print(f"   Farm tip: {advice}")
        print()

def _display_weather_analysis(weather_data: Dict, city_name: str):
    """Display detailed weather analysis for agricultural purposes"""
    print(f"\n🌤️ Weather Analysis for {city_name.title()}")
    print("=" * 50)
    
    temp = weather_data['temperature_c']
    humidity = weather_data['humidity_pct']
    rain = weather_data['rain_mm']
    wind = weather_data['wind_speed']
    
    print(f"📅 Last Updated: {weather_data['timestamp']}")
    print(f"🌡️ Temperature: {temp:.1f}°C")
    print(f"💧 Humidity: {humidity}%")
    print(f"🌧️ Recent Rain: {rain} mm (last hour)")
    print(f"💨 Wind Speed: {wind} m/s")
    print(f"📝 Conditions: {weather_data['description'].title()}")
    print(f"🌊 Pressure: {weather_data['pressure']} hPa")
    
    # Agricultural interpretation
    print(f"\n🌾 Agricultural Weather Assessment:")
    print("-" * 40)
    
    # Temperature assessment
    if 20 <= temp <= 30:
        temp_status = "🟢 Optimal temperature range for most crops"
    elif 15 <= temp < 20:
        temp_status = "🟡 Cool - good for leafy vegetables and root crops"
    elif 30 < temp <= 35:
        temp_status = "🟠 Hot - ensure adequate irrigation and shade"
    elif temp > 35:
        temp_status = "🔴 Very hot - stress conditions, avoid planting"
    else:
        temp_status = "🔵 Cold - protect crops, consider greenhouse"
    
    print(f"Temperature: {temp_status}")
    
    # Humidity assessment
    if 60 <= humidity <= 80:
        humidity_status = "🟢 Good humidity for plant growth"
    elif humidity < 60:
        humidity_status = "🟡 Low humidity - monitor water needs closely"
    else:
        humidity_status = "🟠 High humidity - watch for fungal diseases"
    
    print(f"Humidity: {humidity_status}")
    
    # Rain assessment
    if rain > 10:
        rain_status = "🔴 Heavy rain - ensure proper drainage"
    elif rain > 2:
        rain_status = "🟡 Moderate rain - good natural irrigation"
    elif rain > 0:
        rain_status = "🟢 Light rain - beneficial for crops"
    else:
        rain_status = "☀️ No recent rain - may need irrigation"
    
    print(f"Rainfall: {rain_status}")
    
    # Wind assessment
    if wind > 10:
        wind_status = "🔴 Strong wind - protect delicate plants"
    elif wind > 5:
        wind_status = "🟡 Moderate wind - good air circulation"
    else:
        wind_status = "🟢 Calm conditions - ideal for most farming activities"
    
    print(f"Wind: {wind_status}")
    
    # Seasonal recommendations
    current_month = datetime.now().month
    if 3 <= current_month <= 5:  # Hot season
        season_advice = "🌞 Hot Season: Focus on heat-tolerant crops, ensure irrigation"
    elif 6 <= current_month <= 11:  # Rainy season
        season_advice = "🌧️ Rainy Season: Good for rice, ensure drainage for vegetables"
    else:  # Cool season
        season_advice = "❄️ Cool Season: Ideal for leafy vegetables and root crops"
    
    print(f"Season: {season_advice}")
    
    # Today's farming recommendations
    print(f"\n🚜 Today's Farming Recommendations:")
    print("-" * 35)
    
    recommendations = []
    
    if rain > 5:
        recommendations.append("• Avoid heavy field work - soil may be too wet")
        recommendations.append("• Check drainage systems")
    elif rain == 0 and temp > 30:
        recommendations.append("• Consider irrigation for existing crops")
        recommendations.append("• Best to work early morning or late afternoon")
    elif 20 <= temp <= 28 and humidity < 80:
        recommendations.append("• Excellent conditions for planting and field work")
        recommendations.append("• Good day for transplanting seedlings")
    
    if wind > 8:
        recommendations.append("• Secure young plants and seedlings")
        recommendations.append("• Postpone pesticide/fertilizer spraying")
    
    if humidity > 85:
        recommendations.append("• Monitor plants for fungal diseases")
        recommendations.append("• Ensure good air circulation")
    
    if not recommendations:
        recommendations.append("• Normal farming activities can proceed")
    
    for rec in recommendations:
        print(rec)

# -----------------------------
# USER INPUT
# -----------------------------
if __name__ == "__main__":
    user_city = input("Enter a Philippine city: ").strip().lower()

    if user_city not in CITY_CENTERS:
        print("❌ City not found in database. Try again.")
    else:
        get_weather(user_city)
