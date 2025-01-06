'use client';

import AuthProvider from './auth';
import AppInfoProvider from './appInfo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function AppProviders({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [queryClient] = useState(() => new QueryClient());
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<AppInfoProvider>{children}</AppInfoProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}
