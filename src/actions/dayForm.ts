'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { DayDataSchema } from '@/lib/type-definitions/dayData';

export async function addDayData(day_int: number, userId: string, prevState: { message: string }, formData: FormData) {
	const supabase = await createClient();

	const metadata: { [key: string]: unknown } = {};

	for (const [key, value] of formData.entries()) {
		if (!key.startsWith('$')) {
			metadata[key] = value;
		}
	}

	const validatedFields = DayDataSchema.safeParse({
		day_int: day_int,
		metadata,
		user_id: userId
	});

	if (!validatedFields.success) {
		return {
			// errors: validatedFields.error.flatten().fieldErrors,
			message: Object.values(validatedFields.error.flatten().fieldErrors).flat().join(', ')
		};
	}
	const alreadyExists = await supabase
		.from('day_data')
		.select()
		.eq('user_id', validatedFields.data.user_id)
		.eq('day_int', validatedFields.data.day_int);

	if (alreadyExists.data?.length) {
		redirect('/');
	}

	const { data, error } = await supabase.from('day_data').insert(validatedFields.data);

	if (error) {
		return {
			message: error.message
		};
	}

	revalidatePath('/', 'layout');
	redirect('/');
}
