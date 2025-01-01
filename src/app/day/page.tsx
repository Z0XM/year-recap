'use client';

import Form from 'next/form';
import { useActionState } from 'react';
import { addDayData } from './actions';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Page() {
	// const userMetadata = data.user.user_metadata as UserMetadata;
	const today = new Date(new Date().getTime() - 12 * 60 * 60 * 1000);
	const dayInt = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
	const addDayAction = addDayData.bind(null, dayInt);
	const [formState, formAction, pending] = useActionState(addDayAction, {
		message: ''
	});

	return (
		<div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
			<div className='flex flex-col w-1/2 text-center gap-4'>
				<div className=' text-2xl font-semibold text-white'>
					{today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}
				</div>
				<div className=' text-white'>
					<span className='text-2xl'>
						{Math.ceil((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24))}
					</span>
					<span className='text-lg text-gray-400'>{` / ${today.getFullYear() % 4 === 0 ? 366 : 365}`}</span>
				</div>
				<div>
					How was your day <span className='font-bold text-yellow-500'>Z0XM</span> ?{/* {userMetadata.display_name} */}
				</div>
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

						<button type='submit' disabled={pending} className='w-full bg-yellow-500 text-white rounded p-2'>
							Submit
						</button>
						{formState?.message && (
							<div className='text-red-500 text-sm mt-2 p-2 border border-red-500 rounded bg-red-100'>
								{formState.message}
							</div>
						)}
					</div>
				</Form>
			</div>
		</div>
	);
}
