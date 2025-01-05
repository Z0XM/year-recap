import Link from 'next/link';
import { Badge } from '../ui/badge';
import UserProfile from '../client/Profile';

export default async function Navbar() {
	return (
		<div className='flex justify-between items-center px-4 py-2 md:px-6 md:py-4 border-b-2 border-green-400'>
			<Link href='/' className='md:text-2xl'>
				TheHandMadeSmiles
			</Link>
			<div className='flex gap-2 md:gap-6 items-end'>
				{/* <Logout /> */}
				<Link href={'/about'}>
					<Badge variant={'outline'} className='md:text-lg'>
						About us
					</Badge>
				</Link>
				{/* <Avatar className='cursor-pointer '>
					<AvatarImage src='https://github.com/shadcn.png' />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar> */}
				<UserProfile />
			</div>
		</div>
	);
}
