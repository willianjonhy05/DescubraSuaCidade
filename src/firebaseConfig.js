// services/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAviLSzrpn3SXCLqgxFFK6B5y-whKm7qgU",
  authDomain: "descubrasuacidade-3236d.firebaseapp.com",
  projectId: "descubrasuacidade-3236d",
  storageBucket: "descubrasuacidade-3236d.firebasestorage.app",
  messagingSenderId: "94647287332",
  appId: "1:94647287332:web:3c22de1dfbad7cd4a5a2b1"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Configura o Firebase Auth com persistência usando AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Inicializa o Firestore
const db = getFirestore(app);

export { db };
export default app;
