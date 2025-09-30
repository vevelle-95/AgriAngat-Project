// firebaseConfig.js

import messaging from '@react-native-firebase/messaging';
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqCd1fjt45ASY9QR161tycxD4_RChvmsA",
  authDomain: "agriangat-ai.firebaseapp.com",
  projectId: "agriangat-ai",
  storageBucket: "agriangat-ai.firebasestorage.app",
  messagingSenderId: "426991657435",
  appId: "1:426991657435:web:f9b57129a516de20f347fe",
  measurementId: "G-0BSTTEVHSN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Export messaging instance for notifications
export const fcm = messaging();
