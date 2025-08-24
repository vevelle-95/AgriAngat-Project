import os
import requests
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from typing import Dict, List, Optional
from ph_cities import CITY_CENTERS  # <-- import your dict

# -----------------------------
# CONFIG
# -----------------------------
load_dotenv()  # Load .env file

OWM_API_KEY = os.getenv("OWM_API_KEY")  # pulled from .env

_weather_cache = {}
_soil_cache = {}

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
# 2. SOIL DATA (SoilGrids API)
# -----------------------------
class SoilGridsExtractor:
    """Extract agriculturally relevant soil data from SoilGrids API"""
    
    def __init__(self):
        # Define agriculturally important soil properties
        self.ag_properties = {
            'phh2o': {'name': 'Soil pH (H2O)', 'unit': 'pH units', 'conversion': 10},
            'ocd': {'name': 'Organic Carbon Density', 'unit': 'hg/m³', 'conversion': 10},
            'nitrogen': {'name': 'Total Nitrogen', 'unit': 'g/kg', 'conversion': 100},
            'soc': {'name': 'Soil Organic Carbon', 'unit': 'g/kg', 'conversion': 10},
            'cec': {'name': 'Cation Exchange Capacity', 'unit': 'cmol(c)/kg', 'conversion': 10},
            'bdod': {'name': 'Bulk Density', 'unit': 'kg/dm³', 'conversion': 100},
            'clay': {'name': 'Clay Content', 'unit': '%', 'conversion': 10},
            'sand': {'name': 'Sand Content', 'unit': '%', 'conversion': 10},
            'silt': {'name': 'Silt Content', 'unit': '%', 'conversion': 10},
            'wv0010': {'name': 'Water Content at 10kPa', 'unit': '10⁻² cm³/cm³', 'conversion': 10},
            'wv0033': {'name': 'Water Content at 33kPa', 'unit': '10⁻² cm³/cm³', 'conversion': 10},
            'wv1500': {'name': 'Water Content at 1500kPa', 'unit': '10⁻² cm³/cm³', 'conversion': 10}
        }
    
    def get_soil_data(self, lat: float, lon: float) -> Dict:
        """Fetch soil data from SoilGrids API"""
        url = f"https://rest.isric.org/soilgrids/v2.0/properties/query?lon={lon}&lat={lat}"
        
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            return {"error": f"API request failed: {str(e)}"}
    
    def extract_topsoil_values(self, soil_data: Dict, depth_label: str = "0-5cm") -> Dict:
        """Extract values for a specific depth layer (default: topsoil 0-5cm)"""
        extracted = {}
        
        if "properties" not in soil_data or "layers" not in soil_data["properties"]:
            return {"error": "Invalid soil data structure"}
        
        layers = soil_data["properties"]["layers"]
        
        for layer in layers:
            prop_name = layer.get("name")
            if prop_name not in self.ag_properties:
                continue
            
            # Find the specified depth
            depths = layer.get("depths", [])
            target_depth = None
            
            for depth in depths:
                if depth.get("label") == depth_label:
                    target_depth = depth
                    break
            
            if target_depth and "values" in target_depth:
                values = target_depth["values"]
                conversion_factor = self.ag_properties[prop_name]["conversion"]
                
                # Helper function to safely convert values
                def safe_convert(value):
                    return value / conversion_factor if value is not None else None
                
                # Convert values from mapped units to target units (handle None values)
                extracted[prop_name] = {
                    "name": self.ag_properties[prop_name]["name"],
                    "unit": self.ag_properties[prop_name]["unit"],
                    "mean": safe_convert(values.get("mean")),
                    "median": safe_convert(values.get("Q0.5")),
                    "q05": safe_convert(values.get("Q0.05")),
                    "q95": safe_convert(values.get("Q0.95")),
                    "uncertainty": safe_convert(values.get("uncertainty"))
                }
        
        return extracted
    
    def extract_all_depths(self, soil_data: Dict) -> Dict:
        """Extract values for all available depth layers"""
        if "properties" not in soil_data or "layers" not in soil_data["properties"]:
            return {"error": "Invalid soil data structure"}
        
        all_depths = {}
        layers = soil_data["properties"]["layers"]
        
        for layer in layers:
            prop_name = layer.get("name")
            if prop_name not in self.ag_properties:
                continue
            
            all_depths[prop_name] = {
                "name": self.ag_properties[prop_name]["name"],
                "unit": self.ag_properties[prop_name]["unit"],
                "depths": {}
            }
            
            conversion_factor = self.ag_properties[prop_name]["conversion"]
            
            for depth in layer.get("depths", []):
                depth_label = depth.get("label")
                if "values" in depth:
                    values = depth["values"]
                    
                    # Helper function to safely convert values
                    def safe_convert(value):
                        return value / conversion_factor if value is not None else None
                    
                    all_depths[prop_name]["depths"][depth_label] = {
                        "mean": safe_convert(values.get("mean")),
                        "median": safe_convert(values.get("Q0.5")),
                        "range": f"{depth['range']['top_depth']}-{depth['range']['bottom_depth']} {depth['range']['unit_depth']}"
                    }
        
        return all_depths
    
    def get_agricultural_summary(self, lat: float, lon: float, depth: str = "0-5cm") -> Dict:
        """Get a farmer-friendly summary of soil conditions"""
        soil_data = self.get_soil_data(lat, lon)
        
        if "error" in soil_data:
            return soil_data
        
        topsoil = self.extract_topsoil_values(soil_data, depth)
        
        if "error" in topsoil:
            return topsoil
        
        # Create agricultural interpretation
        summary = {
            "location": {"latitude": lat, "longitude": lon},
            "depth_analyzed": depth,
            "soil_properties": topsoil,
            "agricultural_interpretation": self._interpret_for_agriculture(topsoil),
            "crop_suggestions": self._suggest_crops(topsoil)
        }
        
        return summary
    
    def _interpret_for_agriculture(self, soil_props: Dict) -> Dict:
        """Provide agricultural interpretation of soil data"""
        interpretation = {}
        
        # pH interpretation
        if "phh2o" in soil_props and soil_props["phh2o"]["mean"] is not None:
            ph = soil_props["phh2o"]["mean"]
            if ph < 5.5:
                interpretation["pH"] = "Acidic - may need liming for most crops"
            elif ph > 7.5:
                interpretation["pH"] = "Alkaline - may limit nutrient uptake"
            else:
                interpretation["pH"] = "Good pH range for most crops"
        
        # Organic matter interpretation
        if "soc" in soil_props and soil_props["soc"]["mean"] is not None:
            soc = soil_props["soc"]["mean"]
            if soc < 10:
                interpretation["organic_matter"] = "Low - add compost/organic fertilizer"
            elif soc > 30:
                interpretation["organic_matter"] = "Excellent organic matter content"
            else:
                interpretation["organic_matter"] = "Moderate organic matter levels"
        
        # Nitrogen interpretation
        if "nitrogen" in soil_props and soil_props["nitrogen"]["mean"] is not None:
            n = soil_props["nitrogen"]["mean"]
            if n < 1.0:
                interpretation["nitrogen"] = "Low - nitrogen fertilization needed"
            elif n > 3.0:
                interpretation["nitrogen"] = "High nitrogen content"
            else:
                interpretation["nitrogen"] = "Adequate nitrogen levels"
        
        # Texture interpretation
        texture_props = ["clay", "sand", "silt"]
        if all(prop in soil_props and soil_props[prop]["mean"] is not None for prop in texture_props):
            clay = soil_props["clay"]["mean"]
            sand = soil_props["sand"]["mean"]
            silt = soil_props["silt"]["mean"]
            
            if clay > 40:
                interpretation["texture"] = "Clay soil - good water retention, ensure drainage"
            elif sand > 60:
                interpretation["texture"] = "Sandy soil - good drainage, needs frequent watering"
            else:
                interpretation["texture"] = "Loamy soil - ideal for most crops"
        
        # Cation Exchange Capacity interpretation
        if "cec" in soil_props and soil_props["cec"]["mean"] is not None:
            cec = soil_props["cec"]["mean"]
            if cec < 10:
                interpretation["nutrient_retention"] = "Low - frequent fertilization needed"
            elif cec > 25:
                interpretation["nutrient_retention"] = "High - good nutrient holding capacity"
            else:
                interpretation["nutrient_retention"] = "Moderate nutrient retention"
        
        return interpretation
    
    def _suggest_crops(self, soil_props: Dict) -> List[str]:
        """Suggest suitable crops based on soil properties"""
        suggestions = []
        
        # pH-based suggestions
        if "phh2o" in soil_props and soil_props["phh2o"]["mean"] is not None:
            ph = soil_props["phh2o"]["mean"]
            if 6.0 <= ph <= 7.0:
                suggestions.extend(["Rice", "Corn", "Tomatoes", "Lettuce", "Cabbage", "Beans"])
            elif 5.5 <= ph < 6.0:
                suggestions.extend(["Sweet potato", "Cassava", "Pineapple", "Potatoes"])
            elif ph < 5.5:
                suggestions.extend(["Blueberries", "Cranberries", "Azaleas"])
            else:  # pH > 7.0
                suggestions.extend(["Asparagus", "Spinach", "Beets", "Broccoli"])
        
        # Texture-based suggestions
        texture_props = ["clay", "sand", "silt"]
        if all(prop in soil_props and soil_props[prop]["mean"] is not None for prop in texture_props):
            clay = soil_props["clay"]["mean"]
            sand = soil_props["sand"]["mean"]
            
            if clay > 40:  # Clay soil
                suggestions.extend(["Rice", "Wheat", "Soybeans", "Sugar cane"])
            elif sand > 60:  # Sandy soil
                suggestions.extend(["Carrots", "Radish", "Potatoes", "Peanuts", "Watermelon"])
            else:  # Loamy soil
                suggestions.extend(["Corn", "Beans", "Squash", "Eggplant", "Peppers"])
        
        # Organic matter based suggestions
        if "soc" in soil_props and soil_props["soc"]["mean"] is not None:
            soc = soil_props["soc"]["mean"]
            if soc > 20:  # High organic matter
                suggestions.extend(["Leafy greens", "Herbs", "Root vegetables"])
        
        return list(set(suggestions))  # Remove duplicates

