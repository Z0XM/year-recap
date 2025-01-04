import { z } from 'zod';

export const SignupFormSchema = z.object({
	display_name: z.string().min(2, { message: 'Name must be at least 2 characters long' }).trim(),
	email: z.string().email({ message: 'Please enter a valid email' }).trim(),
	password: z
		.string()
		.min(8, { message: 'Password must at least 8 characters long' })
		.regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
		.regex(/[0-9]/, { message: 'Password must contain at least one number' })
		// .regex(/[^a-zA-Z0-9]/, {
		// 	message: 'Password must contain at least one special character'
		// })
		.trim()
});

export const SigninFormSchema = SignupFormSchema.omit({ display_name: true });

export interface UserMetadata {
	display_name: string;
}
