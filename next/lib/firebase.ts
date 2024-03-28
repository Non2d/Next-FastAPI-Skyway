// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  databaseURL: "https://online-card-c09a4-default-rtdb.asia-southeast1.firebasedatabase.app",
  apiKey: "AIzaSyB91tTRrwumQfPy5xSVZNzhP-zqjemIcAY",
  authDomain: "online-card-c09a4.firebaseapp.com",
  projectId: "online-card-c09a4",
  storageBucket: "online-card-c09a4.appspot.com",
  messagingSenderId: "375600791149",
  appId: "1:375600791149:web:f1d1a2417efa23adee0964",
  measurementId: "G-ZGRV9W6K6F"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const initializeFirebaseApp = () =>
    !getApps().length ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);