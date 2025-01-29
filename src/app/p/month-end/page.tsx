'use client';

import { useAppInfo } from '@/store/appInfo';
import { useAuthStore } from '@/store/auth';
import { HelloUser } from '@/components/client/HelloUser';
import MonthForm from '@/components/client/MonthForm';

export default function MonthlyFormPage() {
    const { user } = useAuthStore();
    const { dayInt } = useAppInfo();
    const today = new Date(new Date().getTime() - 12 * 60 * 60 * 1000);

    if (!user) {
        return <div>Please refresh...</div>;
    }

    return (
        <div className="flex w-full items-center justify-center py-6 md:px-10">
            <div className="mx-4 flex flex-col gap-4 md:w-1/2">
                <HelloUser today={today} display_name={user.display_name} dayInt={dayInt} type="month" />
                <MonthForm dayInt={dayInt} userId={user!.id} />
            </div>
        </div>
    );
}
