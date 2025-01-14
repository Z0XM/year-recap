'use client';

import React, { useEffect } from 'react';
import { useFcmToken } from '@/hooks/use-fcm';
// import { Button } from '../ui/button';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function Notifications() {
    const { token, notificationPermissionStatus } = useFcmToken();
    const supabase = createClient();

    const saveToken = async (token: string) => {
        const existingToken = await supabase.from('notification_tokens').select('token').eq('token', token);
        if (existingToken.error) {
            console.error(existingToken.error);
            return;
        }
        console.log(existingToken);
        if (existingToken.data.length === 0) {
            await supabase.from('notification_tokens').insert({ token });
        }
    };

    useEffect(() => {
        if (notificationPermissionStatus === 'granted' && token) {
            toast.success('Notifications Enabled!');
            // console.log('Notification permission granted:', token);
            saveToken(token);
        } else if (notificationPermissionStatus === 'denied') {
            toast.error('Notifications Disabled!');
        }
    }, [notificationPermissionStatus, token]);

    return <></>;
}
