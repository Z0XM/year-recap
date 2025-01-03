'use client';

import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { createClient } from '@/lib/supabase/client';
import { useAppInfo } from '@/store/appInfo';
import { useAuthStore } from '@/store/auth';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AppInfoProvider({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const supabaseClient = createClient();

	const { user } = useAuthStore();
	const { setDayInt, setHasFilledDayForm } = useAppInfo();

	const [isLoaded, setLoaded] = useState(false);
	const pathname = usePathname();

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
				.then(({ data }) => {
					if (data && data.length > 0) {
						setHasFilledDayForm(true);
					} else {
						setHasFilledDayForm(false);
					}
					setLoaded(true);
				});
		}
	}, [user]);

	if (!isLoaded && !pathname.startsWith('/p/login')) {
		return (
			<div className='w-screen h-screen flex items-center justify-center'>
				<LoadingSpinner size={48} />
			</div>
		);
	}

	return <>{children}</>;
}
