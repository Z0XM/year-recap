import { createClient } from '@/lib/supabase/server';
import admin from 'firebase-admin';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // privateKey: `-----BEGIN PRIVATE KEY-----${process.env.FIREBASE_API_KEY}-----END PRIVATE KEY-----\n`
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        })
    });
}

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const webAddress = process.env.NEXT_PUBLIC_WEB_ADDRESS;

    if (!webAddress) {
        return Response.json({ error: 'Web Address Not found' }, { status: 500 });
    }

    const supabase = await createClient();

    const tokensResult = await supabase.from('notification_tokens').select('token').limit(100);

    if (tokensResult.error) {
        return NextResponse.json({ success: false, error: tokensResult.error });
    }

    const tokens = tokensResult.data.map((x) => x.token);

    try {
        await admin.messaging().sendEachForMulticast({
            tokens,
            notification: {
                title: 'How was your day ?',
                body: 'Take out some time to write about your day!'
            },
            webpush: {
                fcmOptions: {
                    link: webAddress
                }
            }
        });

        return NextResponse.json({ success: true, message: 'Notification sent!' });
    } catch (error) {
        return NextResponse.json({ success: false, error });
    }
}
