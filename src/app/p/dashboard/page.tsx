'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SecurityClient } from '@/lib/encryption';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

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

export default function DashboardPage() {
    const queryClient = useQueryClient();
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

    console.log(firstDayOfMonth);

    const userMonthQuery = useQuery({
        queryKey: ['user-month'],
        queryFn: async () => {
            const selectedMonthInt = selectedYear * 10000 + selectedMonth * 100;
            const selectedRange = [selectedMonthInt, selectedMonthInt + 99];
            const dayDataArray = await supabase
                .from('day_data')
                .select('metadata, day_int')
                .eq('user_id', user!.id)
                .lte('day_int', selectedRange[1])
                .gte('day_int', selectedRange[0])
                .order('day_int', { ascending: true });

            if (dayDataArray.error || !dayDataArray.data) {
                throw dayDataArray.error;
            }

            const decryptedMetadataArray = await SecurityClient.decryptMultipleKeys(dayDataArray.data.map((userData) => userData.metadata));

            dayDataArray.data.forEach((userData, index) => {
                userData.metadata = decryptedMetadataArray[index];
            });
            return dayDataArray.data;
        },
        staleTime: Infinity
    });

    const dayIntDataMap: { [key: string]: any } = {};
    userMonthQuery.data?.forEach((dayData) => {
        dayIntDataMap[dayData.day_int] = dayData;
    });

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="pt-6 text-3xl">{monthNames[selectedMonth - 1]}</div>
            <div className="m-8 grid grid-cols-1 items-center justify-center gap-4 lg:grid-cols-2">
                <Card className="w-fit">
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
                </Card>
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>How were your days ?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <AreaChart
                                accessibilityLayer
                                data={
                                    userMonthQuery.data
                                        ? userMonthQuery.data.map((x) => ({ day: x.day_int % 100, score: x.metadata.day_score }))
                                        : []
                                }
                                margin={{
                                    left: 12,
                                    right: 12
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideLabel />} />
                                <Area
                                    dataKey="score"
                                    type="natural"
                                    fill="var(--color-desktop)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-desktop)"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
