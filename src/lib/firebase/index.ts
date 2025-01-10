// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging, getToken } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const messaging = getMessaging(app);
// Add the public key generated from the console here.
getToken(messaging, { vapidKey: 'BHkNP_o2XTRkS8F6nUai45SP6nV03KXmU8qxDQHIgZAXkZzmbE-BOayAPleONMd9lMAL7mUzYHjP3khgVD86etI' });
