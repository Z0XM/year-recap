import AppProviders from '@/providers';
import Navbar from '@/components/Navbar';

/**
 * [Server Rendered Layout]
 * [Path: /p/*]
 * [Maintains State of Authentication]
 *
 * If not logged in, redirects /p/login.
 *
 */
export default function PrivateLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AppProviders>
			<Navbar />
			{children}
		</AppProviders>
	);
}
