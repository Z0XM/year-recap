'use client';

import { createClient } from '@/lib/supabase/client';
import * as Model from '@/lib/type-definitions/models';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function AuthProvider({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const supabaseClient = createClient();

	const { login, logout, user } = useAuthStore();

	const router = useRouter();

	useEffect(() => {
		const { data: authListener } = supabaseClient.auth.onAuthStateChange((event, session) => {
			console.log('Auth event:', event);

			const saveUser = (userId: string) => {
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
							router.refresh();
						} else {
							console.error(error);
							toast.error('User not found');
							router.refresh();
						}
					});
			};

			console.log(event, session, user);
			if (event === 'SIGNED_IN' && session?.user && user === null) {
				saveUser(session.user.id);
			} else if (event === 'SIGNED_OUT') {
				logout();
				toast.success('Logout successful!');
				router.refresh();
			} else if (event === 'USER_UPDATED' && session?.user) {
				saveUser(session.user.id);
			}
		});

		return () => {
			authListener.subscription.unsubscribe();
		};
	}, []);

	return <>{children}</>;
}
