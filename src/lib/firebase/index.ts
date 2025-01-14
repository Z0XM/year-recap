// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken, isSupported } from 'firebase/messaging';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyDlPMsRIfsSoJoNbmy9-Fb5-NwRGu4vDCY',
    authDomain: 'howwasyourday-prod.firebaseapp.com',
    projectId: 'howwasyourday-prod',
    storageBucket: 'howwasyourday-prod.firebasestorage.app',
    messagingSenderId: '748291127483',
    appId: '1:748291127483:web:2154eee9050ef23006119e',
    measurementId: 'G-EWR3V4YL3M'
};

export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const firebaseMessaging = async () => {
    const supported = await isSupported();
    return supported ? getMessaging(firebaseApp) : null;
};

export const fetchToken = async () => {
    try {
        const fcmMessaging = await firebaseMessaging();
        if (fcmMessaging) {
            const token = await getToken(fcmMessaging, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY
            });

            return token;
        }
        return null;
    } catch (err) {
        console.error('An error occurred while fetching the token:', err);
        return null;
    }
};
