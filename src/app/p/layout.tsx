import AppProviders from '@/providers';
import Navbar from '@/components/Navbar';

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
