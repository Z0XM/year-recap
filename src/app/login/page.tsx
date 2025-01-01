'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInOrSignUp } from './actions';
import Link from 'next/link';
import Form from 'next/form';
import { use, useActionState } from 'react';

export default function LoginPage({
	searchParams
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const { mode } = use(searchParams);

	const signInOrSignUpAction =
		mode === 'sign-up' ? signInOrSignUp.bind(null, 'sign-up') : signInOrSignUp.bind(null, 'sign-in');

	const [formState, formAction, pending] = useActionState(signInOrSignUpAction, { message: '' });

	return (
		<div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
			<div className='w-full max-w-sm'>
				<div className={cn('flex flex-col gap-6')}>
					<Card>
						<CardHeader>
							<CardTitle className='text-2xl'>Login</CardTitle>
							<CardDescription>Enter your email below to login to your account</CardDescription>
						</CardHeader>
						<CardContent>
							<Form action={formAction}>
								<div className='flex flex-col gap-6'>
									{mode === 'sign-up' && (
										<div className='grid gap-2'>
											<Label htmlFor='display_name'>Display Name</Label>
											<Input name='display_name' type='text' placeholder='Ben 10' required />
										</div>
									)}
									<div className='grid gap-2'>
										<Label htmlFor='email'>Email</Label>
										<Input name='email' type='email' placeholder='yourmail@example.com' required />
									</div>
									<div className='grid gap-2'>
										<div className='flex items-center'>
											<Label htmlFor='password'>Password</Label>
											<a href='#' className='ml-auto inline-block text-sm underline-offset-4 hover:underline'>
												Forgot your password?
											</a>
										</div>
										<Input name='password' type='password' required />
									</div>
									{mode === 'sign-up' ? (
										<Button type='submit' disabled={pending} className='w-full'>
											Sign up
										</Button>
									) : (
										<Button type='submit' disabled={pending} className='w-full'>
											Login
										</Button>
									)}
									{formState?.message && (
										<div className='text-red-500 text-sm mt-2 p-2 border border-red-500 rounded bg-red-100'>
											{formState.message}
										</div>
									)}
									{/* <Button variant='outline' className='w-full'>
								Login with Google
							</Button> */}
								</div>
								{mode === 'sign-up' ? (
									<div className='mt-4 text-center text-sm'>
										Already have an account?{' '}
										<Link href='?mode=sign-in' className='underline underline-offset-4'>
											Login instead
										</Link>
									</div>
								) : (
									<div className='mt-4 text-center text-sm'>
										Don&apos;t have an account?{' '}
										<Link href='?mode=sign-up' className='underline underline-offset-4'>
											Sign up
										</Link>
									</div>
								)}
							</Form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
