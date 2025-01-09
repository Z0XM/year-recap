'use client';

import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { createClient } from '@/lib/supabase/client';
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

    function toHSL(hex: string) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return null;
        const r = parseInt(result[1], 16) / 255;
        const g = parseInt(result[2], 16) / 255;
        const b = parseInt(result[3], 16) / 255;

        const max = Math.max(r, g, b),
            min = Math.min(r, g, b);

        let h = (max + min) / 2;
        let s = (max + min) / 2;
        let l = (max + min) / 2;

        if (max == min) {
            h = 0;
            s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        s = s * 100;
        s = Math.round(s);
        l = l * 100;
        l = Math.round(l);
        h = Math.round(360 * h);
        const colorInHSL = h + ' ' + s + '% ' + l + '%';
        return colorInHSL;
    }

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

                    console.log(`Setting Primary color  as ${user.accent_color}; ${toHSL(user.accent_color)}`);
                    document.documentElement.style.setProperty(`--primary`, toHSL(user.accent_color));
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

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [isLoggedIn]);

    // console.log(!isLoggedIn && !pathname.startsWith('/p/login'));
    if (!isLoggedIn && !pathname.startsWith('/p/login') && !pathname.startsWith('/p/update-password')) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <LoadingSpinner size={48} />
            </div>
        );
    }

    return <>{children}</>;
}
