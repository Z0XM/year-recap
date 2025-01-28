'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SecurityClient } from '@/lib/encryption';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';

const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: 'hsl(var(--primary))'
    }
} satisfies ChartConfig;

export function PublicMonthDashboard() {
    const supabase = createClient();
    const { user } = useAuthStore();

    const today = new Date(new Date().getTime() - 12 * 60 * 60 * 1000);

    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month, 0).getDate();
    };

    const daysInSelectedMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1).getDay();

    const publicMonthQuery = useQuery({
        queryKey: ['public-month', selectedMonth, selectedYear],
        queryFn: async () => {
            const selectedMonthInt = selectedYear * 10000 + selectedMonth * 100;
            const selectedRange = [selectedMonthInt, selectedMonthInt + 99];

            const access = await supabase
                .from('dashboard_shares')
                .select('user_id, access')
                .eq('month', selectedMonth)
                .eq('year', selectedYear);

            if (access.error || !access.data) {
                throw access.error;
            }

            const accessMap: { [key: string]: { shareColors: boolean; shareScores: boolean; shareEmojis: boolean } } = {};

            access.data.forEach((accessData) => {
                if (!accessMap[accessData.user_id]) {
                    accessMap[accessData.user_id] = {
                        shareColors: false,
                        shareScores: false,
                        shareEmojis: false
                    };
                }
                accessMap[accessData.user_id].shareColors = accessData.access === '--color--';
                accessMap[accessData.user_id].shareScores = accessData.access === '--score--';
                accessMap[accessData.user_id].shareEmojis = accessData.access === '--emoji--';
            });

            const userArray = await supabase
                .from('users')
                .select('id, display_name, accent_color')
                .in('id', Object.keys(accessMap))
                .eq('isActive', true);

            if (userArray.error || !userArray.data) {
                throw userArray.error;
            }

            const publicUserIds = userArray.data.map((x) => x.id);

            const userMap: { [key: string]: { display_name: string; accent_color: string } } = {};
            userArray.data.forEach((userData) => {
                userMap[userData.id] = {
                    display_name: userData.display_name,
                    accent_color: userData.accent_color
                };
            });

            const dayDataArray = await supabase
                .from('day_data')
                .select('metadata, day_int, user_id')
                .in('user_id', publicUserIds)
                .lte('day_int', selectedRange[1])
                .gte('day_int', selectedRange[0])
                .order('day_int', { ascending: true });

            if (dayDataArray.error || !dayDataArray.data) {
                throw dayDataArray.error;
            }

            const decryptedMetadataArray = await SecurityClient.decryptMultipleKeys(
                dayDataArray.data.map((userData) => {
                    const sharedObject: { [key: string]: string } = {};
                    if (!accessMap[userData.user_id]) {
                        return sharedObject;
                    }
                    if (accessMap[userData.user_id].shareColors) {
                        sharedObject.day_color = userData.metadata.day_color;
                    }
                    if (accessMap[userData.user_id].shareScores) {
                        sharedObject.day_score = userData.metadata.day_score;
                    }
                    if (accessMap[userData.user_id].shareEmojis) {
                        sharedObject.day_emoji = userData.metadata.day_emoji;
                    }

                    return sharedObject;
                })
            );

            dayDataArray.data.forEach((userData, index) => {
                userData.metadata = decryptedMetadataArray[index];
            });

            const dayWiseCombined: {
                [key: string]: {
                    [key: string]: any;
                };
            } = {};

            dayDataArray.data.forEach((userData) => {
                if (!dayWiseCombined[userData.day_int]) {
                    dayWiseCombined[userData.day_int] = {};
                }
                dayWiseCombined[userData.day_int][userData.user_id] = userData.metadata;
            });

            // const chart = dayDataArray.data.map((x) => ({ day: x.day_int % 100, [x.user_id + '_score']: x.metadata.day_score, [x.user_id + '_emoji']: x.metadata.day_emoji }));
            const scoreChart: {
                [key: string]: string | number;
            }[] = [];
            Object.keys(dayWiseCombined).forEach((dayIntKey) => {
                const dayInt = Number(dayIntKey);
                const dayData = dayWiseCombined[dayIntKey];
                const row: { [key: string]: string | number } = { day: Number(dayInt) % 100 };
                Object.keys(dayData).forEach((userId) => {
                    row[userMap[userId].display_name] = dayData[userId].day_score;
                    // row[userId + '_emoji'] = dayData[userId].day_emoji;
                    // row[userId + '_color'] = dayData[userId].day_color;
                });
                scoreChart.push(row);
            });
            return { publicUserIds, scoreChart, userMap };
        },
        staleTime: Infinity
    });

    console.log(publicMonthQuery.data);

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="pt-6 text-3xl">{monthNames[selectedMonth - 1]}</div>
            <div>
                <Link href={'/p/dashboard/'} className="underline hover:text-primary">
                    View Private Dashboard
                </Link>
            </div>
            <div className="grid w-full grid-cols-1 items-center justify-center gap-4 p-4 lg:w-[70%] lg:grid-cols-2 lg:p-8">
                {/* <Card className="w-fit">
                    <CardHeader>
                        <CardTitle>Calendar of Colors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-fit grid-cols-7 gap-2">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                                <div key={'colors' + day + index} className="flex h-8 w-8 items-center justify-center">
                                    {day}
                                </div>
                            ))}
                            {Array.from({ length: daysInSelectedMonth + firstDayOfMonth - 1 }).map((_, index) => {
                                const dayNumber = index - (firstDayOfMonth - 1) + 1;
                                if (dayNumber <= 0) {
                                    return <div key={'colors' + dayNumber} className="h-8 w-8"></div>;
                                }
                                return (
                                    <TooltipProvider key={'colors' + dayNumber}>
                                        <Tooltip>
                                            <TooltipTrigger className="h-8 w-8 cursor-pointer">
                                                <div
                                                    style={{
                                                        backgroundColor:
                                                            dayIntDataMap[selectedYear * 10000 + selectedMonth * 100 + dayNumber]?.metadata
                                                                .day_color ?? 'a1a1a1',
                                                        border: dayIntDataMap[selectedYear * 10000 + selectedMonth * 100 + dayNumber]
                                                            ? 'none'
                                                            : '1px dashed black'
                                                    }}
                                                    className="h-8 w-8 rounded-sm duration-300"
                                                ></div>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-white">{dayNumber}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
                <Card className="w-fit">
                    <CardHeader>
                        <CardTitle>Calendar of Emotions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-fit grid-cols-7 gap-2">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                                <div key={'emoji' + day + index} className="flex h-8 w-8 items-center justify-center">
                                    {day}
                                </div>
                            ))}
                            {Array.from({ length: daysInSelectedMonth + firstDayOfMonth - 1 }).map((_, index) => {
                                const dayNumber = index - (firstDayOfMonth - 1) + 1;
                                if (dayNumber <= 0) {
                                    return <div key={'emoji' + dayNumber} className="h-8 w-8"></div>;
                                }
                                return (
                                    <TooltipProvider key={'emoji' + dayNumber}>
                                        <Tooltip>
                                            <TooltipTrigger className="h-8 w-8 cursor-pointer">
                                                <div
                                                    style={{
                                                        border: dayIntDataMap[selectedYear * 10000 + selectedMonth * 100 + dayNumber]
                                                            ?.metadata.day_emoji
                                                            ? 'none'
                                                            : '1px dashed black'
                                                    }}
                                                    className="h-8 w-8 rounded-sm text-2xl duration-300"
                                                >
                                                    {dayIntDataMap[selectedYear * 10000 + selectedMonth * 100 + dayNumber]?.metadata
                                                        .day_emoji ?? ''}
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-white">{dayNumber}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card> */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>How were your days ?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <LineChart
                                accessibilityLayer
                                data={publicMonthQuery.data ? publicMonthQuery.data.scoreChart : []}
                                margin={{
                                    left: 0,
                                    right: 0
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="day" tickLine={false} axisLine={true} tickMargin={8} tickFormatter={(value) => value} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

                                {(publicMonthQuery.data?.publicUserIds ?? []).map((userId, index) => (
                                    <Line
                                        key={userId + index}
                                        dataKey={publicMonthQuery.data!.userMap[userId].display_name}
                                        type="monotone"
                                        stroke={publicMonthQuery.data!.userMap[userId].accent_color}
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                ))}
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
