import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

export function HelloUser(props: { today: Date; display_name: string; dayInt: number }) {
    const { today, display_name, dayInt } = props;
    const noOfDaysInYear = today.getFullYear() % 4 === 0 ? 366 : 365;
    const todayCountOfDay = Math.ceil((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24));
    return (
        <>
            <Card className="">
                <CardHeader className="px-6 py-4">
                    <CardTitle>
                        <div className="text-2xl text-white">
                            {today.toLocaleDateString('en-IN', { weekday: 'long' })}
                            <span className="text-primary">,</span>{' '}
                            {today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}
                        </div>
                    </CardTitle>
                    <CardDescription>
                        <span className="text-xl text-white">{todayCountOfDay}</span>
                        <span className="text-md text-gray-400">{` / ${noOfDaysInYear}`}</span>
                    </CardDescription>
                </CardHeader>
                <Progress value={(todayCountOfDay / noOfDaysInYear) * 100} className="w-full" />
                {/* <Separator className="w-full" /> */}
                <CardContent className="px-6 py-4">
                    <div className="text-2xl">
                        How was your day <span className={`text-3xl font-bold text-primary`}>{display_name}</span> ?
                    </div>
                    {/* <Link href={'/about'} className='text-lg italic underline'>
				Know more
			</Link> */}
                </CardContent>
            </Card>
            <div className="flex w-full flex-wrap items-center justify-between gap-2">
                <Link
                    href="/p/dashboard/"
                    className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border bg-background px-4 py-2 text-sm font-medium text-card-foreground shadow transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                    Private Dashboard
                </Link>
                <Link
                    href="/p/dashboard/public"
                    className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border bg-background px-4 py-2 text-sm font-medium text-card-foreground shadow transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                    Public Dashboard
                </Link>
                <Link
                    href="/p/month-end"
                    className="inline-flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border bg-background px-4 py-2 text-sm font-medium text-card-foreground shadow transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                    Month End Form
                </Link>
            </div>
        </>
    );
}
