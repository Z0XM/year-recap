'use client';

import { cn, getURL } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { use, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SigninFormSchema, SignupFormSchema } from '@/lib/type-definitions/login';
import { useRouter } from 'next/navigation';

/**
 * Handles user sign-in or sign-up based on the provided mode and form data.
 *
 * @param mode - The mode of authentication, either 'sign-in' or 'sign-up'.
 * @param formData - The form data containing user credentials.
 * @returns An object containing an error message if validation or authentication fails.
 *
 * The function performs the following steps:
 * 1. Creates a Supabase client instance.
 * 2. Validates the form fields based on the mode (sign-up or sign-in).
 * 3. If validation fails, returns an error message.
 * 4. Performs sign-up or sign-in based on the mode.
 * 5. If there is an error during sign-up or sign-in, returns the error message.
 */
async function signInOrSignUp(mode: 'sign-in' | 'sign-up', formData: FormData) {
	const supabase = createClient(); // Create a Supabase client instance

	// Validate the form fields based on the mode (sign-up or sign-in)
	const validatedFields = (mode === 'sign-up' ? SignupFormSchema : SigninFormSchema).safeParse({
		display_name: formData.get('display_name'),
		email: formData.get('email'),
		password: formData.get('password')
	});

	// If validation fails, return an error message
	if (!validatedFields.success) {
		return {
			message: Object.values(validatedFields.error.flatten().fieldErrors).flat().join(', ')
		};
	}

	// Perform sign-up or sign-in based on the mode
	const { error } =
		mode === 'sign-up'
			? await supabase.auth.signUp({
					email: validatedFields.data.email,
					password: validatedFields.data.password,
					options: {
						data: {
							//@ts-expect-error display_name will be in signup schema
							display_name: validatedFields.data.display_name
						},
						emailRedirectTo: getURL() // Redirect URL after email confirmation
					}
			  })
			: await supabase.auth.signInWithPassword({
					email: validatedFields.data.email,
					password: validatedFields.data.password
			  });

	// If there is an error during sign-up or sign-in, return the error message
	if (error) {
		return {
			message: error.message
		};
	}
}

/**
 * [Client Rendered Page]
 * [Authentication Not Required]
 * [Path: /p/login]
 *
 * If logged in, redirects /p/.
 * @see /lib/supabase/middleware.ts
 *
 * The `LoginPage` component renders a login or sign-up form based on the URL search parameters.
 * It supports both login and sign-up modes, displaying appropriate fields and buttons for each mode.
 *
 */
export default function LoginPage({
	searchParams
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const { mode: paramsMode } = use(searchParams);
	const router = useRouter();
	const [errorMsg, setErrorMsg] = useState('');

	const mode = paramsMode === 'sign-up' ? 'sign-up' : 'sign-in';

	return (
		<div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
			<div className='w-full max-w-sm'>
				<div className={cn('flex flex-col gap-6')}>
					<Link className='flex items-center gap-2 self-center font-medium' href='/about'>
						TheHandMadeSmiles
					</Link>
					<Card>
						<CardHeader>
							<CardTitle className='text-2xl'>Login</CardTitle>
							<CardDescription>Enter your email below to login to your account</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									const formData = new FormData(e.target as HTMLFormElement);
									signInOrSignUp(mode, formData).then((error) => {
										if (error?.message) {
											setErrorMsg(error.message);
										}
									});
									router.refresh();
								}}>
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
										<Button type='submit' className='w-full'>
											Sign up
										</Button>
									) : (
										<Button type='submit' className='w-full'>
											Login
										</Button>
									)}
									{errorMsg && (
										<div className='text-red-500 text-sm mt-2 p-2 border border-red-500 rounded bg-red-100'>
											{errorMsg}
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
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
