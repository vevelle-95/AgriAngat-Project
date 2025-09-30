# AgriAngat Weather Alert System - Quick Start 🚀

Your weather alert system is now configured and ready to use!

## ✅ What's Already Configured

- ✅ **Environment variables** are set in `AgriAngat-Project/.env`
- ✅ **OpenWeatherMap API key** is configured
- ✅ **Twilio credentials** are set up
- ✅ **React Native components** are configured with your IP address (26.109.250.170)
- ✅ **Weather Alert Panel** is integrated into your Home Screen

## 🚀 Start the System

### 1. Start the Python Backend

```bash
cd AgriAngat-Project/AgriAngat-BackEnd
python start_weather_alerts.py
```

You should see:
```
🌤️ Starting AgriAngat Weather Alert System...
✅ Loaded environment variables from C:\Code\AgriAngat-Project\.env
✅ All required environment variables found

🔧 Configuration:
   OpenWeatherMap API Key: ✅ Set
   Twilio Account SID: AC2e1f2862...
   Twilio Phone: +13082445826
   User Phone: +639322645233
   Default City: manila

🚀 Starting Flask server...
🌐 Server will be accessible on:
   http://localhost:5000
   http://0.0.0.0:5000
   http://26.109.250.170:5000
```

### 2. Start the React Native App

```bash
cd AgriAngat-Project/AgriAngat-FrontEnd/mobile-app
npx expo start
```

## 📱 Test the Integration

1. **Open your mobile app** and go to the Home screen
2. **Look for the Weather Alert Panel** - it should show current weather
3. **Tap the weather reminder card** to go to the full Weather Alerts screen
4. **Test SMS functionality:**
   - Tap "Test SMS" button
   - Check your phone (+639322645233) for the test message
5. **Start monitoring:**
   - Tap "Start Monitoring" to begin automatic weather checks
   - The system will check weather every 30 minutes and send alerts if needed

## 🧪 Quick Test

Run the automated test to verify everything works:

```bash
cd AgriAngat-Project/AgriAngat-BackEnd
python test_weather_alerts.py
```

This will test:
- ✅ Server connectivity
- ✅ Weather API integration  
- ✅ Twilio SMS functionality
- ✅ Alert system

## 📋 Your Current Configuration

- **Weather API**: OpenWeatherMap (API key: b9f2a6836d2e5d6067a7fadc7e1b98af)
- **SMS Service**: Twilio (+13082445826)
- **Your Phone**: +639322645233
- **Default Location**: Manila (14.5995, 120.9842)
- **Server IP**: 26.109.250.170:5000

## 🌤️ How It Works

1. **Background Monitoring**: Python server checks weather every 30 minutes
2. **Alert Conditions**: Triggers on extreme temperatures, heavy rain, strong winds, severe weather
3. **SMS Alerts**: Sends farming advice via SMS when dangerous conditions detected
4. **Mobile Control**: React Native app lets you control preferences and test functionality

## 🔧 Alert Thresholds

Current alert triggers:
- **High Temperature**: > 35°C
- **Low Temperature**: < 15°C  
- **Heavy Rain**: > 5mm/hour
- **Strong Wind**: > 10 m/s
- **High Humidity**: > 90%

## 📱 Mobile App Features

### Home Screen Weather Panel:
- Current weather display
- Alert status indicator
- Quick toggle for SMS/WhatsApp
- Test buttons

### Full Weather Alerts Screen:
- Complete preferences management
- Server status monitoring
- Manual weather checks
- Phone number configuration

## 🚨 Sample Alert Message

When dangerous weather is detected, you'll receive SMS like:

```
🚨 SEVERE WEATHER ALERT - Manila

🌡️ Temperature: 28°C
📝 Conditions: Thunderstorm
💧 Humidity: 85%
🌧️ Rain: 12mm (last hour)
💨 Wind: 15 m/s

🌾 FARMING ADVICE:
• Heavy rain - ensure proper drainage
• Avoid field work until soil dries
• Strong winds - secure young plants
• High humidity - watch for diseases

📅 2024-01-15 14:30

From AgriAngat Weather Alert System
```

## 🔍 Troubleshooting

If something doesn't work:

1. **Check server is running**: Look for "Flask server running" message
2. **Verify mobile app connection**: Should show "✅ Connected to weather server"
3. **Test SMS**: Use the "Test SMS" button in the app
4. **Check logs**: Python server shows detailed logs of all operations

## 🎯 Next Steps

1. **Test the complete flow** with your phone
2. **Start monitoring** to receive automatic alerts
3. **Customize alert thresholds** if needed (edit `services/weather_alert_service.py`)
4. **Add more users** by expanding the user management system

---

**Your AgriAngat Weather Alert System is ready to help farmers stay safe! 🌾📱**

Need help? Check the server logs or run the test script to diagnose issues.