# Comprehensive Agricultural Analysis Function
def comprehensive_agricultural_analysis(city_name: str, lat: float = None, lon: float = None):
    """
    Perform comprehensive agricultural analysis combining weather and soil data
    """
    print("🌾 COMPREHENSIVE AGRICULTURAL ANALYSIS")
    print("=" * 60)
    
    # Get city coordinates if not provided
    if lat is None or lon is None:
        if city_name.lower() in CITY_CENTERS:
            lat, lon = CITY_CENTERS[city_name.lower()]
            print(f"📍 Location: {city_name.title()} ({lat:.6f}, {lon:.6f})")
        else:
            print(f"❌ City '{city_name}' not found in database")
            return
    else:
        print(f"📍 Coordinates: {lat:.6f}, {lon:.6f}")
    
    print(f"📅 Analysis Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # 1. Weather Analysis
    weather_data = get_weather(city_name, display_output=True)
    
    # 2. Soil Analysis
    print(f"\n🌱 Soil Analysis for {city_name.title()}")
    print("=" * 50)
    
    extractor = SoilGridsExtractor()
    soil_summary = extractor.get_agricultural_summary(lat, lon)
    
    if "error" in soil_summary:
        print(f"❌ Soil analysis failed: {soil_summary['error']}")
        soil_data_available = False
    else:
        soil_data_available = True
        print(f"✅ Soil data retrieved for depth: {soil_summary['depth_analyzed']}")
        
        # Display soil properties
        print(f"\n📊 Key Soil Properties:")
        print("-" * 30)
        
        for prop_key, prop_data in soil_summary["soil_properties"].items():
            if prop_data['mean'] is not None:
                print(f"• {prop_data['name']}: {prop_data['mean']:.2f} {prop_data['unit']}")
        
        # Display soil interpretation
        print(f"\n🔍 Soil Assessment:")
        print("-" * 20)
        for aspect, advice in soil_summary["agricultural_interpretation"].items():
            print(f"• {aspect.replace('_', ' ').title()}: {advice}")
    
    # 3. Combined Recommendations
    print(f"\n🚜 INTEGRATED AGRICULTURAL RECOMMENDATIONS")
    print("=" * 55)
    
    recommendations = []
    
    # Weather-based recommendations
    if "error" not in weather_data:
        temp = weather_data['temperature_c']
        humidity = weather_data['humidity_pct']
        rain = weather_data['rain_mm']
        
        if 20 <= temp <= 30 and 60 <= humidity <= 80:
            recommendations.append("🟢 Excellent weather conditions for most farming activities")
        elif temp > 32:
            recommendations.append("🔴 Hot weather - prioritize heat-tolerant crops and irrigation")
        elif temp < 18:
            recommendations.append("🔵 Cool weather - focus on cold-season vegetables")
        
        if rain > 5:
            recommendations.append("🌧️ Recent rainfall - check soil drainage before field work")
        elif rain == 0 and temp > 28:
            recommendations.append("💧 No recent rain + heat - irrigation essential")
    
    # Soil-based recommendations
    if soil_data_available and "crop_suggestions" in soil_summary:
        suitable_crops = soil_summary["crop_suggestions"][:8]  # Top 8 suggestions
        if suitable_crops:
            print(f"🌾 Recommended Crops Based on Soil Conditions:")
            for i, crop in enumerate(suitable_crops, 1):
                print(f"   {i}. {crop}")
        
        # Management recommendations based on soil
        soil_props = soil_summary["soil_properties"]
        
        if "phh2o" in soil_props and soil_props["phh2o"]["mean"]:
            ph = soil_props["phh2o"]["mean"]
            if ph < 5.5:
                recommendations.append("🟡 Apply lime to raise soil pH for better crop performance")
            elif ph > 7.5:
                recommendations.append("🟡 Consider sulfur application to lower soil pH")
        
        if "soc" in soil_props and soil_props["soc"]["mean"]:
            soc = soil_props["soc"]["mean"]
            if soc < 10:
                recommendations.append("🟫 Add organic matter (compost, manure) to improve soil health")
        
        if "nitrogen" in soil_props and soil_props["nitrogen"]["mean"]:
            n = soil_props["nitrogen"]["mean"]
            if n < 1.0:
                recommendations.append("🟨 Apply nitrogen fertilizer for better crop growth")
    
    # Seasonal recommendations
    current_month = datetime.now().month
    if 3 <= current_month <= 5:  # Hot season
        recommendations.append("🌞 Hot season: Install shade nets and drip irrigation systems")
    elif 6 <= current_month <= 11:  # Rainy season
        recommendations.append("🌧️ Rainy season: Ensure proper drainage and disease monitoring")
    else:  # Cool season
        recommendations.append("❄️ Cool season: Optimal time for transplanting and field preparation")
    
    # Display all recommendations
    print(f"\n📋 Action Items:")
    print("-" * 15)
    for i, rec in enumerate(recommendations, 1):
        print(f"{i}. {rec}")
    
    print(f"\n{'='*60}")
    print("🎯 Analysis Complete! Use these insights for better agricultural planning.")
    print("💡 Tip: Repeat analysis monthly to track seasonal changes.")

# Example usage and testing
def main():
    """Example usage with comprehensive analysis"""
    
    print("🌾 AgriAngat Agricultural Analysis System")
    print("=" * 50)
    
    # Example 1: Manila analysis
    print("\n--- MANILA ANALYSIS ---")
    comprehensive_agricultural_analysis("manila")
    
    print("\n\n--- BAGUIO ANALYSIS ---")
    comprehensive_agricultural_analysis("baguio")
    
    # Example with custom coordinates
    print("\n\n--- CUSTOM COORDINATES ANALYSIS ---")
    # Some agricultural area in Central Luzon
    comprehensive_agricultural_analysis("Custom Location", lat=15.4817, lon=120.5979)

# -----------------------------
# USER INPUT
# -----------------------------
def quick_analysis(city_name: str):
    """Quick weather and soil analysis for a city"""
    print(f"🌾 Quick Agricultural Analysis - {city_name.title()}")
    print("=" * 60)
    
    # Weather analysis
    weather_data = get_weather(city_name, display_output=True)
    
    # Get coordinates
    if city_name.lower() in CITY_CENTERS:
        lat, lon = CITY_CENTERS[city_name.lower()]
        
        # Try soil analysis with shorter timeout
        print(f"\n🌱 Attempting Soil Analysis...")
        extractor = SoilGridsExtractor()
        try:
            soil_data = extractor.get_soil_data(lat, lon)
            if "error" not in soil_data:
                topsoil = extractor.extract_topsoil_values(soil_data)
                if "error" not in topsoil:
                    print("✅ Soil analysis successful!")
                    
                    # Show key soil properties
                    print(f"\n📊 Key Soil Properties:")
                    for prop_key, prop_data in topsoil.items():
                        if prop_data['mean'] is not None:
                            print(f"• {prop_data['name']}: {prop_data['mean']:.2f} {prop_data['unit']}")
                    
                    # Show crop suggestions
                    crops = extractor._suggest_crops(topsoil)
                    if crops:
                        print(f"\n🌾 Suggested Crops: {', '.join(crops[:6])}")
                else:
                    print(f"❌ Soil data processing failed")
            else:
                print(f"❌ Soil API failed: {soil_data['error']}")
        except Exception as e:
            print(f"❌ Soil analysis error: {str(e)}")
    
    print(f"\n{'='*60}")

if __name__ == "__main__":
    user_city = input("Enter a Philippine city: ").strip().lower()

    if user_city not in CITY_CENTERS:
        print("❌ City not found in database. Try again.")
    else:
        get_weather(user_city)