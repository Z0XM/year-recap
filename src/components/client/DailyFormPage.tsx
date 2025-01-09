'use client';

import DayForm from '@/components/client/DayForm';
import { useAppInfo } from '@/store/appInfo';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

export default function DailyFormPage({ hasFilledFormFallback }: { hasFilledFormFallback: React.ReactNode }) {
    const { user } = useAuthStore();
    const { hasFilledDayForm, dayInt } = useAppInfo();
    const today = new Date(new Date().getTime() - 12 * 60 * 60 * 1000);

    if (!user) {
        return <div>Please refresh...</div>;
    }

    if (hasFilledDayForm) {
        return (
            <div className="flex w-full flex-col items-center justify-center gap-16 py-6 md:px-10">
                <div className="mx-4 flex flex-col gap-4 md:w-1/2">
                    <HelloUser today={today} display_name={user.display_name} accent_color={user.accent_color} />
                    <div className="text-xl">
                        <span className="text-primary">Thankyou!</span> You have completed today&apos;s form.
                    </div>
                </div>
                <Suspense fallback={<></>}>{hasFilledFormFallback}</Suspense>
            </div>
        );
    }

    return (
        <div className="flex w-full items-center justify-center py-6 md:px-10">
            <div className="mx-4 flex flex-col gap-4 md:w-1/2">
                <HelloUser today={today} display_name={user.display_name} accent_color={user.accent_color} />
                <DayForm dayInt={dayInt} userId={user!.id} />
            </div>
        </div>
    );
}

function HelloUser(props: { today: Date; display_name: string; accent_color: string }) {
    const { today, display_name, accent_color } = props;
    return (
        <>
            <Card className="">
                <CardHeader className="px-6 py-4">
                    <CardTitle>
                        <div className="text-2xl text-white">
                            {today.toLocaleDateString('en-IN', { weekday: 'long' })}
                            <span style={{ color: accent_color }}>,</span>{' '}
                            {today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}
                        </div>
                    </CardTitle>
                    <CardDescription>
                        <span className="text-xl text-white">
                            {Math.ceil((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24))}
                        </span>
                        <span className="text-md text-gray-400">{` / ${today.getFullYear() % 4 === 0 ? 366 : 365}`}</span>
                    </CardDescription>
                </CardHeader>
                <Separator className="w-full" />
                <CardContent className="px-6 py-4">
                    <div className="text-2xl">
                        How was your day{' '}
                        <span style={{ color: accent_color }} className={`text-3xl font-bold`}>
                            {display_name}
                        </span>{' '}
                        ?
                    </div>
                    {/* <Link href={'/about'} className='text-lg italic underline'>
				Know more
			</Link> */}
                </CardContent>
            </Card>
        </>
    );
}
