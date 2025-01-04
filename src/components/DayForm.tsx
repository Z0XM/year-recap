'use client';

import { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { createClient } from '@/lib/supabase/client';
import { DayDataSchema } from '@/lib/type-definitions/dayData';
import { useAppInfo } from '@/store/appInfo';
import { useRouter } from 'next/navigation';

async function addDayData(day_int: number, userId: string, formData: FormData) {
	const supabase = createClient();

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
			message: Object.values(validatedFields.error.flatten().fieldErrors).flat().join(', ')
		};
	}

	const { data, error } = await supabase.from('day_data').insert(validatedFields.data);

	if (error) {
		return {
			message: error.message
		};
	}
}

export default function DayForm(props: { dayInt: number; userId: string }) {
	const { dayInt, userId } = props;
	const [errorMsg, setErrorMsg] = useState('');

	const { setHasFilledDayForm } = useAppInfo();
	const router = useRouter();

	const [hasSubmitted, setHasSubmitted] = useState(false);

	return (
		<>
			<div className='text-sm italic'>Note: All fields are optional. You can fill as much as you want.</div>
			<form
				className='w-full my-4'
				onSubmit={(e) => {
					e.preventDefault();
					setHasSubmitted(true);
					const formData = new FormData(e.target as HTMLFormElement);
					addDayData(dayInt, userId, formData).then((error) => {
						if (error?.message) {
							setErrorMsg(error.message);
							setHasSubmitted(false);
						} else {
							setHasFilledDayForm(true);
							router.refresh();
						}
					});
				}}>
				<div className='flex w-full flex-col gap-6'>
					<div className='w-full flex flex-col gap-2'>
						<Label htmlFor='day_score' className='text-md'>
							Rate your day out of 10.
						</Label>
						<Input className='text-md' name='day_score' type='number' placeholder='7' min={-1} max={11} step={0.5} />
					</div>
					<div className='w-full flex flex-col gap-2'>
						<Label className='text-md' htmlFor='day_word'>
							Describe today in short.
						</Label>
						<Input className='text-md' name='day_word' type='text' placeholder='Average' />
					</div>
					<div className='w-full flex flex-col gap-2'>
						<Label className='text-md' htmlFor='day_color'>
							Assign a color for today.
						</Label>
						<Input className='text-md' name='day_color' type='color' />
					</div>
					<div className='w-full flex flex-col gap-2'>
						<Label className='text-md' htmlFor='day_person'>
							A person to remember for today.
						</Label>
						<Input className='px-2 py-1 text-md' name='day_person' />
					</div>
					<div className='w-full flex flex-col gap-2'>
						<Label htmlFor='day_note' className='text-md'>
							Write a note about today.
						</Label>
						<Textarea className='px-2 py-1 text-md' name='day_note' placeholder='Today was a good day.' />
					</div>

					<Button type='submit' disabled={hasSubmitted} className='w-full  text-md rounded p-2'>
						Submit
					</Button>
					{errorMsg && (
						<div className='text-red-500 text-sm mt-2 p-2 border border-red-500 rounded bg-red-100'>{errorMsg}</div>
					)}
				</div>
			</form>
		</>
	);
}
