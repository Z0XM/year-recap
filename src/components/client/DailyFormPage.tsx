'use client';

import DayForm from '@/components/client/DayForm';
import { useAppInfo } from '@/store/appInfo';
import { useAuthStore } from '@/store/auth';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import Link from 'next/link';
import { Progress } from '../ui/progress';

type DailyFormProps =
    | {
          hasFilledFormFallback: React.ReactNode;
          mode: 'fill';
      }
    | {
          mode: 'edit';
      };

export default function DailyFormPage(props: DailyFormProps) {
    const { user } = useAuthStore();
    const { hasFilledDayForm, dayInt, dayMetadata } = useAppInfo();
    const today = new Date(new Date().getTime() - 12 * 60 * 60 * 1000);

    if (!user) {
        return <div>Please refresh...</div>;
    }

    if (props.mode === 'fill' && hasFilledDayForm) {
        return (
            <div className="flex w-full flex-col items-center justify-center py-6 md:px-10">
                <div className="mx-4 flex flex-col gap-4 md:w-1/2">
                    <HelloUser today={today} display_name={user.display_name} dayInt={dayInt} />
                    <div className="text-xl">
                        <span className="text-primary">Thankyou!</span> You have completed today&apos;s form.
                        <Link href="/p/edit" className="mx-2 text-lg underline duration-200 hover:text-primary">
                            Click here to edit
                        </Link>
                    </div>
                </div>
                <Suspense fallback={<></>}>{props.hasFilledFormFallback}</Suspense>
            </div>
        );
    }

    return (
        <div className="flex w-full items-center justify-center py-6 md:px-10">
            <div className="mx-4 flex flex-col gap-4 md:w-1/2">
                <HelloUser today={today} display_name={user.display_name} dayInt={dayInt} />
                {props.mode === 'edit' && (
                    <div className="text-xl">
                        <span className="text-primary">You are editing!</span> You have completed today&apos;s form.
                    </div>
                )}
                <DayForm dayInt={dayInt} userId={user!.id} initialValues={dayMetadata} />
            </div>
        </div>
    );
}

function HelloUser(props: { today: Date; display_name: string; dayInt: number }) {
    const { today, display_name, dayInt } = props;
    const noOfDaysInYear = today.getFullYear() % 4 === 0 ? 366 : 365;
    const todayCountOfDay = Math.ceil((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24));
    return (
        <>
            <Card className="">
                <CardHeader className="px-6 py-4">
                    <CardTitle>
                        <div className="text-2xl text-white">
                            {today.toLocaleDateString('en-IN', { weekday: 'long' })}
                            <span className="text-primary">,</span>{' '}
                            {today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}
                        </div>
                    </CardTitle>
                    <CardDescription>
                        <span className="text-xl text-white">{todayCountOfDay}</span>
                        <span className="text-md text-gray-400">{` / ${noOfDaysInYear}`}</span>
                    </CardDescription>
                </CardHeader>
                <Progress value={(todayCountOfDay / noOfDaysInYear) * 100} className="w-full" />
                {/* <Separator className="w-full" /> */}
                <CardContent className="px-6 py-4">
                    <div className="text-2xl">
                        How was your day <span className={`text-3xl font-bold text-primary`}>{display_name}</span> ?
                    </div>
                    {/* <Link href={'/about'} className='text-lg italic underline'>
				Know more
			</Link> */}
                </CardContent>
            </Card>
        </>
    );
}
