import PeopleOfToday from '@/components/PeopleOfToday';
import Link from 'next/link';
import { redirect } from 'next/navigation';

/**
 * [Server Rendered Page]
 * [Path: /]
 *
 *
 *
 */
export default async function Page() {
	redirect('/p/');
	// return (
	// 	<div className='flex flex-col w-screen h-screen justify-center items-center'>
	// 		<div className='mb-8 max-w-[80%] text-center flex justify-center items-center'>
	// 			<Link href={'/p/'} className='text-5xl text-center'>
	// 				How Was Your Day <span className='text-primary'>?</span>
	// 			</Link>
	// 		</div>
	// 		<Link href={'/p/'} className='text-lg mb-4 italic underline'>
	// 			Goto your form!
	// 		</Link>
	// 		<Link href={'/about'} className='text-lg mb-16 italic underline'>
	// 			Know more
	// 		</Link>
	// 		<PeopleOfToday />
	// 	</div>
	// );
}
