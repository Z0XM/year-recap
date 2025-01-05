'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { SignupFormSchema } from '@/lib/type-definitions/login';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

async function onUpdatePassword(formData: FormData) {
	const supabase = createClient();

	const validatedFields = SignupFormSchema.pick({ password: true }).safeParse({
		password: formData.get('password')
	});

	// If validation fails, return an error message
	if (!validatedFields.success) {
		return {
			message: Object.values(validatedFields.error.flatten().fieldErrors).flat().join(', ')
		};
	}

	const { error } = await supabase.auth.updateUser({ password: validatedFields.data.password });

	if (error) {
		return {
			message: error.message
		};
	}
}

export default function ResetPasswordPage() {
	const router = useRouter();
	const [errorMsg, setErrorMsg] = useState('');

	return (
		<div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
			<div className='w-full max-w-sm'>
				<div className={cn('flex flex-col gap-6')}>
					<Link className='flex items-center gap-2 self-center font-medium' href='/about'>
						TheHandMadeSmiles
					</Link>
					<Card>
						<CardHeader>
							<CardTitle className='text-2xl'>Reset You Password</CardTitle>
							<CardDescription>Enter a new password for your email</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									const formData = new FormData(e.target as HTMLFormElement);
									onUpdatePassword(formData).then((error) => {
										if (error?.message) {
											setErrorMsg(error.message);
										} else {
											toast.success('Password updated successfully.');
											router.push('/p/');
										}
									});
								}}>
								<div className='flex flex-col gap-6'>
									{/* <div className='grid gap-2'>
										<Label htmlFor='email'>Email</Label>
										<Input name='email' type='email' disabled={true} placeholder='yourmail@example.com' required />
									</div> */}
									<div className='grid gap-2'>
										<div className='flex items-center'>
											<Label htmlFor='password'>New Password</Label>
										</div>
										<Input name='password' type='password' required />
									</div>
									<Button type='submit' className='w-full'>
										Update Password
									</Button>
									{errorMsg && (
										<div className='text-red-500 text-sm mt-2 p-2 border border-red-500 rounded bg-red-100'>
											{errorMsg}
										</div>
									)}
									{/* <Button variant='outline' className='w-full'>
								Login with Google
							</Button> */}
								</div>
								<div className='mt-4 text-center text-sm'>
									Already have an account?{' '}
									<Link href='/p/login?mode=sign-in' className='underline underline-offset-4'>
										Login instead
									</Link>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
