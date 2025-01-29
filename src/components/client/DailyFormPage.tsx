'use client';

import DayForm from '@/components/client/DayForm';
import { useAppInfo } from '@/store/appInfo';
import { useAuthStore } from '@/store/auth';
import { Suspense } from 'react';
import Link from 'next/link';
import { HelloUser } from './HelloUser';

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
