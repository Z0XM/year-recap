'use client';

import { useAuthStore } from '@/store/auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function Navbar() {
	const { user } = useAuthStore();

	const supabaseClient = createClient();

	if (user) {
		return (
			<div className='flex justify-between items-center px-4 py-2 md:px-6 md:py-4 border-b-2 border-green-400'>
				<Link href='/' className='md:text-2xl'>
					TheHandMadeSmiles
				</Link>
				<div className='flex gap-2 md:gap-6'>
					<Button className='md:text-lg rounded-md' onClick={() => supabaseClient.auth.signOut()}>
						Logout
					</Button>
					<Avatar className='cursor-pointer '>
						<AvatarImage src='https://github.com/shadcn.png' />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</div>
			</div>
		);
	}
	return <></>;
}
