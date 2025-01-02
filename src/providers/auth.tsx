'use client';

import { createClient } from '@/lib/supabase/client';
import * as Model from '@/lib/type-definitions/models';
import { useAuthStore } from '@/store/auth';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function AuthProvider({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const supabaseClient = createClient();

	const { login, logout, user } = useAuthStore();

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
						} else {
							console.error(error);
							toast.error('User not found');
						}
					});
			};

			if (event === 'SIGNED_IN' && session?.user && !user) {
				saveUser(session.user.id);
			} else if (event === 'SIGNED_OUT') {
				logout();
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
