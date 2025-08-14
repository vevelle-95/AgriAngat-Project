# 🌾 AgriAngat AI

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=for-the-badge)](https://github.com/yourusername/agriangat-ai)

> A modern agricultural marketplace and credit platform connecting farmers, stores, and banks through AI-powered intelligence and real-time geospatial data.

## ✨ Features

### 🔐 Secure Role-Based Authentication
- Multi-role user system (Farmer/Store/Bank)
- Firebase Authentication with custom claims
- Secure token management and refresh
- Protected route navigation

### 🌾 Smart Marketplace
- Geolocation-based crop listings (20km radius)
- Real-time inventory updates
- Advanced filtering and search
- In-app messaging between users
- Transaction history tracking

### 🌤️ Weather Intelligence
- Real-time weather alerts and forecasts
- SMS notifications for critical updates
- Crop-specific weather recommendations
- Historical weather data analysis

### 🏦 AI Credit Scoring
- Machine learning risk assessment
- Transaction history analysis
- Credit score visualization
- Automated loan recommendations
- Real-time application tracking

### 📱 Modern User Experience
- Dark mode optimized interface
- Smooth animations and transitions
- Offline capability
- Push notifications
- Multi-language support

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React Native + Expo |
| Authentication | Firebase Auth |
| State Management | React Context + AsyncStorage |
| Styling | NativeWind (Tailwind CSS) |
| Navigation | React Navigation v6 |
| Real-time Updates | Socket.io Client |
| Maps Integration | Google Maps API |
| Weather Data | OpenWeatherMap API |
| Notifications | Twilio SMS API |

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 16.x or later
- npm or yarn package manager
- Expo CLI
- Firebase CLI
- A code editor (VS Code / Cursor is recommended)

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/agriangat-ai.git
cd agriangat-ai
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure Firebase**
- Create a new Firebase project
- Enable Authentication and Firestore
- Download your Firebase config
- Create a .env file:
```bash
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

4. **Configure API Keys**
Add the following to your .env file:
```bash
GOOGLE_MAPS_API_KEY=your_google_maps_key
OPENWEATHER_API_KEY=your_openweather_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

5. **Start the development server**
```bash
expo start
```

## 📱 Running the App

1. Install the Expo Go app on your mobile device
2. Scan the QR code from your terminal
3. The app will load on your device

For iOS Simulator:
```bash
expo start --ios
```

For Android Emulator:
```bash
expo start --android
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Twilio API](https://www.twilio.com/docs)

## 📞 Support

For support, email support@agriangat.ai or join our Slack channel. 