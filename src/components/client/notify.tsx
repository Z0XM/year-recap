'use client';

import React from 'react';
import { useFcmToken } from '@/hooks/use-fcm';
import { Button } from '../ui/button';

// export default function Notifications() {
//     const { fcmToken, notificationPermissionStatus } = useFcmToken();

//     useEffect(() => {
//         if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
//             const messaging = getMessaging(firebaseApp);
//             const unsubscribe = onMessage(messaging, (payload) => {
//                 console.log('Foreground push notification received:', payload);
//                 // Handle the received push notification while the app is in the foreground
//                 // You can display a notification or update the UI based on the payload
//             });
//             return () => {
//                 unsubscribe(); // Unsubscribe from the onMessage event
//             };
//         }
//     }, []);

//     return <></>;
// }

export default function NotificationTest() {
    const { token, notificationPermissionStatus } = useFcmToken();

    const handleTestNotification = async () => {
        const response = await fetch('/api/notify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                title: 'Test Notification',
                message: 'This is a test notification',
                link: '/contact'
            })
        });

        const data = await response.json();
        console.log(data);
    };

    return (
        <main className="p-10">
            {/* <h1 className="mb-4 text-4xl font-bold">Firebase Cloud Messaging Demo</h1> */}

            {notificationPermissionStatus === 'granted' ? (
                <p>Permission to receive notifications has been granted.</p>
            ) : notificationPermissionStatus !== null ? (
                <p>You have not granted permission to receive notifications. Please enable notifications in your browser settings.</p>
            ) : null}

            {/* <Button disabled={!token} className="mt-5" onClick={handleTestNotification}>
                Send Test Notification
            </Button> */}
        </main>
    );
}
