'use client';

import { createClient } from '@/lib/supabase/client';
import { useAppInfo } from '@/store/appInfo';
import { useAuthStore } from '@/store/auth';
import { useEffect } from 'react';

export default function AppInfoProvider({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const supabaseClient = createClient();

	const { user } = useAuthStore();
	const { setDayInt, setHasFilledDayForm } = useAppInfo();

	useEffect(() => {
		const today = new Date(new Date().getTime() - 12 * 60 * 60 * 1000);
		const dayInt = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

		setDayInt(dayInt);
		if (user) {
			supabaseClient
				.from('day_data')
				.select()
				.eq('user_id', user.id)
				.eq('day_int', dayInt)
				.single()
				.then(({ data }) => {
					if (data) {
						setHasFilledDayForm(true);
					} else {
						setHasFilledDayForm(false);
					}
				});
		}
	}, [user]);

	return <>{children}</>;
}
