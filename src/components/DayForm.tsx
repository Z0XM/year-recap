'use client';

import Form from 'next/form';
import { useActionState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { addDayData } from '@/actions/dayForm';
import { Button } from './ui/button';

export default function DayForm(props: { dayInt: number; userId: string }) {
	const { dayInt, userId } = props;
	const addDayAction = addDayData.bind(null, dayInt, userId);
	const [formState, formAction, pending] = useActionState(addDayAction, {
		message: ''
	});

	return (
		<>
			<div className='text-sm italic'>Note: All fields are optional. You can fill as much as you want.</div>
			<Form action={formAction} className='w-full my-4'>
				<div className='flex w-full flex-col gap-6'>
					<div className='w-full flex flex-col gap-2'>
						<Label htmlFor='day_score'>Rate your day out of 10.</Label>
						<Input name='day_score' type='number' placeholder='7' min={-1} max={11} step={1} />
					</div>
					<div className='w-full flex flex-col gap-2'>
						<Label htmlFor='day_word'>Describe today in short.</Label>
						<Input name='day_word' type='text' placeholder='Average' />
					</div>
					<div className='w-full flex flex-col gap-2'>
						<Label htmlFor='day_color'>Assign a color for today.</Label>
						<Input name='day_color' type='color' />
					</div>
					<div className='w-full flex flex-col gap-2'>
						<Label htmlFor='day_person'>A person to remember for today.</Label>
						<Input className='px-2 py-1' name='day_person' />
					</div>
					<div className='w-full flex flex-col gap-2'>
						<Label htmlFor='day_note'>Write a note about today.</Label>
						<Textarea className='px-2 py-1' name='day_note' placeholder='Today was a good day.' />
					</div>

					<Button type='submit' disabled={pending} className='w-full  text-white rounded p-2'>
						Submit
					</Button>
					{formState?.message && (
						<div className='text-red-500 text-sm mt-2 p-2 border border-red-500 rounded bg-red-100'>
							{formState.message}
						</div>
					)}
				</div>
			</Form>
		</>
	);
}
