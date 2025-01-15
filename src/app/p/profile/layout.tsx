import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { GearSix, List } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="mt-16 hidden w-full items-center justify-center sm:flex">
                <div className="flex w-[90%] items-start justify-center lg:w-[50%]">
                    <div className="flex w-[30%] flex-col justify-start gap-2 px-8 py-4 text-right">
                        <Link href="/p/profile">
                            <Badge variant="outline" className="cursor-pointer text-lg hover:text-primary">
                                Profile
                            </Badge>
                        </Link>
                        <Link href="/p/profile/reminders">
                            <Badge variant="outline" className="cursor-pointer text-lg hover:text-primary">
                                Reminders
                            </Badge>
                        </Link>
                    </div>
                    <div className="">
                        <Card className="">{children}</Card>
                    </div>
                </div>
            </div>
            <div className="mt-16 flex w-full flex-col items-start justify-start gap-2 p-16 sm:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className="flex items-center justify-start gap-2">
                            <List size={32} className="text-primary" /> Settings
                            {/* <GearSix size={32} className="animate-spin text-primary" /> Settings */}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                        {/* <DropdownMenuSeparator /> */}
                        <Link href="/p/profile">
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                        </Link>
                        <Link href="/p/profile/reminders">
                            <DropdownMenuItem>Reminders</DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Card className="w-full">{children}</Card>
            </div>
        </>
    );
}
