import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Page() {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();

	if (!data || !data.user) {
		return redirect('/login');
	}

	const today = new Date(new Date().getTime() - 12 * 60 * 60 * 1000);
	const dayInt = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

	const alreadyExists = await supabase.from('day_data').select().eq('user_id', data.user.id).eq('day_int', dayInt);

	if (alreadyExists.data?.length) {
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
						How was your day <span className='font-bold text-yellow-500'>Z0XM</span> ?
						{/* {userMetadata.display_name} */}
					</div>
					<div>You have completed today&apos;s form.</div>
				</div>
			</div>
		);
	}

	redirect('/day');
}
