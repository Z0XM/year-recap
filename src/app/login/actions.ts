'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SigninFormSchema, SignupFormSchema } from '@/lib/type-definitions/login';
import { getURL } from '@/lib/utils';

// export async function signIn(formData: FormData) {
// 	console.log(Array.from(formData.entries()));
// 	signInOrSignUp(formData, 'sign-in');
// }

// export async function signUp(formData: FormData) {
// 	signInOrSignUp(formData, 'sign-up');
// }
export async function signInOrSignUp(mode: 'sign-in' | 'sign-up', prevState: { message: string }, formData: FormData) {
	const supabase = await createClient();

	const validatedFields = (mode === 'sign-up' ? SignupFormSchema : SigninFormSchema).safeParse({
		display_name: formData.get('display_name'),
		email: formData.get('email'),
		password: formData.get('password')
	});

	// If any form fields are invalid, return early
	// if (!validatedFields.success) {
	// 	const errors = validatedFields.error.flatten().fieldErrors;
	// 	const errorMessage = Object.values(errors).flat().join(', ');
	// 	return redirect(`/login?mode=${mode}&error=${encodeURIComponent(errorMessage)}`);
	// }

	if (!validatedFields.success) {
		return {
			// errors: validatedFields.error.flatten().fieldErrors,
			message: Object.values(validatedFields.error.flatten().fieldErrors).flat().join(', ')
		};
	}

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
						emailRedirectTo: getURL()
					}
			  })
			: await supabase.auth.signInWithPassword({
					email: validatedFields.data.email,
					password: validatedFields.data.password
			  });
	if (error) {
		return {
			message: error.message
		};
		// redirect(`/login?mode=${mode}&error=${encodeURIComponent(error.message)}`);
	}

	revalidatePath('/', 'layout');
	redirect('/');
}
