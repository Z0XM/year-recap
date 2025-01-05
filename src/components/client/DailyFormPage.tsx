'use client';

import DayForm from '@/components/client/DayForm';
import { useAppInfo } from '@/store/appInfo';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';
import { Suspense } from 'react';

export default function DailyFormPage({ hasFilledFormFallback }: { hasFilledFormFallback: React.ReactNode }) {
	const { user } = useAuthStore();
	const { hasFilledDayForm, dayInt } = useAppInfo();
	const today = new Date(new Date().getTime() - 12 * 60 * 60 * 1000);

	if (!user) {
		return <div>Please refresh...</div>;
	}

	if (hasFilledDayForm) {
		return (
			<div className='flex w-full items-center flex-col justify-center p-6 gap-16 md:p-10'>
				<div className='flex flex-col w-3/4 md:w-1/2 text-center gap-4'>
					<HelloUser today={today} display_name={user.display_name} />
					<div className='text-xl'>
						<span className='text-green-400'>Thankyou!</span> You have completed today&apos;s form.
					</div>
				</div>
				<Suspense fallback={<></>}>{hasFilledFormFallback}</Suspense>
			</div>
		);
	}

	return (
		<div className='flex w-full items-center justify-center p-6 md:p-10'>
			<div className='flex flex-col w-3/4 md:w-1/2 text-center gap-4'>
				<HelloUser today={today} display_name={user.display_name} />
				<DayForm dayInt={dayInt} userId={user!.id} />
			</div>
		</div>
	);
}

function HelloUser(props: { today: Date; display_name?: string }) {
	const { today, display_name } = props;
	return (
		<>
			<div className=' text-2xl font-semibold text-white'>
				{today.toLocaleDateString('en-IN', { weekday: 'long' })},{' '}
				{today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}
			</div>
			<div className=' text-white'>
				<span className='text-2xl'>
					{Math.ceil((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24))}
				</span>
				<span className='text-lg text-gray-400'>{` / ${today.getFullYear() % 4 === 0 ? 366 : 365}`}</span>
			</div>
			<div className='text-2xl'>
				How was your day {display_name && <span className='font-bold text-yellow-500 text-3xl'>{display_name}</span>} ?
			</div>
			<Link href={'/about'} className='text-lg italic underline'>
				Know more
			</Link>
		</>
	);
}
