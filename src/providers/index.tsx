'use client';

import AuthProvider from './auth';
import AppInfoProvider from './appInfo';

export default function AppProviders({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AuthProvider>
			<AppInfoProvider>{children}</AppInfoProvider>
		</AuthProvider>
	);
}
