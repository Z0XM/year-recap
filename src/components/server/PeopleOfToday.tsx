import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 60;

export default async function PeopleOfToday() {
	const supabase = await createClient();

	const today = new Date(new Date().getTime() - 12 * 60 * 60 * 1000);
	const dayInt = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

	const { data: userArray, error: userError } = await supabase
		.from('users')
		.select('id, display_name')
		.eq('isActive', true)
		.limit(100);

	if (userError || !userArray) {
		console.error(userError);
		return <div className='w-screen h-screen flex justify-center items-center'>Something Went Wrong!</div>;
	}

	const { data: hasFilledForms, error: hasFilledFormError } = await supabase
		.from('day_data')
		.select('id, user_id')
		.eq('day_int', dayInt)
		.in(
			'user_id',
			userArray.map((x) => x.id)
		);

	if (hasFilledFormError || !hasFilledForms) {
		console.error(hasFilledFormError);
		return <div className='w-screen h-screen flex justify-center items-center'>Something Went Wrong!</div>;
	}

	const { data: dayCounts, error: dayCountError } = await supabase
		.from('day_data')
		.select('user_id, day_int.count()')
		.in(
			'user_id',
			userArray.map((x) => x.id)
		);

	if (dayCountError || !dayCounts) {
		console.error(dayCountError);
		return <div className='w-screen h-screen flex justify-center items-center'>Something Went Wrong!</div>;
	}

	const hasFilledMap: { [key: string]: boolean } = {};
	hasFilledForms.forEach((userData) => {
		hasFilledMap[userData.user_id] = true;
	});

	const dayCountMap: { [key: string]: number } = {};
	dayCounts.forEach((user) => {
		dayCountMap[user.user_id] = user.count;
	});

	return (
		<div className='flex flex-row gap-4 flex-wrap max-w-[90%] justify-center'>
			{userArray
				.sort((a, b) => (a.display_name as string).localeCompare(b.display_name as string))
				.map((user, index) => {
					if (hasFilledMap[user.id]) {
						return (
							<Badge key={index} variant={'outline'} className='text-md text-black bg-primary '>
								{user.display_name} {dayCountMap[user.id] ?? 0}
								<span className='text-sm text-gray-800'>/{today.getFullYear() % 4 === 0 ? 366 : 365}</span>
							</Badge>
						);
					} else {
						return (
							<Badge key={index} variant={'outline'} className='text-md  bg-secondary '>
								{user.display_name} {dayCountMap[user.id] ?? 0}
								<span className='text-sm text-gray-300'>/{today.getFullYear() % 4 === 0 ? 366 : 365}</span>
							</Badge>
						);
					}
				})}
		</div>
	);
}
