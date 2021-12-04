// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNEBjLpzuhJECE7QQdY1Qw0ZOOPwQeKqY",
  authDomain: "gfam-3a921.firebaseapp.com",
  projectId: "gfam-3a921",
  storageBucket: "gfam-3a921.appspot.com",
  messagingSenderId: "334367044311",
  appId: "1:334367044311:web:cd178aec26bb6e1ff2f692",
  measurementId: "G-KR6MXBE8TJ"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

export default firebaseApp;