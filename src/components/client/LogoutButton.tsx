'use client';

import { createClient } from '@/lib/supabase/client';
import { Button } from '../ui/button';
import { SignOut } from '@phosphor-icons/react';

export function LogoutButton() {
	const supabaseClient = createClient();

	return (
		<Button className='md:text-lg rounded-md' onClick={() => supabaseClient.auth.signOut()}>
			Logout
		</Button>
	);
}

export function LogoutMinimal() {
	const supabaseClient = createClient();

	return (
		<Button variant={'outline'} onClick={() => supabaseClient.auth.signOut()}>
			<SignOut size={32} />
			Logout
		</Button>
	);
}
