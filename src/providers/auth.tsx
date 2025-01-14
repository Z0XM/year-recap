'use client';

import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { createClient } from '@/lib/supabase/client';
import { setGlobalAccentColor } from '@/lib/color';
import * as Model from '@/lib/type-definitions/models';
import { useAuthStore } from '@/store/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * [Wrapper to load user's auth]
 *
 * Retriggers whenever the user auth state changes.
 * shows a loader until the user is signed in.
 *
 */
export default function AuthProvider({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabaseClient = createClient();

    const { login, logout, user } = useAuthStore();

    const [isLoggedIn, setLoggedIn] = useState(user ? true : false);

    const router = useRouter();
    const pathname = usePathname();

    const onSignIn = (userId: string) => {
        if (isLoggedIn) return;
        supabaseClient
            .from('users')
            .select('*')
            .eq('id', userId)
            .eq('isActive', true)
            .single()
            .then(({ data, error }) => {
                if (data) {
                    const user = data as Model.User;
                    login({
                        id: user.id,
                        email: user.email,
                        display_name: user.display_name,
                        accent_color: user.accent_color,
                        avatar: user.avatar
                    });

                    setGlobalAccentColor(user.accent_color);
                    toast.success('Login successful!');
                } else {
                    console.error(error);
                    toast.error('User not found');
                }
            });
        setLoggedIn(true);
        router.refresh();
    };
    const onSignOut = () => {
        logout();
        setLoggedIn(false);
        toast.success('Logout successful!');
        router.refresh();
    };

    useEffect(() => {
        const { data: authListener } = supabaseClient.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                onSignIn(session.user.id);
            } else if (event === 'SIGNED_OUT') {
                onSignOut();
            }
        });

        // supabaseClient.auth.startAutoRefresh();

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [isLoggedIn]);

    useEffect(() => {
        if (!isLoggedIn && !pathname.startsWith('/p/login') && !pathname.startsWith('/p/update-password')) {
            const timer = setTimeout(() => {
                console.log('Refreshing Page...');
                router.refresh();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isLoggedIn]);

    if (!isLoggedIn && !pathname.startsWith('/p/login') && !pathname.startsWith('/p/update-password')) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <LoadingSpinner size={48} />
            </div>
        );
    }

    return <>{children}</>;
}
