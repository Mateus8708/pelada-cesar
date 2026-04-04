import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB4u-_ktPuqjjQ4AS5TqtuF2UD39_8ISLg",
    authDomain: "peladacesar-73b02.firebaseapp.com",
    projectId: "peladacesar-73b02",
    storageBucket: "peladacesar-73b02.firebasestorage.app",
    messagingSenderId: "50022236832",
    appId: "1:50022236832:web:a86093ffe304b830a83fc5",
    measurementId: "G-JFD0GD7WFZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Correção para o erro "Client is offline" no React Native/Expo (força long polling em vez de WebSockets)
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});
