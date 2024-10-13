// Import the necessary functions from the Firebase SDKs
import { initializeApp } from "firebase/app";
import {
  getAuth,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration object using the details you provided
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyATYW6NtYaYKR81at04f4kG9qWC5hMXjo4",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "vycto-30b78.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "vycto-30b78",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "vycto-30b78.appspot.com",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "686857792514",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:686857792514:web:4ca3baddc22d702f434b1b",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-Q8V8RGRC4X",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and set up Facebook provider
const auth = getAuth(app);
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider("apple.com");

// Initialize Firebase Analytics (only in the browser)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, facebookProvider, appleProvider, signInWithPopup };
