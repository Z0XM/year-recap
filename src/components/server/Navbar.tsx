import Link from 'next/link';
import { Badge } from '../ui/badge';
import UserProfile from '../client/Profile';

export default async function Navbar() {
    return (
        <div className="flex items-center justify-between border-b-2 border-primary px-4 py-2 md:px-6 md:py-4">
            <Link href="/p" className="md:text-2xl">
                TheHandMadeSmiles
            </Link>
            <div className="flex items-center gap-2 md:gap-6">
                {/* <Logout /> */}
                <Link href={'/about'}>
                    <Badge variant={'outline'} className="hover:text-primary md:text-lg">
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
