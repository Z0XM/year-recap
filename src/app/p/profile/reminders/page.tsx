'use client';

import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppInfo } from '@/store/appInfo';
import { useAuthStore } from '@/store/auth';

export default function RemindersPage() {
	const { user } = useAuthStore();
	const {} = useAppInfo();

	if (!user) return null;

	return (
		<form>
			<CardHeader>
				<CardTitle>Reminders</CardTitle>
				<CardDescription>Update your reminder and mail configurations.</CardDescription>
			</CardHeader>
			<CardContent>
				{/* <div className='flex gap-8 w-full justify-start'>
					<div className='max-w-36'>
						<Label>Your Name</Label>
						<Input placeholder={`${user.display_name}`} />
					</div>
					<div className='max-w-36'>
						<Label>Avatar</Label>
						<Input type='file' disabled={true} />
					</div>
				</div> */}
			</CardContent>
			<CardFooter className='flex gap-4 w-full justify-between'>
				<Button className='' variant='secondary'>
					Cancel
				</Button>
				<Button className=''>Save</Button>
			</CardFooter>
		</form>
	);
}
