# AgriAngat Weather Backend - Flask API

This Flask-based backend connects the React Native mobile app to Python weather and soil analysis APIs using the original weather API functions.

## 🚀 Quick Start

### 1. Start the Backend Server
```bash
cd AgriAngat-Backend
.venv\Scripts\activate  # Windows
python flask_weather_server.py
```

The server will start on **http://localhost:5000**

### 2. Test the API
Visit these URLs in your browser:
- Health Check: http://localhost:5000/health
- Weather for Manila: http://localhost:5000/api/weather/manila
- Cities List: http://localhost:5000/api/cities

## 📱 React Native Integration

The React Native app (`weather-analysis.jsx`) automatically connects to:
- **iOS Simulator**: `http://localhost:5000/api`
- **Android Emulator**: `http://10.0.2.2:5000/api`
- **Physical Device**: Use your computer's IP address

## 🌐 API Endpoints

### Weather Data
**GET** `/api/weather/<city_name>`

Returns real-time weather data for any Philippine city.

**Response:**
```json
{
  "success": true,
  "weatherData": {
    "location": "Manila",
    "description": "clear sky",
    "temperature": 28.5,
    "humidity": 75,
    "windSpeed": 5.2,
    "rainChance": 15,
    "forecast": [
      {
        "day": "Today",
        "condition": "Clear",
        "tempRange": "26°C - 32°C",
        "icon": "sun"
      }
    ]
  }
}
```

### Soil Analysis
**GET** `/api/soil/<city_name>`

Returns agricultural soil data for the specified city.

**Response:**
```json
{
  "success": true,
  "city": "Manila",
  "soilData": {
    "pH Level": "6.2 pH units",
    "Organic Carbon": "15.3 g/kg",
    "Clay Content": "35.2 %",
    "Sand Content": "40.1 %"
  }
}
```

### Cities List
**GET** `/api/cities`

Returns all available Philippine cities.

**Response:**
```json
{
  "success": true,
  "cities": [
    {
      "name": "Manila",
      "key": "manila",
      "coordinates": {
        "latitude": 14.5995,
        "longitude": 120.9842
      }
    }
  ],
  "count": 118
}
```

## 🔧 System Architecture

```
React Native App (weather-analysis.jsx)
    ↓ HTTP requests (fetch)
Flask Server (flask_weather_server.py) - Port 5000
    ↓ Import and call functions
Python Weather Module (1_weatherAPI.py)
Python Soil Module (2_soilAPI.py)  
    ↓ External API calls
OpenWeatherMap API & SoilGrids API
```

## 📁 File Structure

- `flask_weather_server.py` - Main Flask API server
- `1_weatherAPI.py` - Original weather analysis functions
- `2_soilAPI.py` - Soil analysis functions
- `ph_cities.py` - Philippine cities database with coordinates
- `.env` - API keys and configuration

## ⚡ Key Features

- ✅ **Real-time Weather Data** - Live data from OpenWeatherMap
- ✅ **Agricultural Soil Analysis** - Soil data from SoilGrids API
- ✅ **118 Philippine Cities** - Complete city database with coordinates
- ✅ **3-Day Forecast** - Weather predictions for planning
- ✅ **Cross-platform** - Works with iOS/Android simulators and devices
- ✅ **Error Handling** - Graceful fallbacks and error messages

## 🐛 Troubleshooting

**Server won't start:**
- Make sure Flask is installed: `pip install flask flask-cors`
- Check if port 5000 is available

**Mobile app can't connect:**
- iOS Simulator: Use `localhost:5000`
- Android Emulator: Use `10.0.2.2:5000`
- Physical Device: Use your computer's IP address (e.g., `192.168.1.100:5000`)

**Weather data not loading:**
- Check if OpenWeatherMap API key is set in `.env` file
- Verify internet connection
- Check Flask server logs for errors

**Soil data not available:**
- Soil API is slower - may take 10-30 seconds
- Some locations may not have soil data
- This is optional and won't break weather functionality

## 🌟 Success Indicators

When everything is working correctly, you should see:

1. **Flask Server Console:**
   ```
   🌤️  Starting AgriAngat Flask Weather Server...
   * Running on http://127.0.0.1:5000
   * Debugger is active!
   ```

2. **Mobile App:**
   - Real weather data loads when searching cities
   - Temperature, humidity, wind data displays correctly
   - 3-day forecast shows actual predictions
   - Soil data appears after a few seconds

3. **API Responses:**
   - `/health` returns server status
   - `/api/weather/manila` returns live weather
   - `/api/cities` returns 118+ cities

The system is now **fully operational** with Flask serving real weather and soil data to your React Native app! 🎉
