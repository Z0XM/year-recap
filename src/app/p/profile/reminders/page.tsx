'use client';

import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { Switch } from '@/components/ui/switch';
import { createClient } from '@/lib/supabase/client';
import { reminderSettingsSchema } from '@/lib/type-definitions/settings';
import { useAuthStore } from '@/store/auth';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

export default function RemindersPage() {
	const { user } = useAuthStore();
	const [reminders, setReminders] = useState<z.infer<typeof reminderSettingsSchema> | null>(null);
	const [errorMsg, setErrorMsg] = useState('');

	const supabase = createClient();

	async function onSave(formData: FormData) {
		const supabase = createClient();

		const validatedFields = reminderSettingsSchema.safeParse({
			enable_daily: formData.get('enable_daily') === 'on',
			enable_weekly: formData.get('enable_weekly') === 'on',
			enable_monthly: formData.get('enable_monthly') === 'on'
		});

		// If validation fails, return an error message
		if (!validatedFields.success) {
			return {
				message: Object.values(validatedFields.error.flatten().fieldErrors).flat().join(', ')
			};
		}

		if (Object.keys(validatedFields.data).length === 0) return;

		const { error, data } = await supabase
			.from('user_reminder_settings')
			.update(validatedFields.data)
			.eq('user_id', user!.id);

		if (error) {
			return {
				message: error.message
			};
		}
		setReminders(validatedFields.data);
	}

	useEffect(() => {
		supabase
			.from('user_reminder_settings')
			.select('enable_daily, enable_weekly, enable_monthly')
			.eq('user_id', user!.id)
			.then(({ data, error }) => {
				if (error) {
					setErrorMsg(error.message);
					return;
				}
				setReminders(data[0]);
			});
	}, []);

	if (!user) return null;

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				const formData = new FormData(e.target as HTMLFormElement);
				onSave(formData).then((error) => {
					if (error?.message) {
						setErrorMsg(error.message);
					} else {
						setErrorMsg('');
						toast.success('Updated successfully.');
					}
				});
			}}>
			<CardHeader>
				<CardTitle>Reminders</CardTitle>
				<CardDescription>Update your reminder and mail configurations.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='w-full flex flex-col gap-4'>
					{reminders ? (
						<>
							<div className='flex justify-start items-center gap-4'>
								<Switch name='enable_daily' defaultChecked={reminders.enable_daily} />
								<Label htmlFor='enable_daily'>Daily Reminders</Label>
							</div>
							<div className='flex justify-start items-center gap-4'>
								<Switch name='enable_weekly' disabled={true} defaultChecked={reminders.enable_weekly} />
								<Label htmlFor='enable_weekly'>Weekly Reminders</Label>
							</div>
							<div className='flex justify-start items-center gap-4'>
								<Switch name='enable_monthly' disabled={true} defaultChecked={reminders.enable_monthly} />
								<Label htmlFor='enable_monthly'>Monthly Reminders</Label>
							</div>
						</>
					) : (
						<LoadingSpinner size={32} />
					)}
					{errorMsg && (
						<div className='text-red-500 text-sm mt-2 p-2 border border-red-500 rounded bg-red-100'>{errorMsg}</div>
					)}
				</div>
			</CardContent>
			<CardFooter className='flex gap-4 w-full justify-between'>
				<Button className='' variant='secondary' type='reset'>
					Cancel
				</Button>
				<Button className='' type='submit'>
					Save
				</Button>
			</CardFooter>
		</form>
	);
}
