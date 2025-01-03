'use client';

import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { createClient } from '@/lib/supabase/client';
import * as Model from '@/lib/type-definitions/models';
import { useAuthStore } from '@/store/auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AuthProvider({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const supabaseClient = createClient();

	const { login, logout } = useAuthStore();

	const [isLoggedIn, setLoggedIn] = useState(false);

	const router = useRouter();
	const pathname = usePathname();

	const onSignIn = (userId: string) => {
		if (isLoggedIn) return;
		supabaseClient
			.from('users')
			.select()
			.eq('id', userId)
			.single()
			.then(({ data, error }) => {
				if (data) {
					const user = data as Model.User;
					login({
						id: user.id,
						email: user.email,
						display_name: user.display_name
					});
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
	if (!isLoggedIn && !pathname.startsWith('/p/login')) {
		return (
			<div className='w-screen h-screen flex items-center justify-center'>
				<LoadingSpinner size={48} />
			</div>
		);
	}

	return <>{children}</>;
}
