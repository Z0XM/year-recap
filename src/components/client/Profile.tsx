'use client';

import { useAuthStore } from '@/store/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Fire, Note, SignOut, Stack, UserCircle } from '@phosphor-icons/react';
import { useAppInfo } from '@/store/appInfo';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function UserProfile() {
    const { user } = useAuthStore();
    const { totalFilledDays } = useAppInfo();

    const supabaseClient = createClient();

    const today = new Date(new Date().getTime() - 12 * 60 * 60 * 1000);

    if (user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar className="h-[2.2em] w-[2.2em] cursor-pointer">
                        <AvatarImage src="/" />
                        <AvatarFallback style={{ color: user.accent_color }}>
                            {user.display_name
                                .split(' ')
                                .map((x) => x[0])
                                .join('')}
                        </AvatarFallback>
                    </Avatar>
                    {/* <Avatar name='Mukul Singh' round='100%' size={'37'} textSizeRatio={3} maxInitials={2} /> */}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mx-4">
                    <DropdownMenuLabel className="text-center text-lg">
                        Hello, <span className="text-primary">{user.display_name}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/p/">
                        <DropdownMenuItem className="text-md cursor-pointer">
                            <Fire className="text-primary" size={32} />
                            <span>{totalFilledDays}</span> / {today.getFullYear() % 4 === 0 ? 366 : 365}
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/p/profile/">
                        <DropdownMenuItem className="text-md cursor-pointer">
                            <UserCircle className="text-primary" size={32} />
                            Profile
                        </DropdownMenuItem>
                    </Link>
                    {/* <DropdownMenuItem className='cursor-pointer'>
						<GearSix className='text-primary' size={32} />
						Reminders
					</DropdownMenuItem> */}
                    <Link href="https://forms.gle/rUh7TePrr5E8w15E6" target="_blank" rel="noopener noreferrer">
                        <DropdownMenuItem className="text-md cursor-pointer">
                            <Note className="text-primary" size={32} />
                            Feedback
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="text-md cursor-pointer">
                        <Stack className="text-primary" size={32} />
                        Backlogs
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-md cursor-pointer" onClick={() => supabaseClient.auth.signOut()}>
                        <SignOut className="text-primary" size={32} />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

    return <></>;
}
