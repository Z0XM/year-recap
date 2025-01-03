import type { Metadata } from 'next';
import { Patrick_Hand, Sour_Gummy } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const font_patrick = Patrick_Hand({
	weight: '400',
	subsets: ['latin']
});

const font_sour = Sour_Gummy({
	subsets: ['latin']
});

export const metadata: Metadata = {
	title: 'How was your day?',
	description: 'An effort by Z0XM'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${font_sour.className}`}>
				<Toaster />
				{children}
			</body>
		</html>
	);
}
